#!/usr/bin/env node

const fs = require('fs');

const declarationBlockPattern = /(declare|module).*[\s\S]*?(?=declare|module|$)/gi;

const declarationMatches = (declarationBlock, matchedStrings) => 
    matchedStrings.some(str => declarationBlock.toLowerCase().indexOf(str.toLowerCase()) > -1);

function read(fileName) {
    return new Promise(function(resolve, reject) {
        fs.readFile(fileName, 'utf8', (err,data) => err ? reject(err) : resolve(data))
    })
}


(function main() {
    if(process.argv.length < 4 || process.argv.indexOf('-h') > -1 || process.argv.indexOf('--help') > -1) {
        console.log('filter-ts-declarations <declarationFile> <matchedStrings...>');
        console.log('\nTool will go through specified declaration file, and omit anything that doesn\'t match one of your matchedStrings.')
        console.log(`\nExample usage:\nfilter-ts-declarations ../test.d.ts My.Module My.Module.2`)
    }
    else {
        const declarationFile = process.argv[2];
        const matchedStrings = process.argv.slice(3);

        read(declarationFile)
            .then(declarationFileContent => 
                    (declarationFileContent
                        .match(declarationBlockPattern) || [])
                        .filter(block => declarationMatches(block, matchedStrings))
                        .join(''))
            .then(newFileContent => process.stdout.write(newFileContent))
            
    }
})();