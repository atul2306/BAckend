const Blog = require("../model/BlogPost");
const User = require("../model/User");
const Cloudinary = require("../Config/Cloudinary");




module.exports.blog_add_controller = async (req, res) => {
  try {
    
    const { id, title, description , media } = req.body;
    const { path } = req.file;
   console.log(path,13);
    
    const image = await Cloudinary.uploader.upload(path, {
       resource_type:"auto",
      folder: "BLOG",
      use_filename: true,
    });
    const user = await User.findById(id);
    const newPost = {
      caption: title,
      description,
      image: {
        public_id: image.public_id,
        url: image.url,
      },
      owner: id,
    };

    const postCreate = await Blog.create(newPost);
    
    user.posts.push(postCreate._id);

    await user.save();

    res.status(201).json({
      ok: true,
      message: "Post Created",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.Updateblogtitle = async (req, res) => {
  try {
    const { userid, postid ,newTitle , id} = req.body
    if(userid !== id){
      return res.status(400).json({
        ok: false,
        message: "you cant Update",
      });
    }
    const user = await User.findById(userid);

    if (user.posts.includes(postid)) {
      const post = await Blog.findById(postid);
      post.caption = req.body.newTitle;
      await post.save();
      return res.status(200).json({
        ok: true,
        message: "Title Updated",
      });
    } else {
      return res.status(400).json({
        ok: false,
        message: "you cant Update",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.UpdateblogDescription = async (req, res) => {
    try {
    const { userid, postid ,newDescription , id} = req.body
    if(userid !== id){
      return res.status(400).json({
        ok: false,
        message: "you cant Update",
      });
    }

      const user = await User.findById(userid);
      if (user.posts.includes(postid)) {
        const post = await Blog.findById(postid);
        post.description = req.body.newDescription;
        await post.save();
        return res.status(200).json({
          ok: true,
          message: "description Updated",
        });
      } else {
        return res.status(400).json({
          ok: false,
          message: "you cant Update",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };




module.exports.DeleteBlog = async (req, res) => {
    try {
     
      const { userid,postid , id} = req.body
      if(id !== userid) {
        return res.status(400).json({
          ok: false,
          message: "Unauthorised",
        });
      }
      const post = await Blog.findById(postid);
      if (!post) {
        return res.status(400).json({
          ok: false,
          message: "Post Not Found",
        });
      }
      if (post.owner != userid) {
        return res.status(400).json({
          ok: false,
          message: "Unauthorised",
        });
      }
      await post.deleteOne(); 
      const user = await User.findById(userid);
      const index = user.posts?.indexOf(postid);
      
      if (index) {
        user.posts?.splice(index, 1);
        await user.save();
        return res.status(202).json({
          ok: true,
          message: "POST DELETED",
        });
      } else {
        return res.status(400).json({
          ok: false,
          message: "some error Found",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  module.exports.likeAndUnlikeBlog = async (req, res) => {
    try {
      const { userid,postid} = req.body
      
      const post = await Blog.findById(postid);
      if (!post) {
        return res.status(400).json({
          ok: false,
          message: "Post Not Found",
        });
      }
      console.log(userid,165);
      if (post.likes.includes(userid)) {
      console.log(userid,167);
      console.log(post.likes,168);

        const index = post.likes.indexOf(userid);
        post.likes.splice(index, 1);
        await post.save();
        return res.status(200).json({
          ok: true,
          post: post.likes,
          message: "POST DISLIKED",
        });
      } else {
        post.likes.push(userid);
        await post.save();
        return res.status(200).json({
          ok: true,
          post: post.likes,
          message: "POST LIKED",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };


  module.exports.commentsOnBlog = async (req, res, next) => {
    try {
      const { postid, userid, comment } = req.body;
      if (!postid || !userid || !comment) {
        return res.status(400).json({
          ok: false,
          message: "Enter comment",
        });
      }
      const post = await Blog.findById(postid);
      if (!post) {
        return res.status(400).json({
          ok: false,
          message: "post not found",
        });
      }
      const commentindex = post?.comments?.user?.indexOf(userid);
      if (commentindex >= 0) {
        post.comments[commentindex].comment = comment;
        await post.save();
      } 
      else {
        post.comments.push({
          user: userid,
          comment: comment,
        });
        await post.save();
      }
      return res.status(200).json({
        ok: true,
        message: "comment added",
        comments:post.comments
      });
    } catch (err) {
      console.log(err);
    }
  };

  module.exports.getAllBlog = async (req, res, next) => {
    try {
      const blog = await Blog.find();
      // console.log(post);
      return res.status(200).json({
        ok: true,
        blog,
      });
    } catch (err) {
      console.log(err);
    }
  };

  module.exports.getBlogFromId = async (req, res, next) => {
    try {
      const blog = await Blog.findById(req.body.id);
      return res.status(200).json({
        ok: true,
        blog,
      });
    } catch (err) {
      console.log(err);
    }
  };


  