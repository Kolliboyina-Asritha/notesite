const notesDB=require('../model/notes');
const userDB=require('../model/users');
const notespost=async (req,res)=>{
    try{
    const {title,content,category,userid}=req.body;
    if(!title||!content||!category||!userid) return res.status(400).json({message:"title,content and category,userid are required"});
    const user=await userDB.findById(userid).exec();
    if(!user) return res.status(403).json({message:"user not found"});
    const newnote=await notesDB.create({
        title,
        content,
        category,
        userid:user._id
    });
    console.log(newnote);
    res.status(201).json({message:"notes added succesfully"});
}
catch (err){
    console.log(err);
  res.status(500).json({message:"server error"})
}

}
const getnotesbyname=async (req,res)=>{
    try{
   const {userid}=req.params;

   const foundnotes=await notesDB.find({userid}).sort({createdAt:-1});
   if(!foundnotes.length){
    res.status(404).json({message:"no notes found with this user"});
   }
   console.log(foundnotes);
   res.status(200).json(foundnotes);
    }
    catch (err){
        console.log(err);
        res.status(500).json({message:"server err"});
    }
   
}
const updatenotes=async (req,res)=>{
     try{
    const {title,content,category,userid}=req.body;
    const {noteid}=req.params;
    if(!userid) return res.status(400).json({message:"userid is required"});
    const user=await userDB.findById(userid).exec();
    if(!user) return res.status(403).json({message:"user not found"});
    const updatednote=await notesDB.findOneAndUpdate(
       {_id:noteid,userid:user._id},
       {title,content,category},
       {new:true}

    );
    console.log(updatednote);
    res.status(201).json({message:"notes updated succesfully",
        note: updatednote
     });
}
catch (err){
    console.log(err);
  res.status(500).json({message:"server error"})
}
}
const deletenote=async (req,res)=>{
    try{
    const {noteid}=req.params;
     if (!noteid) {
            return res.status(400).json({ message: "Note ID is required" });
        }
    const deletednote=await notesDB.findOneAndDelete(
        {_id:noteid}
    );
      if (!deletednote) {
            return res.status(404).json({ message: "Note not found" });
        }
    res.status(200).json({message:"note deleted succesfully", note: deletednote});
}
catch (err){
console.error("Error deleting note:", err);
        res.status(500).json({ message: "Internal server error" });
}
}
module.exports={notespost,getnotesbyname,updatenotes,deletenote};