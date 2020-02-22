# mkpdf

Tool that converts yaml spec file to a pdf document


## How to install

TODO: publish to npm

### 1. Clone repo

``` sh
git clone https://github.com/matt-ewan-laws/mkpdf.git ~/mkpdf
```

### 2. Install globally

``` sh
cd ~/mkpdf
npm i -g .
```

## How to use

    Usage: mkpdf <input.yaml> [options]

    Options:
    -o, --out <path>        Generated pdf file name
    -d, --debug             Show debugging info
    -w, --watch [interval]  Watch file for changes
    -h, --help              output usage information


## Packages used


* [pdfmake](http://pdfmake.org/#/ "pdfmake")
* [commander](https://github.com/tj/commander.js/ "commander")
