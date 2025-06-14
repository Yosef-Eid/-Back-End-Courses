import express from "express";
import { upload } from "../utils/uploadAvatar.js";
import { verifyToken } from "../middlewares/verify.js";
import { addGroup, joinUserToGroup, exitUserFromGroup, deleteGroup, removeUserFromGroup, addSubAdmin, joinUserByLink,  } from "../controls/controlGroup.js";

const router = express.Router();

// POST Routes
router.post("/api/addGroup/:channelId", verifyToken, upload, addGroup);
router.post("/api/joinUserToGroup/:groupId", verifyToken, joinUserToGroup);
router.post("/api/exitUserFromGroup/:groupId", verifyToken, exitUserFromGroup);
router.post("/api/removeUserFromGroup/:groupId/:userId", verifyToken, removeUserFromGroup);
router.post("/api/addSubAdmin/:groupId/:userId", verifyToken, addSubAdmin);
router.post("/api/joinUserByLink/:invitationLink", verifyToken, joinUserByLink);
// DELETE Routes
router.delete("/api/deleteGroup/:channelId/:groupId", verifyToken, deleteGroup);


export default router;