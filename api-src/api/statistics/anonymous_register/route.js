const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* -- in this code, we just return status codes for better client-side handling -- */

const expModulary = (a, b, p) => {
    let result = 1;
    a = a % p;

    while (b > 0) {
        if (b % 2 === 1) {
            result = (result * a) % p;
        }
        b = Math.floor(b / 2);
        a = (a * a) % p;
    }

    return result;
};

const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
};

router.post("/", async (req, res) => {
    const id = !req.body.id ? null : Number(req.body.id);
    if (!id) {
        return res.status(400).json({
            error: "Your request is invalid, you need to pass an id",
        });
    }

    const cryptedId = expModulary(
        id,
        14900 + Number(new Date().getFullYear()), // Random values but importants
        Number(new Date().getFullYear()) * 7 // Random values importants
    );

    const today = new Date();
    const formatedDate = formatDate(today);

    try {
        const anUser = await prisma.anonymousUser.findFirst({});
        if (!anUser) {
            return res.status(500).json({
                error: "The table is empty, you need to init she with: id: 1; EcoleDirectePlusUserId: 1; date: <today with dd/mm/yy>",
            });
        }
        if (anUser.date !== formatedDate) {
            const lastVisit = await prisma.anonymousUser.findFirst({
                orderBy: {
                    id: "desc",
                },
            });

            today.setDate(today.getDate() - 1);
            await prisma.daylyVisits.create({
                data: {
                    count: lastVisit ? lastVisit.id : 0,
                    createdAt: formatDate(today),
                },
            });

            const result =
                await prisma.$queryRaw`SELECT pg_get_serial_sequence('"AnonymousUser"', 'id') as seqname`;
            const sequenceName = result[0].seqname;

            await prisma.$executeRawUnsafe(
                `ALTER SEQUENCE ${sequenceName} RESTART WITH 1`
            );

            await prisma.anonymousUser.deleteMany();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json();
    }

    try {
        await prisma.anonymousUser.create({
            data: {
                EcoleDirectePlusUserId: cryptedId,
                date: formatedDate,
            },
        });

        return res.status(201).json();
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json();
        } else {
            console.error(error);
            return res.status(500).json();
        }
    }
});

module.exports = router;
