import express from "express";
import cluster from "cluster";
import os from "os";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";

import connectDatabase from "@/database/connect";
import hostnameWhitelist from "@/lib/security/whitelist";
import getAuth from "@/lib/auth";
import mainRouter from "./routes";
import cors from "cors"; // Add this import

dotenv.config();

const port = process.env.PORT || 8080;
const nodeEnv = process.env.NODE_ENV || "production";

const coreCount = os.cpus().length;

async function main() {
    if (cluster.isPrimary) {
        console.log("starting server...");
        for (let i = 0; i < coreCount; i++) cluster.fork();

        return;
    }

    await connectDatabase();

    const app = express();
    // TODO: use cors only in dev mode
    app.use(cors({
        origin: process.env.CORS_ORIGIN || true, // or specify your allowed origins
        credentials: true, // if you need to support cookies/auth
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allowed methods
        allowedHeaders: ["Content-Type", "Authorization"] // allowed headers
    }));
    app.use(cookieParser());
    app.use(hostnameWhitelist);

    // Static assets
    app.use("/",
        express.static("client/dist"),
        express.static("client/public")
    );

    // Normal endpoints
    app.all("/auth/account/*", toNodeHandler(getAuth()));
    app.use("/", mainRouter);

    // Start listening for requests
    app.listen(port, () => {
        if (cluster.worker?.id != 1) return;

        console.log(
            `server running on port ${port} `
      + `(${nodeEnv} mode, ${coreCount} thread`
      + (coreCount > 1 ? "s)" : ")")
        );
    });
}

main();
