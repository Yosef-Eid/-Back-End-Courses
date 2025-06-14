import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    avatar: { type: String, required: true },
    public: { type: Boolean, default: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subAdmins: [],
    invitationLink: { type: String },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", GroupSchema);
export default Group;
