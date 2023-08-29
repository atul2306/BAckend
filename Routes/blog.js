const express = require("express")
const router= express.Router();
const blogcontroller = require("../Controllers/blog")
const multer = require("../Config/multer")
router.post("/addBlog", multer.single("media") ,blogcontroller.blog_add_controller)       
router.post("/editBlogTitle",blogcontroller.Updateblogtitle)       
router.post("/editBlogDescription",blogcontroller.UpdateblogDescription)       
router.post("/AddLike",blogcontroller.likeAndUnlikeBlog)       
router.post("/AddComment",blogcontroller.commentsOnBlog)       
router.post("/deleteBlog",blogcontroller.DeleteBlog)       
router.get("/getAllBlog",blogcontroller.getAllBlog)       

module.exports=router;