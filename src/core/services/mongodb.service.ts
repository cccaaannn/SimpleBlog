import mongoose from 'mongoose';

import { MongoMemoryServer } from 'mongodb-memory-server';

import Envs from '../types/enums/Envs';


let mongod: any = null;

async function connect(): Promise<boolean> {
    try {
        let dbUrl = process.env.MONGO_CONNECTION_STRING as string;

        if (process.env.NODE_ENV === Envs.TEST) {
            mongod = await MongoMemoryServer.create();
            dbUrl = mongod.getUri();
        }

        const conn = await mongoose.connect(dbUrl);

        console.log(`MongoDB connected: ${conn.connection.host}`);
        return true;
    } catch (err) {
        return false;
    }
};

async function disconnect(): Promise<boolean> {
    try {
        await mongoose.connection.close();
        if (mongod) {
            await mongod.stop();
        }
        return true;
    } catch (err) {
        return false;
    }
};

const MongoDBService = { connect, disconnect };
export default MongoDBService;
