const { PDFDocument, PDFName, ParseSpeeds } = require("./build");
const { AnnotationFactory } = require("annotpdf");
const fs = require("fs");
//
// const PDF_FILE_PATH = "./samples/a4_빈문서_직사각형_webpdf_생성.pdf";
// const REMOVE_ANNOTS_FILE_PATH =
//   "./outputs/a4_빈문서_직사각형_webpdf_생성_주석삭제.pdf";
// const REMOVE_ANNOTS_ADD_ANNOT_FILE_PATH =
//   "./outputs/a4_빈문서_직사각형_webpdf_생성_주석삭제_webpdf_생성.pdf";

// const PDF_FILE_PATH = "./samples/기본문서_직사각형_webpdf_생성.pdf";
// const REMOVE_ANNOTS_FILE_PATH =
//   "./outputs/기본문서_직사각형_webpdf_생성_주석삭제.pdf";
// const REMOVE_ANNOTS_ADD_ANNOT_FILE_PATH =
//   "./outputs/기본문서_직사각형_webpdf_생성_주석삭제_webpdf_생성.pdf";

const PDF_FILE_PATH = "./samples/jspdf_빈문서_한PDF_사각형추가_2개.pdf";
const SAVE_AS_FILE_PATH =
  "./outputs/jspdf_빈문서_한PDF_사각형추가_2개_PDFLIB_다른이름저장.pdf";
const REMOVE_ANNOTS_FILE_PATH =
  "./outputs/jspdf_빈문서_한PDF_사각형추가_2개_주석삭제.pdf";
const REMOVE_ANNOTS_ADD_ANNOT_FILE_PATH =
  "./outputs/jspdf_빈문서_한PDF_사각형추가_2개_주석삭제_webpdf_생성.pdf";

async function saveAsPDFLib(buffer) {
  const pdfDoc = await PDFDocument.load(buffer, {
    ignoreEncryption: true,
    parseSpeed: ParseSpeeds.Slow,
    throwOnInvalidObject: true,
    updateMetadata: true,
    capNumbers: false,
  });

  return await pdfDoc.save({
    useObjectStreams: false,
    addDefaultPage: false,
    objectsPerTick: 50,
    updateFieldAppearances: true,
  });
}

async function removeAnnots(buffer) {
  const pdfDoc = await PDFDocument.load(buffer, {
    ignoreEncryption: true,
    parseSpeed: ParseSpeeds.Slow,
    throwOnInvalidObject: true,
    updateMetadata: true,
    capNumbers: false,
  });

  const pages = pdfDoc.getPages();

  pages.forEach((page) => {
    // 1,
    const annots = page.node.Annots();
    const size = annots?.size();

    let removeAnnots = [];
    if (size) {
      for (let i = 0; i < size; i++) {
        const annot = annots.get(i);
        removeAnnots.push(annot);
      }

      for (let i = 0; i < removeAnnots.length; i++) {
        const annot = removeAnnots[i];
        page.node.removeAnnot(annot);
        annots.context.delete(annot);
      }
    }
    // 2.
    // const annots = page.node.Annots();
    // const size = annots?.size();
    // if (size) {
    //   for (let i = 0; i < size; i++) {
    //     annots.context.delete(annots.get(i));
    //   }
    // }
  });

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
    addDefaultPage: false,
    objectsPerTick: 50,
    updateFieldAppearances: true,
  });
  return pdfBytes;
}

function addAnnot(pdfBytes) {
  const writer = new AnnotationFactory(pdfBytes);
  let ta = writer.createSquareAnnotation({
    page: 0,
    rect: [100, 600, 200, 700],
    contents: "contents",
    author: "author",
    updateDate: new Date(2022, 11, 3),
    creationDate: new Date(2022, 11, 3),
    id: "id",
    color: { r: 255, g: 0, b: 0 },
    fill: { r: 150, g: 200, b: 20 },
  });
  // ta.createDefaultAppearanceStream();

  return writer.write();
}

function main() {
  console.log("Begin : removeAnnots()");

  const buffer = fs.readFileSync(PDF_FILE_PATH);
  saveAsPDFLib(buffer).then((pdfBytes) => {
    fs.writeFileSync(SAVE_AS_FILE_PATH, pdfBytes);
  });

  removeAnnots(buffer).then((pdfBytes) => {
    fs.writeFileSync(REMOVE_ANNOTS_FILE_PATH, pdfBytes);
    fs.writeFileSync(REMOVE_ANNOTS_ADD_ANNOT_FILE_PATH, addAnnot(pdfBytes));
  });

  console.log("End : removeAnnots()");
}

main();
