var socket = io.connect("http://localhost:4000");

const resultText = document.getElementById("resultText");
const inpFile = document.getElementById("inpFile");
const btnUpload = document.getElementById("btnUpload");
const opbtn = document.getElementById("opbtn");
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
  location.reload();
});

btnUpload.addEventListener("click", () => {
  const formData = new FormData();

  formData.append("pdfFile", inpFile.files[0]);

  fetch("/extract-text", {
    method: "post",
    body: formData,
  })
    .then((response) => {
      return response.text();
    })
    .then((extractedText) => {
      resultText.value = extractedText.trim();
    });
});
let selectedText = " ";
function getSelectedText() {
  if (window.getSelection) {
    selectedText = window.getSelection();
  } else if (document.getSelection) {
    selectedText = document.getSelection();
  } else if (document.selection) {
    selectedText = document.selection.createRange().text;
  }
}
console.log("selectedText");

opbtn.addEventListener("click", () => {
  // console.log("selectedText");
  getSelectedText();
  console.log(selectedText);

  const q = selectedText;
  const url = "https://www.dictionary.com/browse/" + q;
  socket.emit("pdfInfo", {
    message: url,
  });
});
socket.on("finalPdf", function (data) {
  document.getElementById("output").innerHTML = data.message;
});
