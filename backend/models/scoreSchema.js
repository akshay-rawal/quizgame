import mongoose from "mongoose";


const scoreSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:['Cinema',"General Knowledge","History","Politics"]
    },
    score:{
        type:Number,
        required:true
    },
   answers:[
      {  questionId:{type:mongoose.Schema.Types.ObjectId,ref:"Question",required:true},
    
           selectedOptions:{type:String,required:true},
           isCorrect:{type:Boolean,required:true},
           category:{
            type:String,
            required:true,
            enum:['Cinema',"General Knowledge","History","Politics"]
        },
    
    
    }

   ]
     
   
   
},
{timestamps:true} 
)

const Score = mongoose.model("Score",scoreSchema);
export default Score;