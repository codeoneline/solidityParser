const path = require('path');
const fs = require('fs');

// const str = `pragma solidity ^0.4.24;
// import "./a.sol"
//
// contract b {
//     uint256 public constant b = 10000;
// }
//
// pragma solidity ^0.4.24;
//
// import "./b.sol"
//
// contract c {
//     uint256 public constant c = 100000;
// }`;
//
// const reg = /import\s+"(\S+)"/;
// let out = reg.exec(str);
// let newStr = str;
// while (out != null) {
//     const filename = out[1];
//     const source = fs.readFileSync("./test/" + filename, "UTF-8");
//     console.log(filename);
//     newStr = newStr.replace(reg, source);
//     out = reg.exec(newStr);
// }
// console.log(newStr);

// function parseImport(path, fullName) {
//     // var reg = /pattern/flags
//     // var reg = new RegExp(pattern, flags)
//     const str = fs.readFileSync(fullName, 'UTF-8');
//     const reg = /import\s+"(\S+)"/;
//     let out = reg.exec(str);
//     let newStr = str;
//     while (out != null) {
//         const filename = out[1];
//         const source = fs.readFileSync(path + "/" + filename, "UTF-8");
//         console.log(filename);
//         newStr = newStr.replace(reg, source);
//         out = reg.exec(newStr);
//     }
//     console.log(newStr);
//     return newStr;
// }
// function testParse(path) {
//     const pa = fs.readdirSync(path);
//     pa.forEach(function (ele, index) {
//         const fullName = path + "/" + ele;
//         const info = fs.statSync(path + "/" + ele);
//         if (info.isDirectory()) {
//             console.log("dir:" + ele);
//             readDirSync(path + "/" + ele);
//         } else {
//             console.log("file:" + fullName);
//             const extName = Path.extname(ele);
//             if (extName === '.sol') {
//                 const source = parseImport(path, fullName);
//                 const c = solc.compile(source, 1);
//
//                 for (let key in c.contracts) {
//                     if (c.contracts.hasOwnProperty(key)) {
//                         console.log('key: ' + key + ',' + 'value: ' + c.contracts[key]);
//                         for (let funName in c.contracts[key].functionHashes) {
//                             console.log("    " + funName + " = " + c.contracts[key].functionHashes[funName]);
//                         }
//                     }
//                 }
//             }
//         }
//     })
// }
const arr = [1,2,3,4];
console.log(typeof(arr));

const a = {};
console.log(a['a']);
console.log(a['a']);
console.log(a['a']);

a['a'] = true;
if (a['a'] == null) {
    console.log("a is null");
}