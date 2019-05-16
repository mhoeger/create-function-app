import { FunctionApp, HttpTrigger } from "../future_node_modules/functions/azure-functions"
import { Context } from "@azure/functions"
import { NamedContext } from "./common/interfaces"
import { helloFunction } from "./functions/hello"
import { goodbyeFunction } from "./functions/goodbye"
var cookieParser = require("cookie-parser");
// import { config } from "config";

const app = new FunctionApp();

//// host.json:
//// maybe host config here
// app.host = config;
// app.host.version = "2.0";

//// .env => local.settings.json app settings

// register functions
//// App Model:
//// get or post
//// rename function? shouldn't be keyword
//// did like overlap in express type api's for more familiarity
//// route on the app.ts?
//// problem is making it too express-like, but not a complete set of what express can do.
//// try to reuse cross-platform patterns. similar terminology and structure, serverless framework
//// potentially a route that uses what azure-function-express does, where you do new FunctionApp(app()) => function app

//// (SUMMARY)
//// express-like functionality with *distinct* differences from express, ability to actually
//// lift and shift express app, trigger and binding separation,
//// (static content serving?)
app.function(helloFunction)
   .function(goodbyeFunction);

//// Deployment:
//// need a super easy deployment story
app.pre(async (context: Context) => {
    context.log('~~ wow middleware ~~');
    context.log(`~~ invocation id = ${context.invocationId} ~~`);
});


//// in app model, how do we discourage stateful content? do we need to? ONLY PERSISTENT!!
app.pre(async (context: NamedContext) => {
    const name = (context.req.query.name || (context.req.body && context.req.body.name));
    context.name = name;
});

// note: this only does pre-parsing, does not pass "next" callback
//// need to be careful of promising that we support "all express"
app.use(cookieParser());

export = app;