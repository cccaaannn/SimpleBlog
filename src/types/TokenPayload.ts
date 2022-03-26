import Status from "./enums/Status";

interface TokenPayload {
    id: string|null,
    status: Status,
    username: string,
    email: string,
    role: string,
};

export { TokenPayload };