const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const PORT = 8000;

const rootDir = require('./util/path');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(rootDir, 'public')));

const loginRoutes = require("./routes/login");
const messageRoutes = require("./routes/message");
const contactRoutes = require("./routes/contact");
const errorController = require("./controllers/errorController");


app.use(loginRoutes);
app.use(messageRoutes);
app.use(contactRoutes);

app.use(errorController.error404)

app.listen(PORT,()=>{
    console.log(`server is listing on PORT: ${PORT}`)
})
