const fs = require('fs')

exports.ConverteIBGEparaUF = (codIBGE, callback) => {
    codIBGE = codIBGE.substring(0, 2)
    let arrUF = []

    arrUF[11] = "RO";
    arrUF[12] = "AC";
    arrUF[13] = "AM";
    arrUF[14] = "RR";
    arrUF[15] = "PA";
    arrUF[16] = "AM";
    arrUF[17] = "TO";
    arrUF[21] = "MA";
    arrUF[22] = "PI";
    arrUF[23] = "CE";
    arrUF[24] = "RN";
    arrUF[25] = "PB";
    arrUF[26] = "PE";
    arrUF[27] = "AL";
    arrUF[28] = "SE";
    arrUF[29] = "BA";
    arrUF[31] = "MG";
    arrUF[32] = "ES";
    arrUF[33] = "RJ";
    arrUF[35] = "SP";
    arrUF[41] = "PR";
    arrUF[42] = "SC";
    arrUF[43] = "RS";
    arrUF[50] = "MS";
    arrUF[51] = "MT";
    arrUF[52] = "GO";
    arrUF[53] = "DF";

    callback(arrUF[codIBGE])
}

exports.XmlMDFe = (callback) => {
    fs.readFile('./public/xmls/mdfe.xml', 'utf8', (err, data) => {
        if (err) throw err

        callback(data)
    })
}