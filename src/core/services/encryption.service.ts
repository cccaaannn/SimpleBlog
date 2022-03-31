import bcrypt from 'bcrypt';
import dotenv from "dotenv";
dotenv.config();

async function hash(data: string): Promise<string> {
    return await bcrypt.hash(data, parseInt(process.env.PASSWORD_SALT_ROUNDS as string));
}

async function compare(data: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
}


const EncryptionService = { hash, compare };
export default EncryptionService;