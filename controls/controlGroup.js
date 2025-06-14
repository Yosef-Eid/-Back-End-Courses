import Channel from "../models/channel.js";
import Group from "../models/group.js";
import { uploadToCloudinary } from "../utils/uploadAvatar.js";
import crypto from "crypto";

// Utility for responses
const sendError = (res, status, message) => res.status(status).json({ message });

// Add a new group to a channel

export const addGroup = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { id: userId } = req.user;
    const channel = await Channel.findById(channelId);

    if (!channel) return sendError(res, 404, "Channel not found");
    if (!channel.user || !channel.user.equals(userId))
      return sendError(res, 403, "You are not allowed");

    // Validate avatar file
    if (!req.files?.avatar?.[0]?.path) {
      return sendError(res, 400, "Avatar image is required");
    }
    const avatarGroupPath = req.files.avatar[0].path;
    const thumbnail = await uploadToCloudinary(avatarGroupPath, "upload");
    const invitationLink = crypto.randomBytes(16).toString("hex");

    const newGroup = new Group({
      ...req.body,
      avatar: thumbnail,
      user: userId,
      members: [userId],
      invitationLink,
    });

    const result = await newGroup.save();
    channel.groups.push(newGroup._id);
    await channel.save();

    // Emit real-time event to notify clients
    req.app.get("io").emit("groupAdded", result);

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, error.message);
  }
};

// User joins a group by ID

export const joinUserToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { id: userId } = req.user;
    const group = await Group.findById(groupId);

    if (!group) return sendError(res, 404, "Group not found");
    if (group.members.includes(userId)) return sendError(res, 403, "You are already in this group");

    group.members.push(userId);
    await group.save();
    return res.status(200).json(group);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, error.message);
  }
};

// User joins a group via invitation link

export const joinUserByLink = async (req, res) => {
  try {
    const { invitationLink } = req.params;
    const { id: userId } = req.user;
    const group = await Group.findOne({ invitationLink });

    if (!group) return sendError(res, 404, "Group not found");
    if (group.members.includes(userId)) return sendError(res, 403, "You are already in this group");

    group.members.push(userId);
    await group.save();
    return res.status(200).json(group);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, error.message);
  }
};

// User exits from a group

export const exitUserFromGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { id: userId } = req.user;
    const group = await Group.findById(groupId);

    if (!group) return sendError(res, 404, "Group not found");
    if (!group.members.includes(userId)) return sendError(res, 403, "You are not in this group");
    if (group.user.equals(userId)) return sendError(res, 403, "Owner cannot exit the group");

    group.members.pull(userId);
    group.subAdmins.pull(userId);

    await group.save();
    return res.status(200).json({ message: "You have left the group" });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, error.message);
  }
};

// Remove a user from group (only by owner or sub-admin)

export const removeUserFromGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const { id: currentUserId } = req.user;
    const group = await Group.findById(groupId);

    if (!group) return sendError(res, 404, "Group not found");
    if (!group.members.includes(userId)) return sendError(res, 403, "User is not in this group");

    // Prevent removing owner
    if (group.user.equals(userId)) return sendError(res, 403, "Cannot remove the owner of the group");
    // Only owner or sub-admins can remove
    if (!group.user.equals(currentUserId) && !group.subAdmins.includes(currentUserId))
      return sendError(res, 403, "You are not allowed");

    group.members.pull(userId);
    group.subAdmins.pull(userId);
    await group.save();

    return res
      .status(200)
      .json({ message: "The user has been removed from the group." });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, error.message);
  }
};

// Delete a group (only by owner)

export const deleteGroup = async (req, res) => {
  try {
    const { groupId, channelId } = req.params;
    const { id: userId } = req.user;

    const group = await Group.findById(groupId);
    if (!group) return sendError(res, 404, "Group not found");

    const channel = await Channel.findById(channelId);
    if (!channel) return sendError(res, 404, "Channel not found");

    if (!group.user.equals(userId)) return sendError(res, 403, "You are not allowed");

    await group.deleteOne();
    channel.groups.pull(groupId);
    await channel.save();

    return res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, error.message);
  }
};

// Add a sub-admin to a group (only owner or sub-admin)

export const addSubAdmin = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const { id: currentUserId } = req.user;
    const group = await Group.findById(groupId);

    if (!group) return sendError(res, 404, "Group not found");
    if (!group.members.includes(userId)) return sendError(res, 403, "User is not a member of the group");
    if (!group.user.equals(currentUserId) && !group.subAdmins.includes(currentUserId))
      return sendError(res, 403, "You cannot add admins. You are not the owner or admin of the group.");
    if (group.subAdmins.includes(userId) || group.user.equals(userId))
      return sendError(res, 403, "This user is already an administrator, please choose another user");

    group.subAdmins.push(userId);
    await group.save();
    return res
      .status(200)
      .json({ message: "The user has been added to the admin list." });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, error.message);
  }
};