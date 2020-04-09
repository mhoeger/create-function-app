const appLocation = "./dist/samples/http/app.js";
const outputPath = "./out";

let app = require(appLocation);

app.generateMetadata(outputPath, appLocation).then(() => {
    console.log("done for real!!");
})