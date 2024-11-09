const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const {
    generateJsonWebToken,
} = require("../../../middlewares/auth/utils/generateJsonWebToken");
const urlencodedParser = express.urlencoded({ extended: false });

const handleConnection = async (req, res) => {
    const expectedBodyEncoded = ["username", "password"];
    const requestBodyEncoded = Object.keys(req.body);
    const extraBodyEncoded = requestBodyEncoded.filter(
        (header) => !expectedBodyEncoded.includes(header.toLowerCase())
    );
    const isBodyCorrect =
        requestBodyEncoded.length === 2 && extraBodyEncoded.length === 0;

    if (!isBodyCorrect) {
        let message;

        if (extraBodyEncoded.length > 0) {
            message = `And not: ${extraBodyEncoded.join(", ")}`;
        } else if (!("username" in req.body) && !("password" in req.body)) {
            message = "Please pass both username and password";
        } else if (!("username" in req.body)) {
            message = "Please pass username";
        } else if (!("password" in req.body)) {
            message = "Please pass password";
        } else {
            message = "Unexpected error.";
        }

        return res.status(401).json({ error: message });
    }

    // check user in db
    const { username, password } = req.body;

    const user = await prisma.aPIUser.findUnique({
        where: { username: username },
        select: {
            id: true,
            password: true,
            email: false,
            discordTag: true,
            username: true,
            group: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        return res.status(404).json({
            error: "User not found",
        });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    delete user.password;
    if (!validPassword) {
        return res.status(401).json({
            error: "Invalid password",
        });
    }
    // if we arrived here, the user exist (and pass / username are correct!)
    const token = generateJsonWebToken(user);
    return res.status(200).json({ message: token }); // useless but no
};

router.post("/", urlencodedParser, async (req, res) => {
    handleConnection(req, res);
});
module.exports = router;
