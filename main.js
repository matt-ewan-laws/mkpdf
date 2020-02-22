const program = require("commander");
const yaml = require("js-yaml");
const PdfPrinter = require("pdfmake");
const fs = require("fs");

const fonts = {
  Roboto: {
    normal: "fonts/Roboto-Regular.ttf",
    bold: "fonts/Roboto-Medium.ttf",
    italics: "fonts/Roboto-Italic.ttf",
    bolditalics: "fonts/Roboto-MediumItalic.ttf"
  }
};

const getFileName = path =>
  path
    .split(".")
    .slice(0, path.split(".").length - 1)
    .join(".");

program
  .option("-o, --out <path>", "Generated pdf file name")
  .option("-d, --debug", "Show debugging info")
  .action(function({ out, debug }, [inputFile]) {
    const pdfFilePath = out ? out : `${getFileName(inputFile)}.pdf`;
    const printer = new PdfPrinter(fonts);
    try {
      const defObj = yaml.safeLoad(fs.readFileSync(inputFile, "utf8"));
      if (debug) {
        console.log(JSON.stringify(defObj, null, 2));
      }
      const pdfDoc = printer.createPdfKitDocument(defObj);
      pdfDoc.pipe(fs.createWriteStream(pdfFilePath));
      pdfDoc.end();
    } catch (e) {
      console.error(e);
    }
  });

program.parse(process.argv);
