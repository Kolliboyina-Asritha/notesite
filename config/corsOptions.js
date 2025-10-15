const allowedOrigins=require('./allowedOrigins');
const corsOptions={
 origin:(origin,callback)=>{
    if(allowedOrigins.indexOf(origin)!== -1||!origin){
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
