import { Types, Schema, model } from "mongoose";

import { ArchivedGame } from "shared/types/game/ArchivedGame";
import Collection from "@/constants/Collection";

type ArchivedGameDocument = (
    Omit<ArchivedGame, "userId">
    & { userId: Types.ObjectId }
);

const archivedGameSchema = new Schema<ArchivedGameDocument>(
    {}, { strict: false }
);

const ArchivedGame = model(
    "archivedGame",
    archivedGameSchema,
    Collection.ARCHIVED_GAMES
);

export default ArchivedGame;