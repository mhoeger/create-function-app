let arg = require('arg');
let fs = require('fs');

function parseArgumentsIntoOptions(rawArgs) {
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

function help() {
    const helpMenu = `
    Usage:  create-function-app [OPTIONS]

    Generate function.json files for a function app
    
    Options:
        --path, -p ......... path to function app file
        --out, -o .......... path to output directory
        --help, -h ......... show help menu
    `;
    console.log(helpMenu);
}

function generateJsons(path, out) {
    if (!fs.existsSync(path)) {
        console.error(`Path to function app '${path}' does not exist`);
        return;
    }

    let app = require(path);
    // Function app has the necessary method to generate and run? 
    app.generateJsons(out);
}

module.exports.cli = function (args) {
    let options = parseArgumentsIntoOptions(args);
    if (options.help) {
        help();
    } else {
        generateJsons(options.appPath, options.out);
    }
}
