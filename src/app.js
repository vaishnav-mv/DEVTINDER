const express = require('express');
const connectDB = require("./config/database.js")
const app = express();
const cookieParser = require("cookie-parser");
const cors=require('cors')
const http=require('http')
require('dotenv').config()
const initializeSocketServer = require('./utils/socket.js');

app.use(cors({
  origin: "http://localhost:5173",  // your frontend origin
  credentials: true
}));
app.use(express.json()); //build in middleware
app.use(cookieParser()); //third party middleware

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat.js');

app.use('/',authRouter)
app.use('/profile',profileRouter)
app.use('/request',requestRouter)
app.use('/user',userRouter)
app.use('/chat',chatRouter)

const server=http.createServer(app)
initializeSocketServer(server)


connectDB()
.then(()=>{
    console.log("database connection established successfully");
    server.listen(process.env.PORT,()=>{
        console.log("listening to port 8000");
    });
})
.catch(()=>{
    console.log("database connection not established");
})
  