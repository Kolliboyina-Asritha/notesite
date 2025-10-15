const userDB=require('../model/users');
const bcrypt=require('bcrypt');

const handlenewuser=async (req,res)=>{
    const {user,email,pwd}=req.body
    if(!user||!pwd||!email) return res.json({"message":"username ,password and email are required"})
    const duplicate=await userDB.findOne({username:user}).exec();
    if(duplicate) return res.json({"message":"duplicates are not allowed"})
    try{
    const hashedpwd=await bcrypt.hash(pwd,10);
    const newUser= await userDB.create({
      username:user,
      email:email,
      password:hashedpwd
    });
    res.status(201).json({
    success: `New user ${user} created successfully`
     });

  }
  catch (err) {
    res.status(500).json({"message":err.message})
  }
}
module.exports={handlenewuser};