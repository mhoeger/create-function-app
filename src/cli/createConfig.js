let arg = require('arg');
let fs = require('fs');

function parseArgumentsIntoOptions(rawArgs) {
    // const command = String.toString(rawArgs[2]).toLowerCase();
    // const whiteListedCommands = ["init"];
    // if (whiteListedCommands.indexOf(command) < 0) {
    //     return new Err
    // }
    const args = arg(
        {
            '--path': String,
            '-p': '--path',
            '--out': String,
            '-o': '--out',
            '--help': Boolean,
            '-h': '--help'
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        appPath: args['--path'] || "./app.js",
        help: args['--help'] || false,
        out: args['--out'] || "."
    };
}

function help(command) {
    let helpMenu;
    if (command === "init") {
        helpMenu = `
    Usage:  create-function-app init [OPTIONS]

    Generate creates initial template of a function app
    
    Options:
        --path, -p ......... path to directory to initialize for function app
    `;
    } else if (command === "build") {
        helpMenu = `
    Usage:  create-function-app build [OPTIONS]

    Generate function.json files for a function app
    
    Options:
        --path, -p ......... path to function app file
        --out, -o .......... path to output directory
        --help, -h ......... show help menu
    `;
    } else {
        helpMenu = `
    Usage:  create-function-app [COMMAND] [OPTIONS]

    Generate function.json files for a function app
    
    Commands:
        init
            --path, -p ......... path to directory to initialize for function app
        build
            --path, -p ......... path to function app file
            --out, -o .......... path to output directory

    Options:
        --help, -h ......... show help menu
    `;
    }
    console.log(helpMenu);
}

function generateJsons(path, out) {
    if (!fs.existsSync(path)) {
        console.error(`Path to function app '${path}' does not exist`);
        return;
    }

    let app = require(path);
    // Function app has the necessary method to generate and run? 
    return app.generateMetadata(out, path).then(() => {
        console.log("done for real!!");
    });
}

module.exports.cli = function (args) {
    const options = parseArgumentsIntoOptions(args);
    const command = getCommand(args); 
    if (options.help) {
        help(command);
    } else if (command === "init") {
        console.log("todo!");
    } else if (options.appPath && options.out) {
        generateJsons(options.appPath, options.out);
    }
}

function getCommand(rawArgs) {
    const command = rawArgs[2].toLowerCase();
    const whiteListedCommands = ["init", "build"];
    if (whiteListedCommands.indexOf(command) < 0) {
        return undefined;
    }
    return command;
}