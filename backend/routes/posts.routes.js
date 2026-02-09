import { Router } from "express";
import { activeCheck, commentPost, delete_comment_of_user} from "../controllers/posts.controller.js";
import { getAllPosts } from "../controllers/posts.controller.js";
import { deletePost } from "../controllers/posts.controller.js";
import { get_comments_by_post } from "../controllers/posts.controller.js";
import { increment_likes } from "../controllers/posts.controller.js";


const router=Router();


import multer from "multer";
import { createPost } from "../controllers/posts.controller.js";
//router.route('/').post(activeCheck);
export default router;
const storage=multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'./uploads/'),
    filename:(req,file,cb)=>cb (null,Date.now()+'_'+file.originalname)
});

const upload=multer({storage:storage});
router.route('/').post(activeCheck);
router
  .route("/post")
  .post(upload.single("media"), createPost);
  router.route("/posts").get(getAllPosts);
  router.route("/delete_post").delete(deletePost);
 
  router.route("/comments").get(commentPost);
  router.route("/get_comments").get(get_comments_by_post);
  router.route("/delete_comment").delete(delete_comment_of_user);
  router.route("/increment_post_like").post(increment_likes);


