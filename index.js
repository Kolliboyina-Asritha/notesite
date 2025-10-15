const express=require('express');
const app=express();
const path=require('path');
const PORT=process.env.PORT||6006;
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const credentials=require('./middleware/credentials');
const verifyJWT=require('./middleware/verifyJWT');
const connectDB=require('./config/dbconnect');
const cors=require('cors');
const corsOptions=require('./config/corsOptions');

connectDB();
app.use(credentials);


app.use(cors(corsOptions));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());




app.use('/',express.static(path.join(__dirname,'public')))
app.use('/',require('./routes/root'));
app.use('/register',require('./routes/api/register'));
app.use('/auth',require('./routes/api/auth'));
app.use('/refresh',require('./routes/api/refresh'));
app.use('/logout',require('./routes/api/logout'));

mongoose.connection.once('open',()=>{
    console.log("mongodb connection is succesful");
    app.listen(PORT,()=>{console.log(`server is runnig in ${PORT}`);});
})

