const jwt=require('jsonwebtoken');
const userDB=require('../model/users');
const handlerefreshtoken=async (req,res)=>{
    const cookies=req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401);
    const refrehToken=cookies.jwt;
    res.clearCookie('jwt',{httpOnly:true});
    const foundUser=await userDB.findOne({refrehToken});
    if(!foundUser){
        jwt.verify(
            refrehToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err,decoded)=>{
             if(err) return res.sendStatus(403);
             console.log("attempted to reuse refreshtoken");
             const hackeduser=await userDB.findOne({username:decoded.username}).exec();
             hackeduser.refrehToken=[];
             const result=await hackeduser.save();
             console.log(result);
            }

        )
        return res.sendStatus(403);
    }
    //if user found then remove the current refreshtoken in that array
    const newRefreshTokenArray=foundUser.refreshToken.filter(rt=>rt!==refrehToken);
    //if the refreshtoken contained user is found but refrestoken is expired then remove it from db so that no reuse can be possible
    //during verification of jwt ,if any err comes then it is saying the token is expired hence not verified
    jwt.verify(
        refrehToken,
         process.env.REFRESH_TOKEN_SECRET,
         async (err,decoded)=>{
            if(err){
                console.log("expired refreshtoken");
                foundUser.refrehToken=[...newRefreshTokenArray];
                const result=await foundUser.save();
                console.log(result);
            }
            if(err||foundUser.username!==decoded.username) return res.sendStatus(403);
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
                   //saving new refresh token with the user found
                    foundUser.refrehToken=[...newRefreshTokenArray,newRefreshToken];
                    const result=await foundUser.save();
                    console.log(result);
                    console.log(roles);
                    res.cookie('jwt',newRefreshToken,{httpOnly:true,sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
                    res.json({roles,accessToken});                                   
            }           
    );
    
}
module.exports={handlerefreshtoken}