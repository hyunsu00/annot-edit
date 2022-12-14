const {
  PDFDocument,
  PDFName,
  PDFRef,
  ParseSpeeds,
  PDFAnnotation,
} = require("../pdf-lib/commonjs");

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
    const annotsRef = page.node.dict.get(PDFName.Annots);
    const size = annots?.size();

    console.log(`page.node.context = ${page.node.context}`);
    console.log(`annots.context = ${annots.context}`);

    // const aaa = page.node.context.enumerateIndirectObjects();

    if (size) {
      const annotRefs = annots.asArray();
      for (let i = 0; i < annotRefs.length; i++) {
        const annotRef = annotRefs[i];
        if (!annotRef) {
          continue;
        }
        const annotObj = page.node.context.lookup(annotRef);
        if (annotObj) {
          // /XObject Obj 삭제
          const apObj = annotObj.lookup(PDFName.of("AP"));
          if (apObj) {
            const apRef = apObj.dict.get(PDFName.of("N"));
            if (apRef) {
              annots.context.delete(apRef);
            }
          }
        }

        const Annots = page.node.Annots();
        if (Annots) {
          const index = Annots.indexOf(annotRef);
          if (index !== undefined) {
            // Page내의 /Annots내의 /Annot 요소 삭제
            Annots.remove(index);
          }
        }
        
        // /Annot Obj 삭제
        annots.context.delete(annotRef);
      }
    }
    if (!annots?.size()) {
      // /Annots Obj 삭제
      page.node.context.delete(annotsRef);
      // Page내의 /Annots 요소 삭제
      page.node.delete(PDFName.Annots);
    }

    // !!!!! 리소스 삭제
    // const resources = page.node.Resources();

    // console.log(`resources = ${resources}`);

    // if (resources) {
    //   const extGStateDictObj = resources.lookup(PDFName.of("ExtGState"));
    //   if (extGStateDictObj) {
    //     const extGStateRefs = extGStateDictObj.values();
    //     for (let i = 0; i < extGStateRefs.length; i++) {
    //       const extGStateRef = extGStateRefs[i];
    //       annots.context.delete(extGStateRef);
    //     }
    //   }
    //   resources.delete(PDFName.of("ExtGState"));
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

exports.saveAsPDFLib = saveAsPDFLib;
exports.removeAnnots = removeAnnots;
