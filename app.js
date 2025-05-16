document.getElementById("convert-btn").addEventListener("click", () => {
  const txtArea = document.getElementById("text-input").value.trim();
  const fileInput = document.getElementById("file-upload").files[0];

  if (txtArea) {
    generatePDF(txtArea);
  } else if (fileInput) {
    readFile(fileInput);
  } else {
    alert("Please enter text or upload a .txt/.docx file.");
  }
});

function readFile(file) {
  const reader = new FileReader();

  if (file.type === "application/msword" || file.name.endsWith(".docx")) {
    reader.readAsArrayBuffer(file);
    reader.onload = function () {
      mammoth.convertToHtml({ arrayBuffer: reader.result })
        .then(result => {
          let cleanText = stripHTML(result.value); // optional cleanup
          generatePDF(cleanText);
        })
        .catch(err => {
          console.error("Error converting DOCX:", err);
          alert("Failed to convert DOCX file.");
        });
    };
  } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    reader.readAsText(file);
    reader.onload = function () {
      generatePDF(reader.result);
    };
  } else {
    alert("Unsupported file type.");
  }
}

function stripHTML(html) {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function generatePDF(content) {
  const docDefinition = {
    content: [
      {
        text: content,
        fontSize: 12,
        lineHeight: 1.5
      }
    ],
    defaultStyle: {
      font: 'Roboto'
    }
  };

  // Generate a 4-digit random number
  const randomNum = Math.floor(1000 + Math.random() * 9000); // e.g., 1234
  const filename = `textpdf-${randomNum}.pdf`;

  pdfMake.createPdf(docDefinition).download(filename);
}
