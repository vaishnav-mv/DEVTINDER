const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref:"User", //reference to the User collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

// Add a compound index to enforce uniqueness on fromUserId and toUserId
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true }); //it is also handled in the api level

//similar to the schema method, we can create schema validations  / schema pre method . pre is  a function on schema. It is like a middleware
connectionRequestSchema.pre("save",function(next){    //before saving, this pre method will be called
    const connectionRequest = this
    //check if fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself")
    }
    next()
})



const ConnectionRequest = new mongoose.model(
    "ConnectionRequest",         // This is the name of collection in the database
    connectionRequestSchema
  );
  
module.exports = ConnectionRequest;