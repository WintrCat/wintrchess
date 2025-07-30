import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { omit } from "lodash-es";

import ArchivedGame from "@/database/models/ArchivedGame";
import * as Archive from "@/lib/gameArchive";

const router = Router();

router.get("/archived-game", async (req, res) => {
    const gameId = req.query.id?.toString();
    if (!gameId) return res.sendStatus(StatusCodes.NOT_FOUND);

    const archivedGame = await ArchivedGame.findById(gameId).lean();
    if (!archivedGame) return res.sendStatus(StatusCodes.NOT_FOUND);

    const game = await Archive.unarchiveAnalysedGame({
        ...omit(archivedGame, ["_id", "__v"]),
        userId: archivedGame.userId.toString(),
        gzippedStateTree: Buffer.copyBytesFrom(
            archivedGame.gzippedStateTree.buffer
        )
    });

    return res.json(game);
});

export default router;