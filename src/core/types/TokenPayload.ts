import Status from "../../types/enums/Status";

interface TokenPayload {
    id: string,
    status: Status,
    username: string,
    email: string,
    role: string,
};

export { TokenPayload };