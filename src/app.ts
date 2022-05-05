// Main lib imports
import express from "express";

// Side lib imports
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import helmet from 'helmet';

// Project imports
import { extractAndValidateToken } from "./core/middlewares/secured-operation.middleware";
import UsersRouter from "./routes/api/v1/users.routes";
import PostRouter from "./routes/api/v1/post.routes";
import AuthRouter from "./routes/api/v1/auth.routes";
import { exceptionHandler } from "./core/middlewares/exception-handler.middleware";
import { notFound } from "./core/middlewares/not-found.middleware";


const app = express();

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.use('/api/v1/users', extractAndValidateToken(), UsersRouter);
app.use('/api/v1/posts', PostRouter);
app.use('/api/v1/auth', AuthRouter);

app.use('*', notFound());
app.use(exceptionHandler());


export default app 
