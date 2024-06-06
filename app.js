const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
dotenv.config();
app.use(cors());

const messages = require("./routes/message");
const user = require("./routes/user");
const contact = require("./routes/contact");
const error = require("./controllers/error");
const database = require("./util/database");
const User = require("./models/user");
const Messages = require("./models/message");

app.use(messages);
app.use(user);
app.use(contact);

app.use(error.error404);

User.hasMany(Messages);
Messages.belongsTo(User);

database
    .sync()
    // .sync({ force: true })
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
        console.log("Database connected");
    }).catch(err => console.error(err));