import { Schema, model } from "mongoose";

import Collection from "@/constants/Collection";

const internalSessionSchema = new Schema({
    token: { type: String, required: true },
    createdAt: { type: Date, required: true }
});

const InternalSession = model(
    "internalSession",
    internalSessionSchema,
    Collection.INTERNAL_SESSIONS
);

export default InternalSession;