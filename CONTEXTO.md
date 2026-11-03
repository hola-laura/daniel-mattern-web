# Web de Daniel Mattern: contexto del proyecto

Prototipo de web para Daniel Mattern, guía de montaña y escalada (TD2 Montaña, TD2 Escalada, AEGM, UIMLA).
Toda la web está en un solo archivo: `index.html`.

## Cómo trabajar
- Haz los cambios en el código, no en Figma, salvo que se pida lo contrario.
- La interfaz y los textos están en español, tratando al visitante de tú.
- Rutas, salidas y cordilleras se editan en los arrays `ROUTES`, `DEPS` y `RANGES`, al inicio del `<script>`.
- Los colores y tipografías son variables CSS en `:root`, con su versión oscura debajo.

## Decisiones tomadas
- **Sin alpinismo ni alta montaña.** Daniel no es guía de alta montaña. No propongas glaciares, crampones, piolet ni crestas alpinas.
- La oferta es: rutas guiadas, trekkings, escalada en paredes de roca, raquetas de nieve, cursos y actividades privadas.
- Los destinos se organizan por cordilleras, en España y en el mundo.
- La portada ocupa una pantalla completa: título y botones deben verse sin hacer scroll.
- La paleta verde sale del Figma del proyecto: oscuro `#2F4A3A`, velo `#456853`, acento `#C8E3C1`, fondo `#F4F7F1`.
- No hay opiniones de clientes. No inventes testimonios: solo se añaden reseñas reales.

## Qué es real y qué es de ejemplo
- **Real:** biografía, titulaciones, cita de Chantal Mauduit e Instagram `@mattern_guide`.
- **De ejemplo, hay que sustituirlo:** rutas, distancias, perfiles de altitud, grados, precios, fechas, plazas, contenido incluido, puntos de encuentro, condiciones de reserva y cancelación, y seguro.
- Las altitudes de las cumbres más altas de cada cordillera se pusieron de memoria y conviene revisarlas.

## Pendiente
- [ ] Incrustar o alojar las fotos. Ahora son enlaces a Pexels y no cargan en vistas previas que bloquean imágenes externas.
- [ ] Sustituir la foto de Sistema Central: no está confirmado que sea de esa zona.
- [ ] Añadir una foto de Daniel en «Sobre mí».
- [ ] Añadir teléfono, correo y WhatsApp reales de Daniel. No uses los datos de Subalpino.
- [ ] Conectar una pasarela de pago real. Ahora el pago es simulado y no se piden datos de tarjeta.
- [ ] Hacer funcionar los formularios de reserva y contacto.
- [ ] Decidir si oscurecer `#8A9B6F` en «Quedan 2 de 6», porque tiene poco contraste sobre blanco.
- [ ] Revisar textos legales, requisitos para viajes al extranjero y alcance de las titulaciones.
- [ ] Quitar la banda de prototipo antes de publicar la versión final.
