const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
    try {
        const data = await prisma.daylyVisits.findMany();
        return res.json({
            message: data,
        });
    } catch (error) {
        return res.json({
            error: `An error was occured: ${error}`,
        });
    }
});

module.exports = router;
