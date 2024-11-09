const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config({ path: "../../.env" });

/* ---------------------------------- data ---------------------------------- */

const secret = fs.readFileSync("../../.certs/private.pem", "utf-8");

/* -------------------------------- content -------------------------------- */

const generateJsonWebToken = (payload) => {
    const signOptions = {
        expiresIn: process.env.JWT_TIMING,
        algorithm: "RS256",
    };
    return jwt.sign(payload, secret, signOptions); // create TOKEN
};

/* --------------------------------- export --------------------------------- */

module.exports = { generateJsonWebToken };
