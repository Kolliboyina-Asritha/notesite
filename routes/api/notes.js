const express=require('express');
const router=express.Router();
const notesController=require('../../Controller/notesapiController');
router.get('/:userid',notesController.getnotesbyname);
router.post('/',notesController.notespost);
router.put('/:noteid',notesController.updatenotes);
router.delete('/:noteid',notesController.deletenote);
module.exports=router;