import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';

import UsersRouter from "./routes/api/v1/users.routes";
import PostRouter from "./routes/api/v1/post.routes";
import LoginRouter from "./routes/api/v1/login.routes";
import { extractAndValidateToken } from "./core/middlewares/secured-operation";


dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());

mongoose.connect(process.env.MONGO_CONNECTION_STRING as string, () => {
	console.log(`db connected`)
})


app.use('/api/v1/users', extractAndValidateToken(), UsersRouter);
app.use('/api/v1/posts', extractAndValidateToken(), PostRouter);
app.use('/api/v1/auth', LoginRouter);


const PORT: number = parseInt(process.env.PORT as string) as number
const IP: string = process.env.IP as string


// start app
app.listen(PORT, IP, () => {
	console.log(`app listening at ${IP}:${PORT}`)
})
