import { FunctionApp } from "../future_node_modules/functions/azure-functions"
const express = require("express");

// Create express app as usual
const app = express();

app.get("/api/:foo", (req, res) => {
    res.json({ foo: req.params.foo });
});

app.get("/api/:foo/:bar", (req, res) => {
    res.json({ foo: req.params.foo, bar: req.params.bar });
});

export = new FunctionApp(app);