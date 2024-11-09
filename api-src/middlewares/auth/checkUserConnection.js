const express = require("express");
const urlencodedParser = express.urlencoded({ extended: false });
const { verifyToken } = require("../../middlewares/auth/utils/verifyToken");
const { PrismaClient, Group } = require("@prisma/client");
const prisma = new PrismaClient();

/* -------------------------------- function -------------------------------- */

const handleToken = async (authToken, req, res, next) => {
    const payload = await verifyToken(authToken);

    if (payload.message) {
        return res.status(400).json({ error: payload.message });
    }
    const user = await prisma.aPIUser.findUnique({
        where: {
            email: payload.payload.email,
            group: payload.payload.group,
            discordTag: payload.payload.discordTag,
            id: payload.payload.id,
            username: payload.payload.username,
        },
    });
    if (user.group !== Group.AUTHUSER) {
        return res.status(422).json({
            error: "You are not able to access this",
        });
    }
    if (!user) {
        return res.status(404).json({
            error: `${payload.payload.username} doesn't exist in the database`,
        });
    }
    next();
};

/* -------------------------------- content -------------------------------- */

const checkUserConnection = async (req, res, next) => {
    try {
        urlencodedParser(req, res, async () => {
            try {
                const authorizationHeader = req.headers.authorization;

                const tokenHeader = !authorizationHeader
                    ? undefined // if token is not provided
                    : authorizationHeader.split(" ")[1];

                !authorizationHeader
                    ? res.status(401).json({
                          error: "Please pass token and not your connection informations or log-in to get token",
                      })
                    : handleToken(tokenHeader, req, res, next);
            } catch (error) {
                return res.status(500).json({ error: error });
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
};
/* --------------------------------- export --------------------------------- */

module.exports = { checkUserConnection };
