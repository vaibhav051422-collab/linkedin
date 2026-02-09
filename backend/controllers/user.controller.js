import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import ConnectionRequest from "../models/connections.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";

/* ================= PDF UTILITY ================= */
const convertUserDataTOPDF = async (userData) => {
  return new Promise((resolve, reject) => {
    if (!userData || !userData.userId) {
      reject("Invalid user data");
      return;
    }

    const doc = new PDFDocument();
    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("./uploads/" + outputPath);

    doc.pipe(stream);

    if (userData.userId.profilePicture) {
      doc.image(`uploads/${userData.userId.profilePicture}`, {
        align: "center",
        width: 100,
      });
    }

    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio || ""}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPost || ""}`);

    doc.fontSize(14).text("Past Work:");
    (userData.pastWork || []).forEach((work) => {
      doc.text(`Company Name: ${work.company}`);
      doc.text(`Position: ${work.position}`);
      doc.text(`Years: ${work.years}`);
    });

    doc.end();

    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
};

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await Profile.create({ userId: newUser._id });

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = crypto.randomBytes(64).toString("hex");
    user.token = token;
    await user.save();

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= UPLOAD PROFILE PICTURE ================= */
export const uploadProfilePicture = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ token });
    if (!user)
      return res.status(401).json({ message: "Invalid token" });

    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    user.profilePicture = req.file.filename;
    await user.save();

    return res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE USER ================= */
export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token });
    if (!user)
      return res.status(401).json({ message: "Invalid token" });

    const { username, email } = newUserData;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }

    Object.assign(user, newUserData);
    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET USER + PROFILE ================= */
export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture"
    );

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE PROFILE DATA ================= */
export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: user._id },
      { $set: newProfileData },
      { new: true, runValidators: true }
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json({ message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL PROFILES ================= */
export const getAllUsersProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture"
    );
    return res.json(profiles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= DOWNLOAD PROFILE PDF ================= */
export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name username email profilePicture"
    );

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const outputPath = await convertUserDataTOPDF(userProfile);
    return res.json({ message: outputPath });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const sendConnectionRequest = async (req, res) => {
  try{
    const{token, connectionId}= req.body;
    const user=await User.findOne({token: token});
    if(!user){
      return res.status(401).json({message: "Invalid token"});
    }
    const connectionUser=await User.findOne({ _id:connectionId});
    if(!connectionUser){
      return res.status(404).json({message: "User not found"});


    }
    const exisitngRequest=await ConnectionRequest.findOne({
      userId:user._id,
      connectionId:connectionUser._id
    }
    )
    if(exisitngRequest){

      return res.status(400).json({message: "Connection request already sent"});
    }
    const newRequest=new ConnectionRequest({
      userId:user._id,
      connectionId:connectionUser._id
    });
    await newRequest.save();
    return res.status(200).json({message: "Connection request sent successfully"});



      

  }
  catch(error){
    return res.status(500).json({ message: error.message });
  }
}
export const getMyConnectionRequests=async(req,res)=>{

  try{
    const {token}=req.query;
    const user=await User.findOne({token:token});
    if(!user){
      return res.status(401).json({message: "Invalid token"});
    }
    const connection=await ConnectionRequest.find({userId:user._id}).populate("userId","name username email profilePicture");
    return res.json({connection});

  }
  catch(error){
    return res.status(500).json({ message: error.message });
  }
}
export const whatAreMyConnections=async(req,res)=>{
  const {token}=req.query;
  try{
    const user=await User.findOne({ token:token});
    if(!user){
      return res.status(401).json({message: "Invalid token"});
    }
    const connections=await ConnectionRequest.find({connectionId:user._id}).populate("userId","name username email profilePicture");
    return res.json({connections});
    


  }
  catch(error){
    return res.status(500).json({ message: error.message });
  }
}
export const acceptConnectionRequest=async(req,res)=>{
  const{token,requestId,action_type}=req.body;

  try{
    const user=await User.findOne({ token:token});
    if(!user){
      return res.status(401).json({message: "Invalid token"});
    }
    const connection=await ConnectionRequest.findOne({_id:requestId});
    if(!connection){
      return res.status(404).json({message: "Connection request not found"});
    }
    if(action_type==="accept"){
      connection.status_accepted="accepted";
    }
    else{
      connection.status_accepted="rejected";
    }
    await connection.save();

    return res.json({message:"request updated"});

   }
  catch(error){
    return res.status(500).json({ message: error.message });

  }
}




