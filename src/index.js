const puppeteer = require("puppeteer");
const prompt = require("prompt");
var standard_input = process.stdin;
var readline = require("readline");
const express = require("express");
const bodyParser = require("body-parser");

app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//PAGE 1
app.get("/", function(req, res) {
  res.write("<html>");
  res.write("<h2> Colombia js load time </h2>");
  res.write('<form action="/v2" method="POST"');
  res.write('<label for="url"> Enter URL: </label>');
  res.write(
    '<input type="text" name="url" placeholder="Enter url" autocomplete="on"> <br>'
  );
  res.write('<button type="submit">Submit</button>');
  res.write("</form>");
  res.write("</html>");
});

//PAGE 2
app.post("/v2", async (req, res) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page._client.send("Performance.enable");

  await page.goto(req.body.url, {
    waitUntil: "networkidle2",
    timeout: 3000000
  });

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

  var v4LoadTime = v4Start - (v2Start + v2Duration);

  if (v4LoadTime < 0) {
    v4LoadTime = v4Start - v2Start;
  }

  v2LoadTime = (Math.round(v2LoadTime) / 1000).toString() + " sec";
  v2Duration = (Math.round(v2Duration) / 1000).toString() + " sec";
  v4LoadTime = (Math.round(v4LoadTime) / 1000).toString() + " sec";
  v4Duration = (Math.round(v4Duration) / 1000).toString() + " sec";

  console.log("\n\n===v2 Load time === ");
  console.log(v2LoadTime);
  console.log(v2Duration);
  console.log("\n\n===v4 Load time === ");
  console.log(v4LoadTime);
  console.log(v4Duration);

  await browser.close();

  res.write("<html>");
  res.write('<form action="/" method="GET">');
  res.write("<h2>Network Logs:</h2>");
  res.write("<label> Colombia Init (in sec): </label>");
  res.write(
    '<input type="text" name="v2LoadTime"  value=' + v2LoadTime + "> <br>"
  );
  res.write("<label> Colombia loaded (in sec): </label>");
  res.write(
    '<input type="text" name="v2Duration"  value=' + v2Duration + "> <br>"
  );
  res.write("<label> First Ad call init (in sec): </label>");
  res.write(
    '<input type="text" name="v4LoadTime"  value=' + v4LoadTime + "> <br>"
  );
  res.write("<label> First Ad loaded (in sec): </label>");
  res.write(
    '<input type="text" name="v2LoadTime"  value=' + v4Duration + " > <br>"
  );
  res.write('<button type="submit">Back</button>');
  res.write("</form>");
  res.write("</html>");
});

//Listening port

app.listen(3000);
