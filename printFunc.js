// const keccak256 = require('keccak256')
//
// console.log(keccak256('hello').toString('hex')) // "1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8"
//
// console.log(keccak256(Buffer.from('hello')).toString('hex')) // "1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8"
//
// console.log(keccak256('transferFrom(address,address,address,uint256)').toString('hex')) //0x15DACBEA3A3F6B408F600E021131A3F39EDBBDB8F55675BE496A3C1E93B2DAF9
// console.log(keccak256('()').toString('hex')) // 0x861731D50C3880A2CA1994D5EC287B94B2F4BD832A67D3E41C08177BDD5674FE
// console.log(keccak256('withdrawEther(uint256)').toString('hex')) // 0x3BED33CE2D4B2096A0556FC512E8620EBD1BF580B4BBE9D13ADC103D9E43D0FE
// console.log(keccak256('depositEther()').toString('hex')) //0x98ea5fcad2b4e330dd0a4f073727e988e7bc56777119f86728224b87e3cabe72
//
//
// console.log(keccak256('getFinalFeeRate(address,uint256,bool)').toString('hex')) //0x0e7d9d45b565739afbf823a4b59d1c21b94c9588c176f381d72c17f330b261fe
//
//
// console.log(keccak256('matchOrders()payable').toString('hex'))
//
//
// matchOrders(OrderParam,OrderParam[],uint256[],OrderAddressSet)
// 0xA7C5A8EBE7A322772CD9E040361C9D54B4CC8EAC1383F73EAD0900FAFCB99018
const fs = require("fs");
const Web3 = require('web3');
const solc = require('solc');
const Path = require('path');

// var web3;
// if (typeof web3 !== 'undefined') {
//     web3 = new Web3(web3.currentProvider);
// } else {
//     web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
// }

// var Web3 = require('web3');
// var web3 = new Web3('http://localhost:8545');
// // 或者
// var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
//
// // 改变服务提供器
// web3.setProvider('ws://localhost:8546');
// // 或者
// web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
//
// // 在node.js中使用IPC服务提供器
// var net = require('net');
// var web3 = new Web3('/Users/myuser/Library/Ethereum/geth.ipc', net); // mac os 路径
// // 或者
// var web3 = new Web3(new Web3.providers.IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', net)); // mac os path
// // 在windows下的路径是: "\\\\.\\pipe\\geth.ipc"
// // 在linux下的路径是: "/users/myuser/.ethereum/geth.ipc"

// web3.eth.getAccounts().then(console.log);
// var v = web3.version;  //获取web3的版本
// console.log(v);

// const sPath = path.resolve(__dirname, 'contracts', 's.sol');
// const source = fs.readFileSync(sPath, 'UTF-8');
//
// c = solc.compile(source, 1);
// s = c.contracts[':t'];
// console.log(c);
// console.log(s);

// const getWeb3 = () => {
//     const myWeb3 = new Web3(web3.currentProvider);
//     return myWeb3;
// };

// const newContract = async (contract, ...args) => {
//     const c = await contract.new(...args);
//     const w = getWeb3();
//     const instance = new w.eth.Contract(contract.abi, c.address);
//     return instance;
// };

// const newContractAt = (abi, address) => {
//     const w = getWeb3();
//     const instance = new w.eth.Contract(abi, address);
//     return instance;
// };

function parseImport(fullName, parsingFile) {
    const path = Path.dirname(fullName);
    const source = fs.readFileSync(fullName, 'UTF-8');
    const reg = /\bimport\s+"(\S+)"\s*;/;

    let newSource = source;
    let out = reg.exec(source);

    while (out != null) {
        const importFileName = out[1];
        const importFullName = Path.resolve(path, importFileName);

        if (parsingFile[importFullName] == null) {
            parsingFile[importFullName] = true;

            newSource = newSource.replace(reg, parseImport(importFullName, parsingFile));
        } else {
            newSource = newSource.replace(reg, "");
        }

        out = reg.exec(newSource);
    }

    return newSource;
}

function removePragma(source, pragmas) {
    const reg = /\bpragma\s+(\S+)\s*\S+\s*;/g;

    let newSource = source;
    newSource = newSource.replace(reg, function (str, key) {
        if (pragmas[key] != null) {
            return ""
        } else {
            pragmas[key] = key;
            return str;
        }
    });
    return newSource;
}

function parse(fullName) {
    const parsingFile = {};
    const source = parseImport(fullName, parsingFile);

    const pragmas = {};
    return removePragma(source, pragmas);
}


const gOutFileName = "./build/fun.txt";
const gSolExt = ".sol";

function prepare() {
    if (!fs.existsSync(Path.dirname(gOutFileName))) {
        fs.mkdir(Path.dirname(gOutFileName));
    }

    fs.writeFileSync(gOutFileName, "");
}

function parseContracts(path) {
    const pa = fs.readdirSync(path);

    // ele, index
    if (pa.length == null) {
        return;
    }

    // pa.forEach(function (ele) {
    for (let i = 0; i < pa.length; i++) {
        const ele = pa[i];
        const fullName = Path.resolve(path, ele);

        // if directory
        if (fs.statSync(fullName).isDirectory()) {
            parseContracts(fullName);
        } else {
            // if file
            const extName = Path.extname(ele);
            if (extName === gSolExt) {
                fs.appendFileSync(gOutFileName, fullName + "\n");

                const source = parse(fullName);
                const c = solc.compile(source, 1);

                // print error message
                if (c.errors && c.errors.length > 0) {
                    for (let i=0; i <c.errors.length; i++) {
                        console.log(c.errors[i]);
                    }
                }

                for (let key in c.contracts) {
                    if (c.contracts.hasOwnProperty(key)) {
                        fs.appendFileSync(gOutFileName, '    contract: ' + key +"\n");

                        for (let funName in c.contracts[key].functionHashes) {
                            fs.appendFileSync(gOutFileName, "        " + funName + " = " + c.contracts[key].functionHashes[funName] + "\n");
                        }
                    }
                }
            } else if (extName === '.json') {
                const obj = require(fullName);
                const abi = obj.abi;
                console.log(abi.length)
            }
        }
    }
}

prepare();
parseContracts("../protocol/contracts");
