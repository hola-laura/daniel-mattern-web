// Almacén de pruebas en Google Drive. Se sustituirá por Supabase.
// La contraseña NO va aquí: se guarda en Propiedades del script como PASSWORD.
const CARPETA_ID = '1Fmt0BmA_dmVXNpWG14WSB2zndSEOQ6WU';
const NOMBRE = 'contenido-web.json';
const CLAVES = ['rutas', 'portada', 'servicios', 'cordilleras', 'reservas', 'sobre-mi', 'preguntas', 'secciones', 'general'];
const MAX_BYTES = 2000000;

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
