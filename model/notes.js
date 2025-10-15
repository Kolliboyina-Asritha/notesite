
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const notesSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    }

},{timestamps:true})
module.exports=mongoose.model('notes',notesSchema);