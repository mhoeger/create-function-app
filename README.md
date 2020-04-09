# Improved Node App Model for Azure Functions
The goals are to:
1. Make the Function App model more intuitive. 
2. Make Functions json configuration (function.json, host.json, local.settings.json) auto-generated on a build step. 

Currently, this is a draft project for exploring and prototyping.

### Get started
- npm install
- npm start

Check out `samples` code for sample function app.
`samples/http/app.ts` is the entry point.

### Disclaimer
I wanted to show that code in `common` and `functions` can be structured however you like. Worth thinking about what pattern we actually want to encourage, especially with how we want to do templates.

This can all be in JavaScript, but I chose to write it in TypeScript.

This is in a very early stage, the most helpful feedback will be on the intuitiveness/usability on exported classes. Note that trigger classes aren't fleshed out, but will be pretty much the same as: http://json.schemastore.org/function

### To Do
- `local.settings.json`? What to do about local environment config. Something with core tools?
- We should do `functions.json` too for generation - much cleaner than multiple `function.json` files.
- Init and create new functions
- Convert old functions to new.
