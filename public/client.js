// const { response } = require("express");

var socket = io.connect("http://localhost:4000");

var txt = "";
var finalmeaning = "";
const stuff = [];
var selectedText = "";
var ispdf = false;

function change() {
  var newText = "";
  for (st of stuff) {
    newText += st + " ";
  }
  document.getElementById("output").innerHTML = newText;
}
function reset() {
  document.getElementById("output").innerHTML = "";
  location.reload();
}
function pdfFunction(event) {
  console.log(event.target.files[0].text());
}
async function loadFile(event) {
  const name = event.target.files[0].name;
  const lastDot = name.lastIndexOf(".");
  const ext = name.substring(lastDot + 1);

  let text = await event.target.files[0].text();
  const myarr = text.split(" ");
  myarr.forEach(myFunction);
}
function myFunction(value, index, array) {
  stuff.push(value);
}
function getSelectedText() {
  if (window.getSelection) {
    selectedText = window.getSelection();
  } else if (document.getSelection) {
    selectedText = document.getSelection();
  } else if (document.selection) {
    selectedText = document.selection.createRange().text;
  }
}

function searchGoogle() {
  document.getElementById("puthere").value = " ";
  // selectedText = '';
  getSelectedText();

  const q = selectedText;
  const url = "https://www.dictionary.com/browse/" + q;
  socket.emit("urlInfo", {
    message: url,
  });
}
socket.on("final", function (data) {
  document.getElementById("puthere").innerHTML = data.message;
});
