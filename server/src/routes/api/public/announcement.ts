import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import Announcement from "@/database/models/Announcement";

const router = Router();

router.get("/announcement", async (req, res) => {
    const announcement = await Announcement.findOne();
    if (!announcement) return res.sendStatus(StatusCodes.NOT_FOUND);

    res.json(announcement);
});

export default router;