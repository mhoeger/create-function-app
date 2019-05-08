# Improved Node App Model for Azure Functions
The goals are to (1.) make the function app model more intuitive and (2.) make function.json auto-generated on a build step. 

Currently, this is a draft project for exploring #1.
The next step is to inlude function.json generation scripts in this project as well and remove `future_dist_output`

### Get started
- npm install
- npm start

Check out app.ts code

### Disclaimer
I wanted to show that code in `common` and `functions` can be structured however you like. Worth thinking about what pattern we actually want to encourage, especially with how we want to do templates.