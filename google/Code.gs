// Almacén de pruebas en Google Drive. Se sustituirá por Supabase.
// La contraseña NO va aquí: se guarda en Propiedades del script como PASSWORD.
const CARPETA_ID = '1Fmt0BmA_dmVXNpWG14WSB2zndSEOQ6WU';
const NOMBRE = 'contenido-web.json';
const CLAVES = ['rutas', 'portada', 'servicios', 'cordilleras', 'reservas', 'sobre-mi', 'preguntas', 'secciones', 'general'];
const MAX_BYTES = 2000000;
const HOJA = 'Contactos web';
const MAX_POR_HORA = 20;

function archivo_() {
  const carpeta = DriveApp.getFolderById(CARPETA_ID);
  const lista = carpeta.getFilesByName(NOMBRE);
  return lista.hasNext() ? lista.next() : carpeta.createFile(NOMBRE, '{}', 'application/json');
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function doGet() {
  return ContentService.createTextOutput(archivo_().getBlob().getDataAsString('UTF-8')).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e) {
  let p;
  try { p = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'peticion' }); }
  if (p.accion === 'contacto') return contacto_(p);
  const clave = PropertiesService.getScriptProperties().getProperty('PASSWORD');
  if (!clave || clave.length < 12 || p.password !== clave) {
    Utilities.sleep(1000);
    return json_({ ok: false, error: 'password' });
  }
  if (p.accion === 'comprobar') return json_({ ok: true });
  if (p.accion !== 'guardar' || CLAVES.indexOf(p.clave) < 0) return json_({ ok: false, error: 'peticion' });
  const cerrojo = LockService.getScriptLock();
  cerrojo.waitLock(15000);
  try {
    const f = archivo_();
    const datos = JSON.parse(f.getBlob().getDataAsString('UTF-8') || '{}');
    datos[p.clave] = p.datos;
    const texto = JSON.stringify(datos);
    if (texto.length > MAX_BYTES) return json_({ ok: false, error: 'tamano' });
    f.setContent(texto);
    return json_({ ok: true });
  } finally {
    cerrojo.releaseLock();
  }
}

// Los mensajes de la web van a la hoja y avisan por correo.
function hoja_() {
  const carpeta = DriveApp.getFolderById(CARPETA_ID);
  const lista = carpeta.getFilesByName(HOJA);
  if (lista.hasNext()) return SpreadsheetApp.open(lista.next()).getSheets()[0];
  const libro = SpreadsheetApp.create(HOJA);
  DriveApp.getFileById(libro.getId()).moveTo(carpeta);
  const h = libro.getSheets()[0];
  h.appendRow(['Fecha', 'Nombre', 'Correo', 'Mensaje', 'Estado']);
  h.getRange(1, 1, 1, 5).setFontWeight('bold');
  h.setFrozenRows(1);
  h.setColumnWidth(4, 420);
  return h;
}
function texto_(v, max) {
  const t = String(v || '').trim().slice(0, max);
  return /^[=+\-@]/.test(t) ? "'" + t : t; // Evita que la hoja lo trate como fórmula.
}
function contacto_(p) {
  if (p.web) return json_({ ok: true }); // Campo trampa: solo lo rellenan los robots.
  const nombre = texto_(p.nombre, 120), correo = String(p.correo || '').trim().slice(0, 160), mensaje = texto_(p.mensaje, 3000);
  if (!nombre || !mensaje || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || !p.acepta) return json_({ ok: false, error: 'datos' });
  const cache = CacheService.getScriptCache(), n = Number(cache.get('contactos') || 0);
  if (n >= MAX_POR_HORA) return json_({ ok: false, error: 'limite' });
  cache.put('contactos', String(n + 1), 3600);
  const cerrojo = LockService.getScriptLock();
  cerrojo.waitLock(15000);
  try {
    hoja_().appendRow([new Date(), nombre, correo, mensaje, 'Nuevo']);
  } finally {
    cerrojo.releaseLock();
  }
  const para = PropertiesService.getScriptProperties().getProperty('AVISO_EMAIL') || Session.getEffectiveUser().getEmail();
  MailApp.sendEmail({ to: para, replyTo: correo, subject: 'Nuevo contacto en la web: ' + nombre, body: 'Nombre: ' + nombre + '\nCorreo: ' + correo + '\n\nMensaje:\n' + mensaje + '\n\nResponde a este correo para contestarle directamente.' });
  return json_({ ok: true });
}
