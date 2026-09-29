import mongoose from 'mongoose';
import dns from "dns";

// cluster ki wajah se connect nhi ho pa rha tha isliye 8.8.8.8 and 8.8.4.4 use kia
dns.setServers(["8.8.8.8", "8.8.4.4"]); 

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); 
    }
};

export default connectDB;