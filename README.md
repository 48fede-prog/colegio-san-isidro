# Colegio San Isidro Universitario · Fútbol LUD

Sitio web del equipo de fútbol de **Colegio San Isidro** en la Liga Universitaria de Deportes (Uruguay):
**Sub 20 – Divisional C** y **Mayores – Divisional G** (según los datos de la Liga para 2026).

Está pensado para celular primero: una sola página liviana con portada, próximo partido, últimos
resultados, fixture completo, tabla de posiciones, plantel y contacto (Instagram + formulario).
Un selector permite pasar de Sub 20 a Mayores en todas las secciones.

## Datos automáticos

Los datos salen de la API pública que usa [LUD Stats](https://lud-stats.vercel.app/) (sitio no oficial):
`https://lud-backend-ld7d.onrender.com/api` — el equipo es el `id 39` ("COLEGIO SAN ISIDRO").

| Endpoint | Para qué |
| --- | --- |
| `/teams/39/matches/` | Todos los partidos (fixture y resultados) |
| `/standings/by-phase/{faseId}/` | Tablas de todas las fases de la temporada |
| `/matches/{id}/` y `/matches/{id}/events/` | Cancha, dorsales y eventos de la ficha |
| `/teams/39/season-players/` | Plantel con partidos, minutos y goles |
| `/weekend-fixture/` | Fixture del fin de semana (hora y cancha) |

Flujo:

1. `GET /api/datos` (Netlify Function) devuelve la última copia guardada en **Netlify Blobs** (o el respaldo en el primer acceso) y la CDN la cachea 30 min. Nunca espera a descargar todas las planillas para responder.
2. Si la copia tiene más de 3 h, se pide un refresco en segundo plano (función background, tolera que la fuente tarde en despertar).
3. Además, una función programada refresca cada 3 h.
4. Si la fuente falla o cambia, se sigue mostrando la última copia y aparece el aviso discreto
   *"Datos actualizados el …"* (en ámbar si tiene más de 8 h).
5. Si nunca se pudo descargar nada, se usa **`data.json`** (raíz del proyecto).

### `data.json` (respaldo editable a mano)

Tiene exactamente el mismo formato que devuelve `/api/datos` (ver `src/lib/datos.ts`).
Si la fuente deja de existir, editalo a mano y **actualizá el campo `"actualizado"`** con la fecha
de hoy: la web siempre usa la copia más nueva entre la guardada y `data.json`.

Para regenerarlo desde la fuente:

```bash
node scripts/actualizar-data-json.ts   # Node 22.18+
```

## Personalizar

- **Escudo:** reemplazá `public/img/escudo.png` (cuadrado, PNG con fondo transparente).
- **Foto de portada:** reemplazá `public/img/portada.png` (vertical u horizontal, se recorta sola).
- **Instagram:** `src/components/club/Instagram.tsx`.
- **Frase de portada:** `src/components/club/Portada.tsx`.

## Tecnología

TanStack Start (React 19) + Tailwind CSS 4, Netlify Functions, Netlify Blobs, Netlify Image CDN
(escudos y fotos optimizados) y Netlify Forms (formulario de contacto).

## Correr localmente

```bash
pnpm install
netlify dev        # sitio + funciones + blobs + image CDN emulados
```

## Rediseño y fichas de partidos

Se conservaron la aplicación, sus componentes y las imágenes originales del repositorio adjunto.
La portada ocupa la pantalla, el próximo partido aparece en una cinta y todos los resultados se
recorren con desplazamiento horizontal o flechas. Cada encuentro tiene una ficha accesible por
teclado, con cierre por Escape y devolución del foco al botón de apertura.

La sincronización también consulta `/matches/{id}/events/` para cada partido jugado. Se guardan
los goles, cambios y tarjetas con jugador, equipo y minuto, tal como los entrega LUD Stats.
Los eventos vacíos **no significan que no haya ocurrido nada**: se muestran como «Sin información».
No se deducen goles ni tarjetas de las estadísticas agregadas. La fuente no siempre publica amarillas,
minutos, canchas o eventos de encuentros recientes.

Las tablas se consultan para **todas las fases de la temporada**. Las pestañas Primera Rueda y Copa
de Plata muestran la fase correspondiente, sin sustituirla por otra. Si Mayores disputa una segunda
rueda de Título y no Plata, la pestaña Plata queda con «Sin información».

### Campos nuevos del respaldo

- `categorias[].tablas`: lista de `{ fase, filas }`, con el mismo formato de la tabla existente.
- `categorias[].partidos[].detalle`: `{ actualizado, eventos }`; puede ser `null`.
- Cada evento tiene `tipo` (`goal`, `substitution`, `yellow_card`, `red_card`), `minuto`, `equipo`
  (ID de la fuente), `jugador`, `entra` y `sale`. Los valores desconocidos son `null`.
- `categorias[].plantel[].numero` y `foto` son opcionales. Sin foto se muestran iniciales y el dorsal;
  si tampoco hay dorsal, se indica `S/N`, sin asignar un número ficticio.
- `avisos` registra consultas parciales fallidas; en ese caso se conserva información anterior y se
  marca la copia como pendiente de actualización. Eliminá avisos resueltos al editar a mano.

Editá números como números, conservá las claves y usá JSON válido (sin comentarios ni comas finales).
No cambies la fecha a hoy para hacer pasar información vieja por nueva; `actualizado` debe representar
la fecha real de revisión. Para una corrección manual completa podés usar `fuente: "manual"`.
La sincronización automática posterior puede reemplazar el respaldo con datos nuevos de la fuente.

## Instagram e información institucional

Subí tu imagen a **`public/img/instagram.jpg`**. Ya queda enlazada a
[@san_isidro_universitario](https://www.instagram.com/san_isidro_universitario/).
Mientras no exista esa imagen, aparece el escudo como enlace. No se descargan publicaciones de Instagram.
Los entrenadores y los datos institucionales están en `src/components/club/Institucion.tsx`.
El ascenso de Mayores a F se muestra como información del club proporcionada por el equipo;
las competiciones y tablas mantienen la divisional G que publica la fuente para 2026.

## Desplegar en Netlify

Conectá este repositorio a Netlify y publicá la rama principal. `netlify.toml` define la compilación
con Vite y la salida `dist/client`; el adaptador despliega TanStack Start y las funciones.
El comando instala primero las dependencias con `pnpm install --frozen-lockfile --prod=false`
y después ejecuta `pnpm run build`. Esto permite compilar también cuando el despliegue por CLI
parte de una copia sin `node_modules`, e incluye Vite y sus plugins de desarrollo.
No hacen falta claves para LUD Stats. Netlify Blobs conserva la última respuesta completa entre
despliegues y la función programada solicita una actualización cada tres horas en producción.
La detección del formulario de contacto está preparada mediante el marcador de activación del proyecto.

Para desarrollo local, luego de instalar dependencias, usá `netlify dev --port 8889` para emular
funciones, caché e imágenes. La validación de compilación de esta entrega se realiza en el despliegue.

La última consulta fallida se registra por separado de la respuesta válida: el aviso se activa
incluso si la copia todavía tiene menos de ocho horas. La antigüedad también activa el aviso
por sí sola. Los errores parciales quedan registrados en `avisos` y cada ficha conserva su propia fecha.
