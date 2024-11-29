app.get("/users",async (req,res)=>{
    const userEmail = req.body.emailId;
    try{
        const user = await User.find({emailId:userEmail}); //user is an array. user.length can be used to handle empty array
        if(user.length===0){
            res.status(404).send("user not found");
        }else{
            res.status(400).send(user);
        }
        
    }catch(err){
        console.log("something went wrong");
    }
})

//feed api to get all users from the database
app.get("/feed",async (req,res)=>{
    try{
        const user = await User.find({})
        if(!user){
            res.send("user not found");
        }else{
            res.send(user)
        }
    }catch(err){
        console.log("something went wrong");
    }
})

app.delete("/users",async (req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
    }catch(err){
        res.status(404).send("user not found");
    }
})

app.patch("/users/:userId",async(req,res)=>{
    const userId = req.params?.userId; //if we give req.body.userId we should provide it in the body 
    const data = req.body;

    try{
        const ALLOWED_UPDATES = ["firstName","lastName","password","age","gender","photoUrl","about","skills"];
        const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("update not allowed");
        }
        if(data.skills.length>10){
            throw new Error("Max limit for adding skills exceeded"); //this is api level validation. you can also do this at db level
        }

        const user = await User.findByIdAndUpdate(userId,data,{
            returnDocument:"after",
            runValidators:true
        });
        res.send("user updated successfully");
    }catch(err){
        res.status(404).send("update failed: "+err.message);
    }
})