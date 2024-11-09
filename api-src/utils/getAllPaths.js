const fs = require("fs");
const path = require("path");
const Format = require("./handleFormat");

module.exports = (
    /* ------------------------------- parameters ------------------------------- */
    dirPath,
    excludedDirs = [],
    excludedFiles = [],
    dirOnly = true,
    printExcludedFilesAndPaths = true
) => {
    /* ------------------------------- statics var ------------------------------ */

    const outPath = [];
    const rawOutPath = [];
    const outFilesPath = [];
    const rawFiles = [];

    /* ----------------------------------- obj ---------------------------------- */

    const format = new Format();

    /* -------------------------------- content -------------------------------- */

    const exploreDirectory = (currentPath) => {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = `${path.join(currentPath, entry.name)}`;
            const routeConverted = format.livePath(fullPath);

            // convert paths/future route
            // ex --> ..\\api\\utils --> /api/utils

            if (entry.isDirectory()) {
                if (excludedDirs.includes(routeConverted)) {
                    printExcludedFilesAndPaths
                        ? console.log(
                              `[+] An excluded dir was detected at "${routeConverted}"`
                          )
                        : null;
                } else {
                    outPath.push(routeConverted);
                    rawOutPath.push(fullPath);
                    exploreDirectory(fullPath); // call the function to explore under directories
                }
            }

            if (entry.isFile()) {
                const routeFile = format.liveFile(fullPath);
                if (
                    (routeFile.trim().startsWith("[") &&
                        routeFile.trim().endsWith("]")) ||
                    excludedFiles.includes(`${routeFile}.js`)
                    // exclude file with "[route].js"
                ) {
                    // get filename without path and extention
                    printExcludedFilesAndPaths
                        ? console.log(
                              `[+] An excluded file "${routeFile}.js" was detected at : "${routeConverted}"`
                          )
                        : null;
                } else {
                    rawFiles.push(fullPath); // push all files together
                    outFilesPath.push(routeFile); // push if not enclosed
                }
            }
        }
    };
    // repeat to get all files in all folder / subfolders
    exploreDirectory(dirPath);

    return dirOnly
        ? {
              outPath: outPath, // outPath is converted in the reading process
              rawOutPath: rawOutPath,
              rawFiles: rawFiles,
              files: format.paths(rawFiles), // format all file paths
              fileNumber: rawFiles.length,
          }
        : outFilesPath.sort(); // use sort() to sort alphabetically
};
