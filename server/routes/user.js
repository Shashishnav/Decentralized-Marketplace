const express =require('express');

const {signupUser,loginUser,resetpwd}=require('../controllers/userController')

const {listItem, allprods,makebid, updateStatus, getprod, searchByUname, filterProducts}=require('../controllers/itemController');

const { updateDash, getUser } = require('../controllers/dashController');

const router =express.Router();

router.post('/login',loginUser);

router.post('/signup',signupUser);

router.put('/resetpwd',resetpwd)

router.post('/list',listItem)

router.get('/allprods',allprods)

router.put("/makebid",makebid)

router.put("/updatestatus",updateStatus)

router.put("/updateDash",updateDash)

router.post("/getuser",getUser)

router.post("/getproduct",getprod)

router.post("/search",searchByUname)

router.post("/filter",filterProducts)

module.exports=router