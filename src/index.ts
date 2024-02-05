import { httpServer } from "./infrastructure/config/app";
import { connectDb } from "./infrastructure/config/connectDb";
import dotenv from 'dotenv'
dotenv.config()

const startServer = async () => {
  try {
    await connectDb();

    const app = httpServer;
    const PORT = process.env.PORT || 7000;
    app?.listen(PORT, () => console.log(`Connected to Server. running at ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();  
 