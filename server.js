

import express from "express";
import adminRouter from "./routes/adminRouter.js";
import subAdminRouter from "./routes/subadminRouter.js";
import branchRouter from "./routes/branchRouter.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// import productRouter from "./routes/productRouter.js";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import farmerRouter from "./routes/farmerRouter.js";
import newofferRouter from "./routes/newofferRouter.js";
import cors from "cors";
import mongoose from "mongoose";
import milkRouter from "./routes/milkRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import loanRouter from "./routes/loanRouter.js";
import transactionRouter from "./routes/transactionRouter.js";
import onlineCustomerRouter from "./routes/onlinecustomerRouter.js";
import onlineOrderRouter from "./routes/onlineOrderRouter.js";

// ✅ Import required modules for Socket.io
import { Server } from "socket.io";
import http from "http";

dotenv.config({
  path: "./.env",
});

const app = express();
app.use(
  cors({
    // origin:process.env.CORS_ORIGIN,
    origin: "https://milk-dairy-frontend-aws.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Credentials', 'true');
//     next();
// });



// Routes
app.use("/api/v1/admin", adminRouter); // Prefixing all admin routes with /admin
app.use("/api/v1/subadmin", subAdminRouter); // Prefixing all subadmin routes with /subadmin (if you're using subadmin routes)
app.use("/api/v1/branch", branchRouter);
app.use("/api/v1/customer", farmerRouter);
// app.use("/api/v1/product", productRouter);
app.use("/api/v1/farmer", farmerRouter);
app.use("/api/v1/new-offer", newofferRouter);
app.use("/api/v1/milk", milkRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/loan", loanRouter);
app.use("/api/v1/transaction", transactionRouter);
app.use("/api/v1/otp-verification", onlineCustomerRouter);
app.use("/api/v1/online-order" , onlineOrderRouter);


// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ✅ Create HTTP Server for Express + Socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin:process.env.CORS_ORIGIN,
    origin: "https://milk-dairy-frontend-aws.vercel.app", // Adjust this to match your frontend
    methods: ["GET", "POST"],
  },
});
console.log(process.env.CORS_ORIGIN);

// ✅ Handle WebSocket Connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// ✅ Export io for use in controllers
export { io, server };

// ✅ Start the Server with Database Connection
connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`App is listening on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err);
  });
