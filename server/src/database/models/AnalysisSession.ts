import { Schema, model } from "mongoose";

import Collection from "@/constants/Collection";

const analysisSessionSchema = new Schema({
    token: { type: String, required: true },
    actions: { type: Number, required: true },
    createdAt: { type: Date, required: true }
});

const AnalysisSession = model(
    "analysisSession",
    analysisSessionSchema,
    Collection.ANALYSIS_SESSIONS
);

export default AnalysisSession;