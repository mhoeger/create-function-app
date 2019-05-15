import { FunctionApp, HttpTrigger } from "../future_node_modules/functions/azure-functions"
import { Context } from "@azure/functions"
import { InvocationContext } from "./common/interfaces"
import { helloFunction } from "./functions/hello"
import { goodbyeFunction } from "./functions/goodbye"
var cookieParser = require("cookie-parser");

const app = new FunctionApp();

// register functionss
app.onTrigger(new HttpTrigger("api/bye", ["GET"]), goodbyeFunction)
   .onTrigger(new HttpTrigger("api/hi", ["GET"]), helloFunction);

app.pre(async (context: InvocationContext) => {
    context.log('~~ wow middleware ~~');
    context.log(`~~ invocation id = ${context.invocationId} ~~`);
});

app.pre(async (context: InvocationContext) => {
    const name = (context.req.query.name || (context.req.body && context.req.body.name));
    context.name = name;
});

// note: this only does pre-parsing, does not pass "next" callback
app.use(cookieParser());

export = app;