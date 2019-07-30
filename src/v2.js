const puppeteer = require("puppeteer");
const prompt = require("prompt");
var standard_input = process.stdin;
var readline = require("readline");

standard_input.setEncoding("utf-8");

console.log("test started");

// var schema = {
//   properties: {
//     url: {
//       hidden: false
//     }
//   }
// };

// function read() {
//   var rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     terminal: false
//   });
//   var out;

//   rl.on("line", function(line) {
//     out = line;
//   });

//   console.log(out);
// }

(async () => {
  //   var result = await new Promise(function(resolve, reject) {
  //     prompt.get(schema, function(err, result) {
  //       resolve(result);
  //     });
  //   });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page._client.send("Performance.enable");

  var url1 =
    "https://timesofindia.indiatimes.com/world/us/how-trump-sold-kabul-and-new-delhi-down-the-river/articleshow/70352190.cms";

  var url2 =
    "https://www.newspointapp.com/english-news/publisher-bollywoodhungama/top-news/akshay-kumar-talks-about-how-supportive-twinkle-khanna-has-been-his-career-choices/articleshow/14504820cf0f4fe39de12360f2ed21632c9384c0?utm_source=pwa&utm_medium=browser&utm_campaign=np";

  var url3 =
    "https://navbharattimes.indiatimes.com/business/property/property-news/after-supreme-courts-order-finding-funds-is-biggest-task-for-nbcc-in-completing-amrapali-projects/articleshow/70357297.cms";

  var url4 = "https://timesofindia.indiatimes.com/";

  await page.goto(url4, { waitUntil: "networkidle2" });

  console.log("page launched");
  const title = await page.evaluate(() => {
    return document.title;
  });

  console.log("==Title of the page ==");
  console.log(title);

  await page.waitFor(15000);
  // console.log("\n==== performance.getEntries() ====\n");
  const data = await page.evaluate(() =>
    JSON.stringify(performance.getEntries(), null, "  ")
  );
  const jData = JSON.parse(data);
  // console.log("start time for 1st request is: ");
  var fStart = jData[1].startTime;
  var fDuration = jData[1].duration;
  // console.log(fStart);

  var fTime = fStart + fDuration;
  var v2Start, v2Duration;
  var v4Start, v4Duration;

  for (var i = 0; i < jData.length; i++) {
    if (jData[i].name.indexOf("v2.js") != -1) {
      //    console.log(jData[i].name);
      v2Start = jData[i].startTime;
      v2Duration = jData[i].duration;
      //    console.log(v2Start);
      break;
    }
  }

  for (var i = 0; i < jData.length; i++) {
    if (jData[i].name.indexOf("v4.htm") != -1) {
      //    console.log(jData[i].name);
      v4Start = jData[i].startTime;
      v4Duration = jData[i].duration;
      //    console.log(v4Start);
      break;
    }
  }

  var v2LoadTime = v2Start;

  v4LoadTime = v4Start - (v2Start + v2Duration);

  console.log("\n\n===v2 Load time === ");
  console.log(v2LoadTime);
  console.log(v2Duration);
  console.log("\n\n===v4 Load time === ");
  console.log(v4LoadTime);
  console.log(v4Duration);
  //   } else {
  //     console.log("URL not entered by user");
  //   }
  // console.log(data);

  //   console.log("\n==== performance.toJSON() ====\n");
  //   console.log(
  //     await page.evaluate(() => JSON.stringify(performance.toJSON(), null, "  "))
  //   );

  //   console.log("\n==== page.metrics() ====\n");
  //   const perf = await page.metrics();
  //   console.log(JSON.stringify(perf, null, "  "));

  //   console.log("\n==== Devtools: Performance.getMetrics ====\n");
  //   let performanceMetrics = await page._client.send("Performance.getMetrics");
  //   console.log(performanceMetrics.metrics);

  await browser.close();
})();
