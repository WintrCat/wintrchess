import { StatusCodes } from "http-status-codes";

type APIResponse<Data extends object = {}> = Promise<(
    { status: StatusCodes } & Partial<Data>
)>;

export default APIResponse;