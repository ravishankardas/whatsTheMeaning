var express = require("express");
var socket = require("socket.io");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const PORT = 4000;
const app = express();
var server = app.listen(PORT, function () {
  console.log(`server is running on PORT ${PORT}`);
});

app.use(express.static("public"));

var io = socket(server);
let finalmeaning = "";
let finalmeaningpdf = "";
io.on("connection", function (socket) {
  socket.on("urlInfo", function (data) {
    let last = data.message.split("/")[4] + ": ";
    const axios = require("axios");
    const cheerio = require("cheerio");
    const url = data.message;
    axios(url)
      .then((response) => {
        const html = response.data;

        const $ = cheerio.load(html);
        const stuff = [];
        $(".one-click-content", html).each(function () {
          const txt = $(this).text();
          stuff.push(txt);
        });
        let some = stuff[1];
        finalmeaning = last + some.split(";")[0];
        console.log(finalmeaning);
      })
      .catch((err) => console.log(err));
    io.sockets.emit("final", {
      message: finalmeaning,
    });
  });

  //pdf
  socket.on("pdfInfo", function (data) {
    let last = data.message.split("/")[4] + ": ";
    const axios = require("axios");
    const cheerio = require("cheerio");
    const url = data.message;
    axios(url)
      .then((response) => {
        const html = response.data;
        // console.log(html)
        const $ = cheerio.load(html);
        const stuff = [];
        $(".one-click-content", html).each(function () {
          const txt = $(this).text();
          stuff.push(txt);
        });
        let some = stuff[1];

        finalmeaningpdf = last + some.split(";")[0];
        console.log(finalmeaningpdf);
      })
      .catch((err) => console.log(err));
    io.sockets.emit("finalPdf", {
      message: finalmeaningpdf,
    });
  });
});

app.use(express.static("public"));
app.use(fileUpload());

app.post("/extract-text", (req, res) => {
  if (!req.files && !req.files.pdfFile) {
    res.status(400);
    res.end();
  }

  pdfParse(req.files.pdfFile).then((result) => {
    res.send(result.text);
  });
});
