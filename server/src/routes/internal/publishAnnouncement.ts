import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { isEmpty } from "lodash-es";

import { Announcement, announcementSchema } from "shared/types/Announcement";
import AnnouncementModel from "@/database/models/Announcement";
import internalAuthenticator from "@/lib/security/internal";

const path = "/announcement/publish";

const router = Router();

router.use(path,
    express.json(),
    internalAuthenticator()
);

router.post(path, async (req, res) => {
    const announcement: Announcement = req.body;

    if (isEmpty(announcement)) {
        await AnnouncementModel.deleteMany();
        return res.sendStatus(StatusCodes.OK);
    }

    if (!announcementSchema.safeParse(announcement).success)
        return res.sendStatus(StatusCodes.BAD_REQUEST);

    await AnnouncementModel.updateOne({},
        { $set: announcement },
        { upsert: true }
    );

    res.sendStatus(StatusCodes.OK);
});

export default router;