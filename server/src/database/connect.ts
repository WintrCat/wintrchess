import mongoose from "mongoose";
import cluster from "cluster";

import Collection from "@/constants/Collection";

async function initialiseIndexes() {
    const db = mongoose.connection.db;
    if (!db) throw new Error("failed to ensure database indexes.");

    await db.collection(Collection.ANALYSIS_SESSIONS).createIndex(
        { createdAt: 1 },
        { expireAfterSeconds: 14400 } // 4 hours
    );

    await db.collection(Collection.ARCHIVED_GAMES)
        .createIndex({ userId: 1 });
}

async function connectDatabase() {
    const first = cluster.worker?.id == 1;

    try {
        await mongoose.connect(
            process.env.DATABASE_URI || "mongodb://database/wintrchess"
        );
        await initialiseIndexes();
        
        if (first) console.log("database connected successfully.");
    } catch (err) {
        if (!first) return;

        console.log("database connection failed:");
        console.log(err);
    }
}

export default connectDatabase;