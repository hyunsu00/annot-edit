const pdflib = require("./pdflib.js");
const fs = require("fs");
const FILES_1 = {
  PDF_FILE_PATH: "./samples/jspdf_빈문서_직사각형_webpdf_생성.pdf",
  SAVE_AS_FILE_PATH:
    "./outputs/jspdf_빈문서_직사각형_webpdf_생성_PDFLIB_다른이름저장.pdf",
  REMOVE_ANNOTS_FILE_PATH:
    "./outputs/jspdf_빈문서_직사각형_webpdf_생성_주석삭제.pdf",
};

const FILES_2 = {
  PDF_FILE_PATH: "./samples/jspdf_빈문서_직사각형_자유형_webpdf_생성.pdf",
  SAVE_AS_FILE_PATH:
    "./outputs/jspdf_빈문서_직사각형_자유형_webpdf_생성_PDFLIB_다른이름저장.pdf",
  REMOVE_ANNOTS_FILE_PATH:
    "./outputs/jspdf_빈문서_직사각형_자유형_webpdf_생성_직사각형_주석삭제.pdf",
};

const FILES = FILES_1;
console.log("Begin : removeAnnots()");

const buffer = fs.readFileSync(FILES.PDF_FILE_PATH);
pdflib.saveAsPDFLib(buffer).then((pdfBytes) => {
  fs.writeFileSync(FILES.SAVE_AS_FILE_PATH, pdfBytes);
});

pdflib.removeAnnots(buffer).then((pdfBytes) => {
  fs.writeFileSync(FILES.REMOVE_ANNOTS_FILE_PATH, pdfBytes);
});

console.log("End : removeAnnots()");
