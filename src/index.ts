import express from "express";

import mongoose from "mongoose";

import { router as usersRouter } from "./routes/api/users.routes";
import { router as postRouter } from "./routes/api/post.routes";
import { router as loginRouter } from "./routes/api/login.routes";


const dotenv = require('dotenv');
dotenv.config();



const app = express();


app.use(express.urlencoded({ extended: true }))
app.use(express.json())


mongoose.connect(process.env.MONGO_CONNECTION_STRING || "", () => {
	console.log(`db connected`)
})


app.get('/', (req, res) => {
	res.send("hi");
});


app.use('/api/users', usersRouter);
app.use('/api/posts', postRouter);
app.use('/api/login', loginRouter);


const PORT: number = parseInt(process.env.PORT || "3000")
const IP: string = process.env.IP || "localhost"


// start app
app.listen(PORT, IP, () => {
	console.log(`app listening at ${IP}:${PORT}`)
})
