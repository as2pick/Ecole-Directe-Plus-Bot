const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
    checkUserConnection,
} = require("../../../middlewares/auth/checkUserConnection");

router.post("/", checkUserConnection, async (req, res) => {
    try {
        const body = req.body;
        const url = new URL(req.originalUrl, `http://${req.headers.host}`);
        const params = new URLSearchParams(url.search);

        if (!body.commandMethod) {
            return res.status(400).json({
                error: "You need to pass 'commandMethod' in the body with 'get' or 'set'",
            });
        }

        const validCommands = ["get", "set"];
        if (!validCommands.includes(body.commandMethod)) {
            return res.status(400).json({
                error: "Invalid 'commandMethod'. It should be 'get' or 'set'",
            });
        }

        const channelMethod = body.commandMethod;

        if (channelMethod === "set") {
            const channId = params.get("id");
            if (!channId) {
                return res.status(400).json({
                    error: "Missing 'id' parameter",
                });
            }

            const channel = await prisma.discordServer.upsert({
                where: { id: 1 },
                update: { discordChannelID: channId },
                create: { discordChannelID: channId, id: 1 },
            });

            return res.json({
                message: `Channel ID was set to ${channId}`,
            });
        } else if (channelMethod === "get") {
            try {
                const channel = await prisma.discordServer.findUnique({
                    where: {
                        id: 1,
                    },
                });

                if (!channel) {
                    return res.status(404).json({
                        error: "Channel not found",
                    });
                }

                return res.json({
                    channelId: channel.discordChannelID,
                });
            } catch (err) {
                return res.status(500).json({
                    error: `There was an unrecognized error: ${err.message}`,
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});

module.exports = router;
