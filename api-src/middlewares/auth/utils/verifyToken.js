const jwt = require("jsonwebtoken");
const fs = require("fs");
const secret = fs.readFileSync("../../.certs/public.pem", "utf-8");

/* -------------------------------- content -------------------------------- */

const verifyToken = async (authToken) => {
    try {
        const decoded = jwt.verify(authToken, secret);

        const dateOptions = {
            hour12: false,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        };
        const iatDate = new Date(decoded.iat * 1000).toLocaleString(
            "fr-FR",
            dateOptions
        );
        const expDate = new Date(decoded.exp * 1000).toLocaleString(
            "fr-FR",
            dateOptions
        );
        delete decoded.iat && delete decoded.exp;
        return {
            payload: decoded,
            tokenCreatedDate: iatDate,
            tokenExpirationDate: expDate,
        }; // don't past "message" key !
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return {
                message: "Your token is expired, please log-in to generate new",
            };
        } else {
            return {
                message: "Your token doesn't exists",
            };
        }
    } // return payload or null
};

/* --------------------------------- export --------------------------------- */

module.exports = { verifyToken };
