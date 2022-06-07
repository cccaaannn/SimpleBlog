// Node
import path from "path";
import fs from "fs";

// Main lib imports
import express from "express";

// Side lib imports
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

// Project imports
import { extractTokenIfExists, decodeAndVerifyToken } from "./core/middlewares/secured-operation.middleware";
import { exceptionHandler } from "./core/middlewares/exception-handler.middleware";
import { notFound } from "./core/middlewares/not-found.middleware";
import UsersRouter from "./routes/api/v1/users.routes";
import PostRouter from "./routes/api/v1/post.routes";
import AuthRouter from "./routes/api/v1/auth.routes";


const app = express();

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('common', { stream: fs.createWriteStream(path.join(__dirname, '../logs/access.log'), { flags: 'a' }) }))


app.use('/api/v1/users', extractTokenIfExists(), decodeAndVerifyToken(), UsersRouter);
app.use('/api/v1/posts', extractTokenIfExists(), PostRouter);
app.use('/api/v1/auth', AuthRouter);

app.use('*', notFound());
app.use(exceptionHandler());


export default app 
