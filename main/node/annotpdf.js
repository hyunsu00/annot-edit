// annotpdf.js
const { AnnotationFactory } = require("annotpdf");

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

exports.addAnnot = addAnnot;
