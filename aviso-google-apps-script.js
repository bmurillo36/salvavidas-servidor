// Aviso de caida del VPS (217.160.143.88) desde Google Apps Script.
// IONOS no permite reiniciar este VPS por API (confirmado por su soporte el 26/09/2026),
// asi que esto solo AVISA: un correo al caer y otro al volver. Reiniciar = a mano en cloudpanel.ionos.es.
// Se instala una vez ejecutando instalar(); despues corre solo cada 5 minutos.

var WEBS = ['https://code.prevencion.cc/', 'https://monitor.prevencion.cc/'];
var PARA = 'pedro@prevencion.cc';
var FALLOS_PARA_AVISAR = 2; // 2 rondas seguidas = unos 10 minutos caido

function responde(url) {
  try {
    var r = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: false });
    return r.getResponseCode() < 500; // 401/302 del login tambien es que el servidor vive
  } catch (e) {
    return false;
  }
}

function vigilar() {
  var p = PropertiesService.getScriptProperties();
  var fallos = Number(p.getProperty('fallos') || 0);
  var avisado = p.getProperty('avisado') === 'si';
  // Caido solo si NO responde ninguna: una web sola puede fallar por su cuenta.
  var vivo = WEBS.some(responde);
  var ahora = Utilities.formatDate(new Date(), 'Europe/Madrid', 'dd/MM/yyyy HH:mm');

  if (vivo) {
    if (avisado) {
      MailApp.sendEmail(PARA, 'VPS: VUELVE a responder (' + ahora + ')',
        'El servidor 217.160.143.88 vuelve a responder a las ' + ahora + '.\n\nAviso automatico (Google Apps Script «Aviso caida VPS»).');
    }
    p.setProperties({ fallos: '0', avisado: 'no' });
    return;
  }

  fallos++;
  p.setProperty('fallos', String(fallos));
  if (fallos >= FALLOS_PARA_AVISAR && !avisado) {
    MailApp.sendEmail(PARA, 'VPS CAIDO: no responde desde hace unos ' + (fallos * 5) + ' min (' + ahora + ')',
      'Ni ' + WEBS.join(' ni ') + ' responden.\n\n' +
      'Para reiniciarlo:\n' +
      '1. https://cloudpanel.ionos.es (cliente 52704917)\n' +
      '2. Infraestructura -> Servidores -> marcar «My VPS» (217.160.143.88)\n' +
      '3. Acciones -> Reiniciar. NUNCA «Reinstalar imagen».\n\n' +
      'Cuando vuelva a responder te llegara otro correo.\n\nAviso automatico (Google Apps Script «Aviso caida VPS»).');
    p.setProperty('avisado', 'si');
  }
}

function instalar() {
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('vigilar').timeBased().everyMinutes(5).create();
  vigilar();
}

// Prueba sin esperar a una caida.
function probarCorreo() {
  MailApp.sendEmail(PARA, 'PRUEBA: aviso de caida del VPS',
    'Esto es una prueba. Si te llega, el aviso de caida funciona.\n\nEl servidor responde ahora: ' + WEBS.some(responde));
}
