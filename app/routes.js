const Mapa = require('./map.js')

module.exports = (app) => {
    //Midleware
    app.post('/mapa/', Mapa.VerificarParametros,  Mapa.MontarRota)
    app.get('/xml/:documento', Mapa.GetXML)
}