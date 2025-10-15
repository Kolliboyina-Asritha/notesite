
const express=require('express');
const router=express.Router();
const refreshTokenController=require('../../Controller/refreshTokenController');
router.post('/',refreshTokenController.handlerefreshtoken);
module.exports=router;