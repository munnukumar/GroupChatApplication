const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const socket = require("socket.io");
const http = require("http");
const cron = require('cron');

const error = require("./controllers/error");
const User = require("./models/user");
const Messages = require("./models/message");
const Group = require("./models/groups");
const GroupMember = require("./models/groupmember");
const database = require("./util/database");
const authenticateSocket = require("./middlewares/authSocket");
const messagesSocket = require("./sockets/messages");
const groupsSocket = require("./sockets/groups");
const  {archiveOldMessages}  = require("./util/cron")



const app = express();
const server = http.createServer(app);
// const io = socket(server)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
dotenv.config();
app.use(cors());

const io = socket(server, {
    cors: {
        origin: "*"
    }
});

const user = require("./routes/user");
const contact = require("./routes/contact");
const groups = require("./routes/groups");
const upload = require("./routes/upload");

app.use(user);
app.use(contact);
app.use(groups);
app.use(upload);

app.use(error.error404);

User.hasMany(Messages);
Messages.belongsTo(User);

Group.belongsToMany(User, { through: GroupMember });
User.belongsToMany(Group, { through: GroupMember });
Group.hasMany(Messages);
Messages.belongsTo(Group)

database
    .sync()
    // .sync({ force: true })
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
        console.log("Database connected");

        const job = new cron.CronJob('0 0 * * *', archiveOldMessages, null, false, 'Asia/Kolkata');
        job.start();

        io.on("connection", async (socket) => {
            socket.on("message", (message) => {
                authenticateSocket(socket, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        messagesSocket.postMessages(socket, message);
                    }
                });
            });
            authenticateSocket(socket, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    socket.on("create-group", (groupData) => {
                        groupsSocket.createGroup(io, socket, groupData);
                    })
                    socket.on("get-groups", (cb) => {
                        groupsSocket.getAllGroups(socket, cb);
                    })
                    socket.on("get-messages", () => {
                        messagesSocket.getAllMessages(socket);
                    })
                    socket.on("user-left", () => {
                        socket.broadcast.emit("user-left", { username: socket.user.name });
                    })
                    socket.on("get-group-members", (groupId) => {
                        socket.join(groupId);
                        groupsSocket.getGroupMembers(socket, groupId);
                        groupsSocket.getGroupMessages(socket, groupId);
                        socket.on("post-group-message", (message) => {
                            groupsSocket.postMessages(socket, message, groupId);
                        });
                    });
                }
            })
            socket.on("disconnect", () => {
            });
        })
    }).catch(err => console.error(err));