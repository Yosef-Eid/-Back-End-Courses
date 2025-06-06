
import express from "express";
import connectDB from "./config/db.js";
import http from "http";
import { Server } from "socket.io";

import auth from "./routes/auth.js";
import course from './routes/course.js'
import channel from './routes/channel.js'
import videos from "./routes/videos.js";
import reviews from './routes/reviews.js'
import comments from './routes/comments.js'

const app = express();

import cors from "cors";
app.use(cors());
app.use(express.json());


// Create server and socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Setup socket.io event
app.set("io", io);

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// routes
app.use("/", auth);
app.use("/", course);
app.use("/", channel);
app.use("/", videos);
app.use("/", reviews);
app.use("/", comments);

// Connect to database and start server
connectDB()
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
