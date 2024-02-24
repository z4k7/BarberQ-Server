import express from "express";
import http from "http";
import userRoute from "../router/userRoute";
import vendorRoute from "../router/vendorRoute";
import adminRoute from "../router/adminRoute";
import tokenRoute from "../router/tokenRoute";
import cors from "cors";

console.log(`Inside config/app`);
const app = express();

const httpServer = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "http://localhost:4200", credentials: true }));

app.use("/api/user", userRoute);
app.use("/api/vendor", vendorRoute);
app.use("/api/admin", adminRoute);
app.use("/api/token", tokenRoute);

app.get("/", (req, res) => {
  res.send("Server Running");
});
export { httpServer };
