const os = require("os");

const platform = os.platform(); // <3

console.log(
    `[*] Active running system : ${platform.charAt(0).toUpperCase() + platform.slice(1)}`
);

// this object is really usefull beacause it allows to format path / files / files name
// add fonction if necessary

class Format {
    // <3
    livePath(fileOrPath) {
        const path = fileOrPath.split("..").pop();
        return platform === "win32" ? path.replaceAll("\\", "/") : path;
    }
    liveFile(fileOrPath) {
        return fileOrPath
            .split(
                platform === "win32" ? "\\" : platform === "linux" ? "/" : null
                /**
                 * if platform === "win32" use "\\" to split
                 * else if platform === "linux" use "/" to split
                 */
            )
            .pop()
            .slice(0, -3);
    }
    files(fileOrPath) {
        let tempArray = [];
        fileOrPath.forEach((element) => {
            tempArray.push(
                element
                    .split(
                        platform === "win32"
                            ? "\\"
                            : platform === "linux"
                              ? "/"
                              : null
                        /**
                         * if platform === "win32" use "\\" to split
                         * else if platform === "linux" use "/" to split
                         */
                    )
                    .pop()
                    .slice(0, -3)
            );
        });
        return tempArray;
    }
    paths(fileOrPath) {
        let tempArray = [];
        fileOrPath.forEach((element) => {
            const path = element.split("..").pop();
            tempArray.push(
                platform === "win32" ? path.replaceAll("\\", "/") : path
            );
        });
        return tempArray;
    }
    liveRemoveFileName(fileOrPath, charReplace, charReplaced) {
        return fileOrPath.replace(charReplace, charReplaced);
    }
}

/* --------------------------------- export --------------------------------- */

module.exports = Format;
