const express=require("express")
const router= express.Router();
const authcontroller = require("../Controllers/auth")

router.post("/signup",authcontroller.auth_signup_controller)       
router.post("/signin",authcontroller.auth_signin_controller)        

module.exports=router;