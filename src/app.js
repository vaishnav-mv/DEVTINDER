const express = require('express');
const app = express();

app.use("/",(req,res)=>{
    res.end("hello from server");
});
app.use("/about",(req,res)=>{
    res.end("hello from server you are in about page");
});
app.use("/contact",(req,res)=>{
    res.end("hello from server you are in contact page");
});

app.listen(8000,()=>{
    console.log("listening to port 8000");
});