/* ---------------------------------- files --------------------------------- */

const Format = require("./handleFormat");
const getAllPaths = require("./getAllPaths");
const cors = require("cors");

const jsonConfig = require("../config.json"); // important !

/* --------------------------------- modules -------------------------------- */

const express = require("express");
const app = express();
app.use(express.json());

/*
 * this function saves all code
 * it ensures that "routeHandler.js" is executed in the utils folder,
 * not in the base path, avoiding the need for "../" in path resolution
 */
process.chdir(__dirname);

/* ------------------------------- middleware ------------------------------- */

const format = new Format();

/* ------------------------------- statics var ------------------------------ */

const handleAPIFunctioning = getAllPaths(
    jsonConfig.api_routes_path,
    jsonConfig.excluded_routes,
    jsonConfig.excluded_files
); // object with unified paths and files

const rawFiles = handleAPIFunctioning?.rawFiles;
const files = handleAPIFunctioning?.files;
const fileNumber = handleAPIFunctioning?.fileNumber;
const routeNumber = handleAPIFunctioning?.routeNumber;
const activeRoutes = [];

/* --------------------------------- content -------------------------------- */

// console.dir(handleAPIFunctioning, { depth: null }); /* to console log the entire object */

const handleFiles = () => {
    for (let i = 0; i < fileNumber; i++) {
        try {
            const routeHandler = require(rawFiles[i]);

            const convertedPathFile = format.liveRemoveFileName(
                files[i],
                jsonConfig.route_file_format,
                ""
            );

            app.use(convertedPathFile, routeHandler, cors());
        } catch (error) {
            console.log(`[!] Specific error detected : ${error}`);
            process.exit(1);
        }
    }
    activeRoutes.push(
        files.map((element) =>
            format.liveRemoveFileName(element, jsonConfig.route_file_format, "")
        )
    );
};

/* --------------------------------- export --------------------------------- */

module.exports = {
    handleFiles,
    activeRoutes,
    routeNumber,
    app,
    files,
};
