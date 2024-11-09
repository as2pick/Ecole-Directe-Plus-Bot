const jsonConfig = require("./config.json"); // important !
const {
    handleFiles,
    activeRoutes,
    routeNumber,
    app,
    files,
} = require("./utils/routeHandler");
/* --------------------------------- modules -------------------------------- */

require("dotenv").config({ path: jsonConfig.env_path });

/* ------------------------------- statics var ------------------------------ */

const errorCodes = require("../errorCodes.json");
const PORT = process.env.PORT;
const BRAND = `


 _______  ______   _______    _______  _______  ___ 
|       ||      | |       |  |   _   ||       ||   |
|    ___||  _    ||    _  |  |  |_|  ||    _  ||   |
|   |___ | | |   ||   |_| |  |       ||   |_| ||   |
|    ___|| |_|   ||    ___|  |       ||    ___||   |
|   |___ |       ||   |      |   _   ||   |    |   |
|_______||______| |___|      |__| |__||___|    |___|

                                                                                   
`;

/* --------------------------------- process -------------------------------- */

process.on("exit", (code) => {
    console.log(`The process has ended with code: ${code}`);
    // signal code signification
    for (const [key_code, value] of Object.entries(errorCodes)) {
        if (code === Number(key_code)) {
            console.log(`[!] Error code ${code} : ${value}`);
        }
    }
});

/* -------------------------------- functions ------------------------------- */

const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/* --------------------------------- content -------------------------------- */

const runApi = async () => {
    if (!Number(PORT)) {
        process.exit(524); // Exit if the PORT is not defined
    }

    console.log(BRAND);
    handleFiles();

    if (routeNumber === 0) {
        console.log("[+] No routes are registered");
    } else {
        console.log(`[*] Active routes:\n`);
        for (let route of activeRoutes) {
            if (route && route.length > 0) {
                route.forEach((route) => {
                    console.log(
                        `   "http://localhost:${PORT}${route}"  >>>  "${route}"`
                    );
                });
            }
        }
    }

    await sleep(750);
    console.log(
        `\n
        /* -------------------------------------------------------------------------- */
        /*               [#] API is running at http://localhost:${PORT}                  */
        /* -------------------------------------------------------------------------- */

>_`
    );
};

const listenApi = () => {
    app.listen(PORT, async () => {
        runApi();
    });
};

listenApi();
