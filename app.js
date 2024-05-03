const express = require("express");
const bodyParser = require("body-parser");
const PORT = 8000;

const app = express();
app.use(bodyParser.urlencoded({extended:false}));

const loginRoutes = require("./routes/login");
const messageRoutes = require("./routes/message");

app.use(loginRoutes);
app.use(messageRoutes);

app.use((req, res) =>{
    res.status(404).send("Page Not Found");
})

app.listen(PORT,()=>{
    console.log(`server is listing on PORT: ${PORT}`)
})
