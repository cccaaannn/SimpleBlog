import bcrypt from 'bcrypt';
import { EncryptionConfig } from '../configs/encryption.config';

async function hash(data: string, saltRounds?: number): Promise<string> {
    return await bcrypt.hash(data, saltRounds || EncryptionConfig.PASSWORD_SALT_ROUNDS);
}

async function compare(data: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
}


const EncryptionService = { hash, compare };
export default EncryptionService;