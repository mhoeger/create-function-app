let arg = require('arg');
let fs = require('fs');
let util = require('util');
let p = require('path');
const writeFileAsync = util.promisify(fs.writeFile);

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
            '-h': '--help',
            '--env': String,
            '-e': '--env'
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        appPath: args['--path'] || "./app.js",
        help: args['--help'] || false,
        out: args['--out'] || ".",
        env: args['--env']
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
            --env, -e .......... path to .env or local.settings.json file

    Options:
        --help, -h ......... show help menu
    `;
    }
    console.log(helpMenu);
}

async function generateJsons(appPath, out, env) {
    if (!fs.existsSync(appPath)) {
        console.error(`Path to function app '${appPath}' does not exist`);
        return;
    }

    let app = require(appPath);
    // Function app has the necessary method to generate and run? 
    app.generateMetadata(out, appPath);
    createLocalSettings(appPath, out, env);
}

module.exports.cli = function (args) {
    const options = parseArgumentsIntoOptions(args);
    const command = getCommand(args); 
    if (options.help) {
        help(command);
    } else if (command === "init") {
        console.warn("todo!");
    } else if (options.appPath && options.out) {
        generateJsons(options.appPath, options.out, options.env);
    }
}

function getCommand(rawArgs) {
    const command = rawArgs[2] && rawArgs[2].toLowerCase();
    const whiteListedCommands = ["init", "build"];
    if (whiteListedCommands.indexOf(command) < 0) {
        return undefined;
    }
    return command;
}

function createLocalSettings(appPath, out, env) {
    const appPathDir = p.dirname(appPath);
    const appPathEnv = `${appPathDir}/.env`;
    const appPathSettings = `${appPathDir}/local.settings.json`;
    console.warn(appPathEnv);
    // --env specified
    if (env && fs.existsSync(env)) {
        if (p.basename(env) === ".env") {
            const localEnvSettings = formatEnv(env);
            writeFileAsync(`${out}/local.settings.json`, localEnvSettings);
        } else if (p.basename(env) === "local.settings.json") {
            copyFile(env, `${out}/local.settings.json`);
        } else {
            throw new Error(`Environment file must be named '.env' or 'local.settings.json'. Found: '${env}'`);
        }
    // local.settings.json is next to app path
    } else if (!env && fs.existsSync(appPathSettings)) {
        copyFile(appPathSettings, `${out}/local.settings.json`);
    // .env is next to app path
    } else if (!env && fs.existsSync(appPathEnv)) {
        const localEnvSettings = formatEnv(appPathEnv);
        writeFileAsync(`${out}/local.settings.json`, localEnvSettings);
    } else {
        console.warn("Generating local.settings.json file.");
        const localSettings = {
            IsEncrypted: false,
            Values: {
              FUNCTIONS_WORKER_RUNTIME: "node",
              AzureWebJobsStorage: "{AzureWebJobsStorage}"
            }
        };
        const settings = JSON.stringify(localSettings, null, '\t');
        writeFileAsync(`${out}/local.settings.json`, settings);
    }
}

function formatEnv(env) {
    console.debug("Re-formatting .env file to local.settings.json");
    const localEnvSettings = {
        IsEncrypted: false,
        Values: { }
    };
    let envContents = fs.readFileSync(env, 'utf-8');
    let splitEnv = envContents.split("\n");
    splitEnv.forEach((line) => { 
        let setting = line.split("=");
        localEnvSettings.Values[setting[0]] = setting[1];
    });
    return JSON.stringify(localEnvSettings, null, '\t');
}

function copyFile(from, to) {
    if (from !== to) {
        fs.createReadStream(from).pipe(fs.createWriteStream(to));
    }
}