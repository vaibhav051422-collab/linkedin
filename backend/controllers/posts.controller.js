import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

// export const activeCheck = async (req, res) => {
//   return res.status(200).json({ message: "RUNNING" });
// };

export const createPost = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });

    await post.save();

    return res.json({ message: "Post created successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};








export  const getAllPosts=async(req,res)=>{
  try{

    const posts = await Post.find().populate("userId","name username email profilePicture");
    return res.status(200).json(posts);
    


  }
  catch(error){
    return res.status(500).json({ message: error.message });
  }};
   export const deletePost=async(req,res)=>{
    const{token,postId}=req.body;
    try{
      const user=await User.findOne({token:token}).select("_id");
      if(!user){
        return res.status(404).json({message:"User not found"});
      }
      const post = await Post.findOne({ _id: postId});
      if(!post){
        return res.status(404).json({message:"Post not found"});
      }
      if(post.userId.toString()!==user._id.toString()){
        return res.status(403).json({message:"Unauthorized action"});
      }
      await Post.deleteOne({_id:post._id});
      return res.status(200).json({message:"Post deleted successfully"});



  }
  catch(error){
    return res.status(500).json({ message: error.message });
  }
}


export const commentPost=async(req,res)=>{
  const{token,post_id,commentBody}=req.body;
  try{
    const user=await User.findOne({token:token}).select("_id");
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    const post=await Post.findOne({_id:post_id});
    if(!post){
      return res.status(404).json({message:"Post not found"});
    }
    const comment=new Comment({
      postId:post._id,
      userId:user._id,
      body:commentBody
    });
    await comment.save();
    return res.status(200).json({message:"Comment added successfully"});

  }
  catch(error){
    return res.status(500).json({ message: error.message });
  }
}



export const get_comments_by_post=async(req,res)=>{
  const{post_id}=req.query;
  try{

    const post=await Post.findOne({_id:post_id});
    if(!post){
      return res.status(404).json({message:"Post not found"});
    }
    const comments=await Comment.find({postId:post_id}).populate("userId","name username email profilePicture");
    return res.status(200).json({comments});

  }
  catch(error){
    return res.status(500).json({ message: error.message });
  }
}

export const delete_comment_of_user=async(req,res)=>{
  const{token,commend_id}= req.body;
  try{
    const user=await User
    .findOne({token:token})
    .select("_id");
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    const comment=await Comment.findOne({_id:commend_id});
    if(!comment){
      return res.status(404).json({message:"Comment not found"});
    }
    if(comment.userId.toString()!==user._id.toString()){
      return res.status(403).json({message:"Unauthorized action"});
    }
    await Comment.deleteOne({_id:comment._id});
    return res.status(200).json({message:"Comment deleted successfully"});





  }
  catch(error){
    return res.status(500).json({ message: error.message });
}
}
export const increment_likes=async(req,res)=>{
  const{post_id}=req.body;

  try{
    const post=await Post.findOne({_id:post_id});
    if(!post){
      return res.status(404).json({message:"Post not found"});
    }
    post.liked+=1;
    await post.save();
    return res.json({message:"Likes incremented",likes:post.liked});

  }
  catch(error){
    return res.status(500).json({ message: error.message });
  }
}
