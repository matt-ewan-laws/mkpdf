#!/usr/bin/env node

const program = require("commander");
const yaml = require("js-yaml");
const PdfPrinter = require("pdfmake");
const fs = require("fs");

const DEFAULT_WATCH_INTERVAL = 1000;

const fonts = {
  Roboto: {
    normal: "fonts/Roboto-Regular.ttf",
    bold: "fonts/Roboto-Medium.ttf",
    italics: "fonts/Roboto-Italic.ttf",
    bolditalics: "fonts/Roboto-MediumItalic.ttf"
  },
  Mauritius: {
    regular: "fonts/Mauritius Becker Regular.ttf"
  }
};

const printer = new PdfPrinter(fonts);

const getFileName = path =>
  path
    .split(".")
    .slice(0, path.split(".").length - 1)
    .join(".");

const readDef = path => yaml.safeLoad(fs.readFileSync(path, "utf8"));

const generatePdf = (path, def) => {
  const pdfDoc = printer.createPdfKitDocument(def);
  pdfDoc.pipe(fs.createWriteStream(path));
  pdfDoc.end();
};

program
  .option("-o, --out <path>", "Generated pdf file name")
  .option("-d, --debug", "Show debugging info")
  .option("-w, --watch [interval]", "Watch file for changes")
  .action(function({ out, debug, watch }, [inputFile]) {
    const pdfFilePath = out ? out : `${getFileName(inputFile)}.pdf`;

    const makePdf = () => {
      const def = readDef(inputFile);
      if (debug) {
        console.log(JSON.stringify(def, null, 2));
      }
      generatePdf(pdfFilePath, def);
    };

    try {
      makePdf();
    } catch (e) {
      console.error(e);
    }

    if (watch) {
      console.log("Watching for changes ...");
      const interval = isNaN(parseInt(watch))
        ? DEFAULT_WATCH_INTERVAL
        : parseInt(watch);
      try {
        fs.watchFile(inputFile, { interval }, () => {
          console.log("Input changed, building PDF ...");
          try {
            makePdf();
          } catch (e) {
            console.error(e);
          }
          console.log("... Success");
        });
      } catch (e) {
        console.log(e);
      }
    }
  });

program.parse(process.argv);
