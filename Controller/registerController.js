const userDB=require('./model/users.js');
const bcrypt=require('bcrypt');

const handlenewuser=async (req,res)=>{
    const {user,pwd}=req.body
    if(!user?.pwd) return res.json({"message":"username and password are required"})
    const duplicate=await userDB.findOne({username:user}).exec();
    if(duplicate) return res.json({"message":"duplicates are not allowed"})

    const hashedpwd=bcrypt.hash(pwd,10);
    const newUser=await userDB.create({
    
    "UserInfo":{
      "username":user,
      "roles":roles
    },
    "password":hashedpwd      
   })
    }