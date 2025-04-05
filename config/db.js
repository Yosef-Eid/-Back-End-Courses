
import mongoose from "mongoose";
export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('database connection successful');

    } catch (error) {
        console.log('error connecting' + error.message);
        process.exit(1);
    }
}


