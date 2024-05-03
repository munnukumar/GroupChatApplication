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


app.use(loginRoutes);
app.use(messageRoutes);
app.use(contactRoutes);

app.use((req, res) =>{
    res.sendFile(path.join(rootDir, 'views', '404.html'))
})

app.listen(PORT,()=>{
    console.log(`server is listing on PORT: ${PORT}`)
})
