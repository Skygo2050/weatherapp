//require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");
const port = process.env.PORT || 8001;

const homeFile = fs.readFileSync("refer.html", "utf-8");


const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      `https://api.openweathermap.org/data/2.5/weather?q=boston&units=metric&appid=c0d69bd2b4d552629bf97cf80d19e5c9`
    )
      .on("data", (chunk) => {
         const objdata = JSON.parse(chunk);
        const arrData = [objdata];
         //console.log(arrData[0].main.temp);
        const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
        res.write(realTimeData);

             

         //console.log(arrData);
      })


      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });

      
  } else {
    res.end("File not found");
  }
});

server.listen(port, "127.0.0.1");