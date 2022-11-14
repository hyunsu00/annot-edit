const {
  PDFDocument,
  PDFName,
  PDFRef,
  ParseSpeeds,
  PDFAnnotation,
} = require("./build");
const { AnnotationFactory } = require("annotpdf");
const fs = require("fs");

const PDF_FILE_PATH = "./samples/jspdf_빈문서_한PDF_사각형추가_2개.pdf";
const SAVE_AS_FILE_PATH =
  "./outputs/jspdf_빈문서_한PDF_사각형추가_2개_PDFLIB_다른이름저장.pdf";
const REMOVE_ANNOTS_FILE_PATH =
  "./outputs/jspdf_빈문서_한PDF_사각형추가_2개_주석삭제.pdf";

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
    const annots = page.node.Annots();
    const size = annots?.size();

    // console.log(page.node.context);
    // console.log(annots.context);

    // const aaa = page.node.context.enumerateIndirectObjects();

    if (size) {
      const annotRefs = annots.asArray();
      for (let i = 0; i < annotRefs.length; i++) {
        const annotRef = annotRefs[i];
        const annotObj = page.node.context.lookup(annotRef);
        const apObj = annotObj.lookup(PDFName.of("AP"));
        const apRef = apObj.dict.get(PDFName.of("N"));

        page.node.removeAnnot(annotRef);
        annots.context.delete(annotRef);
        annots.context.delete(apRef);
      }
    }

    const resources = page.node.Resources();
    // console.log(resources);
    const extGStateDictObj = resources.lookup(PDFName.of("ExtGState"));
    const extGStateRefs = extGStateDictObj.values();
    for (let i = 0; i < extGStateRefs.length; i++) {
      const extGStateRef = extGStateRefs[i];
      annots.context.delete(extGStateRef);
    }
    resources.delete(PDFName.of("ExtGState"));
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
  ta.createDefaultAppearanceStream();

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
  });

  console.log("End : removeAnnots()");
}

main();
