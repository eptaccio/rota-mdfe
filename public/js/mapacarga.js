function TrataErros(mensagem) {

    Mudarestado('errorImg');

    $('html, body').animate({ scrollTop: 0 }, 0);

    $("#validaMsg").fadeIn();

    $("#validaMsg").text(mensagem);

    //$("#validaMsg").focus();

    $("#validaMsg").fadeOut(4000, function () {

        $("div.validaMsg").remove();

        location.reload();

    });

}



function Mudarestado(el) {

    var display = document.getElementById(el).style.display;

    if (display == "none")

        document.getElementById(el).style.display = 'block';

    else

        document.getElementById(el).style.display = 'none';

}



function VerificaXML(xmldata) {

    try {

            Mudarestado('mapa');

            xmldata = jQuery.parseXML(_XML); //Converte texto para XML

            var rssentries = xmldata.getElementsByTagName('infMunCarrega');

            var rssentries = xmldata.getElementsByTagName('infMunDescarga');

            _XML = xmldata;

            return true;

    }

    catch (e) {

        TrataErros(RetornaErro(xml));

        return false;

    }

}



function RetornaErro(xml) { //Validações de erros

    var retorno;

    xml = document.getElementById("XMLMDFE").value;



    if (_munFim == _munInicio && waypts.length == 0 && _trajeto != "") {

        retorno = "O XML possui apenas um municipio, sendo o mesmo para carga e descarga.";

        ExibeDiv(false);

        return retorno;

    }

    else if (_trajeto.length > 10) {

        retorno = "A versão BETA tem o limite de apenas 10 municipios.";

        ExibeDiv(false);

        return retorno;

    }

    else if (_XML == ""){

        retorno = "O campo xml deve ser preenchido!";

        ExibeDiv(false);

        return retorno;

    }

    else if (_trajeto == "" && _XML != "") {

        retorno = "Este não é um XML válido para a operação.";

        ExibeDiv(false);

        return retorno;

    }

    

}



function LerTextArea() {

    _XML = document.getElementById("XMLMDFE").value;

   



    if (VerificaXML(_XML))

            LerXML(_XML);

        

}



function AbrirDialog() {

    $("#fileXML").click();

}



function LerFileInput(event) {

    var reader = new FileReader();

    var file = event.files[0];



    reader.onload = function (e) {

        _XML = reader.result;

        if (VerificaXML(_XML))

            LerXML(_XML)

    }



    reader.readAsText(file);

}



function ExibeDiv(exibe) {

    if (exibe == true) {

        $("#xml").hide();

        $("#logosec").hide();

        $("#mapa").show();

    } else if(exibe == false) {

        $("#xml").hide();

        $("#logosec").hide();

        $("#mapa").hide();

    }

}



function LerXML(xmldata) {

    var requisicao = new CriaObjeto();



    var rssentries = xmldata.getElementsByTagName('infMunCarrega');



        for (var i = 0; i < rssentries.length; i++) {

            _trajeto[i] = rssentries[i].getElementsByTagName('xMunCarrega')[0].firstChild.nodeValue + ' - '

            _trajeto[i] += ConverteIBGEparaUF(rssentries[i].getElementsByTagName('cMunCarrega')[0].firstChild.nodeValue)

        }

        var rssentries = xmldata.getElementsByTagName('infMunDescarga')

        var j = _trajeto.length;



        for (var i = 0; i < rssentries.length; i++) {

            _trajeto[j] = rssentries[i].getElementsByTagName('xMunDescarga')[0].firstChild.nodeValue + ' - '

            _trajeto[j] += ConverteIBGEparaUF(rssentries[i].getElementsByTagName('cMunDescarga')[0].firstChild.nodeValue)

            j++;

        }

        ConvertTrajetoParaWaypts();



        if (RetornaErro(xml)) {

            TrataErros(RetornaErro(xml));

        }

        else {

            initialize();

			/*Mudarestado('ImgSalvar');*/

            ExibeDiv(true);

        }

    }



function ConvertTrajetoParaWaypts() {

    if (_trajeto != "") {

        var lastpoint



        data = _trajeto

        limit = data.length

        for (var waypoint = 0; waypoint < limit; waypoint++) {

            if (data[waypoint] === lastpoint) {

                continue;

            }



            // Prepare the lastpoint for the next loop

            lastpoint = data[waypoint]



            // Add this to waypoint to the array for making the request

            waypts.push({

                location: data[waypoint],

                stopover: true

            });

        }



        // Grab the first waypoint for the 'start' location

        _munInicio = (waypts.shift()).location;

        // Grab the last waypoint for use as a 'finish' location

        _munFim = waypts.pop();

        if (_munFim === undefined) {

            _munFim = _munInicio;

        } else {

            _munFim = _munFim.location;

        }

    }

    else if(_trajeto == "")

    {

        TrataErros(RetornaErro(xml));

        Mudarestado('errorImg');

    }

}



function CriaObjeto() {

    var activexmodes = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] //activeX versions to check for in IE

    if (window.ActiveXObject) { //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)

        for (var i = 0; i < activexmodes.length; i++) {

            try {

                return new ActiveXObject(activexmodes[i])

            }

            catch (e) {

                //suppress error

            }

        }

    }

    else if (window.XMLHttpRequest) // if Mozilla, Safari etc

        return new XMLHttpRequest()

    else

        return false

}



function ConverteIBGEparaUF(cCodIBGE) {

    var cUF = cCodIBGE.substring(0, 2);

    var arrUF = [];



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



    return arrUF[cUF];

}