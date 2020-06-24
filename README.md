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

## To Do
- Don't require Function app root to be the build output folder. In other words, we shouldn't have to run `func start --prefix out`... it should integrate seemlessly.
    - The nested folder constraints really kill us here: https://github.com/Azure/azure-functions-host/issues/5373
    - **I consider issue 5373 as a blocker to this project.**
- Be able to init and create new functions
- Be able to convert old functions to new format.

### Extensibility
- Change getRequiredProperties/getOptionalProperties => getConfig or something and include validation for required.
- Make function name required??

## Challenges
- Requires a "build step" which is not required for plain JavaScript. Luckily, converting JavaScript is fairly common practice.
    - Need to verify that integration with other build steps is ok. This should be fine though, as long as this is the last step in any generation pipeline. Thought should be put into making this an intuitive experience.
- Templates. How to make them compatible with existing systems? We want to keep index.js but change function.json. Maybe this ties into work to convert old functions to new. 
