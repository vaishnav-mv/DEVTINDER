const express = require('express');
const connectDB = require("./config/database.js")
const app = express();
const cookieParser = require("cookie-parser");


app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const userRouter = require('./routes/user')

app.use('/',authRouter)
app.use('/profile',profileRouter)
app.use('/request',requestRouter)
app.use('/user',userRouter)

connectDB()
.then(()=>{
    console.log("database connection established successfully");
    app.listen(8000,()=>{
        console.log("listening to port 8000");
    });
})
.catch(()=>{
    console.log("database connection not established");
})
  