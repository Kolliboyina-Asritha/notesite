const allowedOrigins=require('./allowedOrigins');
const corsOptions={
 origin:(origin,callback)=>{
    if(allowedOrigins.indexOf(origin)||!origin){
        console.log(`${origin} successfully verified by cors`);
        callback(null,true);
    }
    else{
        console.log(`${origin} is not allowed by cors and is blocked`);
        callback(new Error("no allowed by cors"));
    }
 },
 optionsSuccessStatus:200
}
module.exports=corsOptions;
