import './lib/pdf-lib.js'
window.PDFLib = PDFLib;
window.PDFDocument = PDFLib.PDFDocument;
window.ParseSpeeds = PDFLib.ParseSpeeds;
window.PDFName = PDFLib.PDFName;

function downloadURL(fileName, data) {
	var blob = new Blob([data], {type: "application/pdf"});
	let a = document.createElement('a');
	a.href = window.URL.createObjectURL(blob);;
	a.download = fileName;
	document.body.appendChild(a);
	a.style = 'display: none';
	a.click();
	a.remove();
};

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

async function main() {
	const PDF_FILE_PATH = './samples/jspdf_빈문서_한PDF_사각형추가_2개.pdf';
	const SAVE_AS_FILE_NAME = "jspdf_빈문서_한PDF_사각형추가_2개_PDFLIB_다른이름저장.pdf";
	const REMOVE_ANNOTS_FILE_NAME = "jspdf_빈문서_한PDF_사각형추가_2개_주석삭제.pdf";

	const buffer = await fetch(PDF_FILE_PATH).then((res) => res.arrayBuffer());
	saveAsPDFLib(buffer).then((pdfBytes) => {
    downloadURL(SAVE_AS_FILE_NAME, pdfBytes);
  });

	removeAnnots(buffer).then((pdfBytes) => {
    downloadURL(REMOVE_ANNOTS_FILE_NAME, pdfBytes);
  });
}

main();