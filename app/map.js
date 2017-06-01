const xml2js = require('xml2js').parseString;
const Utils = require('./utils/utils.js')
const _ = require('underscore')

exports.VerificarParametros = (req, res, next) => {
    if (typeof req.body.xml === 'undefined')
        res.status(400).send({ mensagem: 'Utilize um xml válido :)' })
    else
        next()
}

exports.MontarRota = (req, res) => {
    if (req.body.xml.indexOf('<enviCTe') > -1 || req.body.xml.indexOf('<cteProc') > -1) {
        MontarRotaCTe(req.body.xml, (retorno) => {
            return res.json(retorno)
        })
    }
    else if (req.body.xml.indexOf('<enviMDFe') > -1 || req.body.xml.indexOf('<mdfeProc') > -1) {
        MontarRotaMDFe(req.body.xml, (retorno) => {
            return res.json(retorno)
        })
    }
}

exports.GetXML = (req, res) => {
    Utils.XmlMDFe((xml) => {
        res.send(xml)
    })
}

var MontarRotaCTe = (xml, callback) => {
    let Trajeto = {  waypoints: [] }
    let inicio, fim
    xml2js(xml, (err, result) => {

        if (typeof result.enviCTe !== 'undefined') {
            inicio = result.enviCTe.CTe[0].infCte[0].ide[0].xMunEnv[0] + ' - ' + result.enviCTe.CTe[0].infCte[0].ide[0].UFEnv[0] + ', ' + result.enviCTe.CTe[0].infCte[0].emit[0].enderEmit[0].xLgr[0] + ', ' + result.enviCTe.CTe[0].infCte[0].emit[0].enderEmit[0].nro[0]
            fim = result.enviCTe.CTe[0].infCte[0].ide[0].xMunFim[0] + ' - ' + result.enviCTe.CTe[0].infCte[0].ide[0].UFFim[0] + ', ' + result.enviCTe.CTe[0].infCte[0].dest[0].enderDest[0].xLgr[0] + ', ' + result.enviCTe.CTe[0].infCte[0].emit[0].enderEmit[0].nro[0]
        }
        
        if (typeof result.cteProc !== 'undefined') {
            inicio = result.cteProc.CTe[0].infCte[0].ide[0].xMunEnv[0] + ' - ' + result.cteProc.CTe[0].infCte[0].ide[0].UFEnv[0] + ', ' + result.cteProc.CTe[0].infCte[0].emit[0].enderEmit[0].xLgr[0] + ', ' + result.cteProc.CTe[0].infCte[0].emit[0].enderEmit[0].nro[0]
            fim = result.cteProc.CTe[0].infCte[0].ide[0].xMunFim[0] + ' - ' + result.cteProc.CTe[0].infCte[0].ide[0].UFFim[0] + ', ' + result.cteProc.CTe[0].infCte[0].dest[0].enderDest[0].xLgr[0] + ', ' + result.cteProc.CTe[0].infCte[0].emit[0].enderEmit[0].nro[0]
        }

        Trajeto.origin = inicio
        Trajeto.destination = fim
        Trajeto.optimizeWaypoints = true
        Trajeto.travelMode = 'DRIVING'

        callback({ status: 200, mensagem: 'sucesso', trajeto: Trajeto })
    })
}

var MontarRotaMDFe = (xml, callback) => {
    let Trajeto = { waypoints: [] }
    let infMunCarrega, infMunDescarga, Emitente

    xml2js(xml, (err, result) => {
        if (err) throw err

        if (typeof result.enviMDFe !== 'undefined') {
            infMunCarrega = result.enviMDFe.MDFe[0].infMDFe[0].ide[0].infMunCarrega
            infMunDescarga = result.enviMDFe.MDFe[0].infMDFe[0].infDoc[0].infMunDescarga
            Emitente = result.enviMDFe.MDFe[0].infMDFe[0].emit[0].enderEmit[0]
        }
        else if (typeof result.mdfeProc !== 'undefined') {
            infMunCarrega = result.mdfeProc.MDFe[0].infMDFe[0].ide[0].infMunCarrega
            infMunDescarga = result.mdfeProc.MDFe[0].infMDFe[0].infDoc[0].infMunDescarga
            Emitente = result.mdfeProc.MDFe[0].infMDFe[0].emit[0].enderEmit[0]
        }
        _.each(infMunCarrega, (municipio) => {
            Utils.ConverteIBGEparaUF(municipio.cMunCarrega[0], (uf) => {
                Trajeto.origin = municipio.xMunCarrega[0] + ' - ' + uf + ', ' + Emitente.xLgr[0] + ', ' + Emitente.nro[0]
            })
        })

        MontarWaypoints(infMunDescarga, (trajeto) => {
            Trajeto.destination = trajeto.fim
            Trajeto.waypoints = trajeto.waypoints
            Trajeto.optimizeWaypoints = true
            Trajeto.travelMode = 'DRIVING'
        })

        callback({ status: 200, mensagem: 'sucesso', trajeto: Trajeto })
    })
}

var MontarWaypoints = (municipios, callback) => {
    let trajeto = { waypoints: [] }
    let destino_final = municipios.pop()

    Utils.ConverteIBGEparaUF(destino_final.cMunDescarga[0], (uf) => {
        trajeto.fim = destino_final.xMunDescarga[0] + ' - ' + uf
    })

    _.each(municipios, (cidade) => {
        Utils.ConverteIBGEparaUF(cidade.cMunDescarga[0], (uf) => {
            trajeto.waypoints.push({ location: cidade.xMunDescarga[0] + ' - ' + uf })
        })
    })
    callback(trajeto)
}