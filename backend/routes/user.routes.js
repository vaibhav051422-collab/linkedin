import { Router } from "express";
import { register, Login, uploadProfilePicture } from "../controllers/user.controller.js";
import multer from "multer";
import { updateUserProfile, getUserAndProfile } from "../controllers/user.controller.js";
import { updateProfileData } from "../controllers/user.controller.js";
import { getAllUsersProfile } from "../controllers/user.controller.js";
import { downloadProfile } from "../controllers/user.controller.js";
import { sendConnectionRequest, getMyConnectionRequests, whatAreMyConnections, acceptConnectionRequest } from "../controllers/user.controller.js";
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});

const upload = multer({ storage });

router.post("/register", register);
router.post("/login", Login);
router.post("/update_profile_picture",upload.single("uploadprofilePicture"),uploadProfilePicture);
router.route('/user_update').post(updateUserProfile);
router.route('/get_user_and_profile').get(getUserAndProfile);
router.route('/update_profile_data').post(updateProfileData);
router.route('/user/get_all_users').get(getAllUsersProfile);
router.route('/user/download_resume').get(downloadProfile); 
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/getConnectionRequests").get(getMyConnectionRequests);
router.route("/user/user_connection_request").get(whatAreMyConnections);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);


export default router;
