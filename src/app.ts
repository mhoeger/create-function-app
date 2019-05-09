import { FunctionApp } from "../future_node_modules/functions/azure-functions"
import { Context } from "@azure/functions"
import { NamedContext } from "./common/interfaces"
import { helloFunction } from "./functions/hello"
import { goodbyeFunction } from "./functions/goodbye"
var cookieParser = require("cookie-parser");

const app = new FunctionApp();

// register functionss
app.function(helloFunction)
   .function(goodbyeFunction);

app.pre(async (context: Context) => {
    context.log('~~ wow middleware ~~');
    context.log(`~~ invocation id = ${context.invocationId} ~~`);
});

app.pre(async (context: NamedContext) => {
    const name = (context.req.query.name || (context.req.body && context.req.body.name));
    context.name = name;
});

// note: this only does pre-parsing, does not pass "next" callback
app.use(cookieParser());

export = app;