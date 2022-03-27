import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import UsersRouter from "./routes/api/v1/users.routes";
import PostRouter from "./routes/api/v1/post.routes";
import LoginRouter from "./routes/api/v1/login.routes";


dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


mongoose.connect(process.env.MONGO_CONNECTION_STRING as string, () => {
	console.log(`db connected`)
})


app.use('/api/v1/users', UsersRouter);
app.use('/api/v1/posts', PostRouter);
app.use('/api/v1/login', LoginRouter);


const PORT: number = parseInt(process.env.PORT as string) as number
const IP: string = process.env.IP as string


// start app
app.listen(PORT, IP, () => {
	console.log(`app listening at ${IP}:${PORT}`)
})
