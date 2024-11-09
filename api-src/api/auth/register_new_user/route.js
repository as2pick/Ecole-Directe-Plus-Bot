const express = require("express");
const router = express.Router();
const { PrismaClient, Group } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const {
    checkUserConnection,
} = require("../../../middlewares/auth/checkUserConnection");

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

router.post("/", checkUserConnection, async (req, res) => {
    const body = req.body;
    const bodyShape = {
        email: body.email,
        discordTag: body.discordTag,
        group: body.group,
        rawPassword: body.rawPassword,
        username: body.username,
    };
    // check correct body
    let params = [];
    for ([key, value] of Object.entries(bodyShape)) {
        if (key === "email") {
            if (!value) {
                continue;
            }
            const validEmail = validateEmail(body.email);
            if (!validEmail) {
                return res
                    .status(400)
                    .json({ error: "Invalid email shape : aaaaaa@bbbb.cc(c)" });
            }
        }
        if (!value) {
            params.push(key);
        }
    }
    if (params.length >= 1) {
        return res
            .status(400)
            .json({ error: `${params.join(", ")} is undefinded` });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(bodyShape.rawPassword, 10);
    // check group
    if (!Object.values(Group).includes(bodyShape.group)) {
        return res.status(400).json({ error: "Invalid group" });
    }

    try {
        await prisma.aPIUser.create({
            data: {
                email: bodyShape.email,
                discordTag: bodyShape.discordTag,
                group: bodyShape.group,
                password: hashedPassword,
                username: bodyShape.username,
            },
        });
        return res.json({
            message: `User ${bodyShape.username} was created succesfully`,
        });
    } catch (error) {
        return res.status(500).json({ error: `Unexpected error: ${error}` });
    }
});

module.exports = router;
