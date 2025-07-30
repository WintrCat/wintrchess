import getAuth from "@/lib/auth";

type InferredAuth = ReturnType<typeof getAuth>["$Infer"]["Session"];

declare global {
    declare namespace Express {
        interface Request {
            user?: InferredAuth["user"];
            session?: InferredAuth["session"];
        }
    }
}