#!/usr/bin/env node

import fs from "fs";
import path from "path";

const templatePathComponent = path.join(__dirname, "../../../templates/component");

const templatePathModal = path.join(__dirname, "../../../templates/modal");

function parseFile(templatePath: string, filename: string, tagName: string, className: string): string {
    return fs.readFileSync(`${templatePath}/${filename}`, "utf-8").replace(/TAGNAME/g, tagName).replace(/CLASSNAME/g, className);
}

function writeFile(filepath: string, content: string) {
    fs.writeFileSync(filepath, content);
}

function processFile(templatePath: string, filename: string, tagName: string, className: string, outDir: string, dryRun: boolean) {
    const content = parseFile(templatePath, filename, tagName, className);

    if (dryRun) {
        console.log(content);
    }
    else {
        const filename2 = filename.replace(/TAGNAME/g, tagName).replace(/CLASSNAME/g, className);

        writeFile(`${outDir}/${tagName}/${filename2}`, content);
    }
}

const typ = process.argv[2];
const tagName = process.argv[3];
const outDir = process.argv[4];
const dryRun = !outDir;

if (!typ || !tagName) {
    console.error(`Usage: new-riot component|modal <tag-name> [out-dir]`);

    process.exit(1);
}

let templatePath;

if (typ === "component" || typ === "c") {
    templatePath = templatePathComponent;
}
else if (typ === "modal" || typ === "m") {
    templatePath = templatePathModal;
}
else {
    console.error(`Usage: new-riot component|modal <tag-name> [out-dir]`);

    process.exit(1);
}

// Beautiful one-liner snatched (and adapted) from:
// https://stackoverflow.com/questions/40710628/how-to-convert-snake-case-to-camelcase
//
const className = tagName.toLowerCase().replace(/[-][a-z]/g, (group) => group.slice(-1).toUpperCase()).replace(/^./, char => char.toUpperCase());

if (!dryRun) {
    console.error(`Creating component directory: ${outDir}/${tagName}`);

    fs.mkdirSync(`${outDir}/${tagName}`, {recursive: true});

    fs.mkdirSync(`${outDir}/${tagName}/test`);
}

[
    "index.js",
    "TAGNAME.riot",
    "TAGNAME.css",
    "CLASSNAME.ts",
    "demo.ts",
    "test/TAGNAME.mocha.ts",
].forEach( filename =>
    processFile(templatePath, filename, tagName, className, outDir, dryRun) );
