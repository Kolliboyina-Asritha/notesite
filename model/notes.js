const mongoose=required('mongoose');
const Schema=mongoose.Schema;
const notesSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    }

})
module.exports(mongoose.model('notes',notesSchema));