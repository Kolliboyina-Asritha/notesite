const userDB=require('../model/users');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const handleLogin= async (req,res)=>{
    const cookies=req.cookies;
    console.log(`cookies already available at login ${json.stringify(cookies)}`);
    const {user,email,pwd}=req.body;
    if(!user||!pwd||!email) return res.json({"message":"username ,password and email are required"})
    const foundUser=await userDB.findOne({username:user}).exec();
    if(!foundUser) res.sendStatus(401);//unauthorised
    const match=await bcrypt.compare(pwd,foundUser.password);
    if(match){
        const roles=Object.values(foundUser.roles);
        const accessToken=jwt.sign(
            {"UserInfo":{
                "username":foundUser.username,
                "email":foundUser.email,
                "roles":roles
            }
           },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'50s'}
        )

       const newRefreshToken=jwt.sign(
        {"username":foundUser.username},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'1d'}
       )
       //rotation:-new refreshtoken replaces old each time user logs in or refreshes
       let newRefreshTokenArray=
           !cookies?.jwt
           ?foundUser.refrehToken
           :foundUser.refrehToken.filter(rt=>rt!==cookies.jwt)//deletes the string(refreshtoken)that already exists in the cookie.
        //reuse detection
        if(cookies?.jwt){
            const refrehToken=cookies.jwt;
            const foundUser= await userDB.findOne({refrehToken}).exec();
            if(!foundUser){
                //reuse may happend
                newRefreshTokenArray=[];
            }
            res.clearCookie('jwt',{httpOnly:true});
        }
        //saving new refresh token with the user found
        foundUser.refrehToken=[...newRefreshTokenArray,newRefreshToken];
        const result=await foundUser.save();
        console.log(result);
        console.log(roles);
        res.cookie('jwt',newRefreshToken,{httpOnly:true,sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        res.json({roles,accessToken});
       }
    }
    module.exports={handleLogin};

