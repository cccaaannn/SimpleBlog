import bcrypt from 'bcrypt';

async function hash(data: string): Promise<string> {
    return await bcrypt.hash(data, parseInt(process.env.PASSWORD_SALT_ROUNDS||"10"));
}

async function compare(data: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
}

export const EncryptionService = {
    hash,
    compare
};
