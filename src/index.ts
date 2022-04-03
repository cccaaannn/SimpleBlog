// Main lib imports
import express from "express";

// Side lib imports
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';

// Project imports
import { extractAndValidateToken } from "./core/middlewares/secured-operation.middleware";
import UsersRouter from "./routes/api/v1/users.routes";
import PostRouter from "./routes/api/v1/post.routes";
import AuthRouter from "./routes/api/v1/auth.routes";
import { exceptionHandler } from "./core/middlewares/exception-handler.middleware";



const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());

app.use('/api/v1/users', extractAndValidateToken(), UsersRouter);
app.use('/api/v1/posts', extractAndValidateToken(), PostRouter);
app.use('/api/v1/auth', AuthRouter);

app.use(exceptionHandler());


// Connect to db
try {
	mongoose.connect(process.env.MONGO_CONNECTION_STRING as string)
	console.info("Db connected");
}
catch(err) {
	console.error(err);
	process.exit(1);
}


// start app
try {
	const PORT = parseInt(process.env.PORT as string) as number
	const IP = process.env.IP as string

	app.listen(PORT, IP);
	console.info(`App started on http://${IP}:${PORT}`);
}
catch(err) {
	console.error(err);
	process.exit(1);
}

