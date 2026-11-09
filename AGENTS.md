# AGENTS.md

Sitio de fútbol de **Colegio San Isidro** (Liga Universitaria de Deportes, Uruguay). Una sola página
(`src/routes/index.tsx`), en español de Uruguay (voseo: "mirá", "seguinos"), mobile-first.

## Arquitectura

```
data.json                      # Respaldo editable a mano; mismo formato que /api/datos
scripts/actualizar-data-json.ts# Regenera data.json desde la fuente (node, TS sin build)
netlify/lib/lud.ts             # Descarga y normaliza la API de lud-stats (onrender)
netlify/lib/almacen.ts         # Copia en Netlify Blobs (store "lud-datos"), frescura, fallback a data.json
netlify/functions/datos.mts    # GET /api/datos — sirve la copia, dispara refresco si > 3 h, headers de CDN
netlify/functions/lud-refresco.mts   # Background: refresca (timeout largo, la fuente es un free tier lento)
netlify/functions/lud-programado.mts # Cron cada 3 h → dispara lud-refresco
src/lib/datos.ts               # Tipos compartidos (Datos, Categoria, Partido, FilaTabla, Jugador)
src/lib/useDatos.ts            # Hook cliente: data.json → localStorage → /api/datos
src/lib/formato.ts             # Fechas (America/Montevideo, UTC−3 fijo), Image CDN, Google Maps
src/components/club/*          # Secciones de la página
public/contacto-form.html      # Registro estático de Netlify Forms (form "contacto")
public/img/escudo.png, portada.png   # Reemplazables por el cliente
```

## Decisiones no obvias

- La fuente es la API **no oficial** `https://lud-backend-ld7d.onrender.com/api`, equipo `id 39`.
  Se detectan solas la temporada y la fase en curso por categoría (`CATEGORIAS` en `lud.ts`), sin
  hardcodear divisionales. En 2026 los datos dicen Mayores **Divisional G** (el pedido decía F).
- Partidos "FECHA LIBRE" / "NO SE JUEGA" se descartan.
- La API deja `venue: null` en partidos recientes; la cancha se completa con `/weekend-fixture/` y se
  conserva de la copia anterior (`previos`) en cada refresco.
- `masNuevos()` elige entre Blobs y `data.json` por el campo `actualizado`: editar `data.json` con una
  fecha nueva le gana a una copia vieja de Blobs.
- `desactualizado` = copia con más de 8 h → la web muestra el aviso en ámbar.
- Escudos remotos pasan por Netlify Image CDN (`remote_images` en `netlify.toml`). El escudo propio
  siempre sale de `public/img/escudo.png`, no de la API.
- El formulario de contacto postea a `/contacto-form.html` (no a `/`, que es SSR).

## Convenciones

- Nombres de código y textos en español. Tailwind con variables de tema en `src/styles.css`
  (`azul`, `azul-vivo`, `azul-claro`, `amarillo`, `amarillo-suave`, `victoria`, `derrota`).
- Títulos con `font-display` (Barlow Condensed) en mayúsculas; cuerpo en Barlow.
- No agregar dependencias pesadas: el sitio debe seguir siendo liviano.

## Actualización de diseño y fuente

- `FichaPartido.tsx`: diálogo Radix con eventos ya normalizados, sin consultas desde el navegador a LUD.
- `Institucion.tsx`: técnicos, club e imagen manual de Instagram (`public/img/instagram.jpg`, opcional).
- `lud.ts` descarga eventos con concurrencia máxima de cuatro y tablas de todas las fases. `tablas`
  es opcional para compatibilidad con copias antiguas. `detalle` de partido también es opcional.
- `avisos` conserva evidencia de errores parciales; no presentar datos heredados como actualización completa.
- Sin información no equivale a cero. No generar dorsales a partir del índice de jugadores.
- Las pestañas de tablas son Primera Rueda y Copa de Plata. Mayores puede no disputar Plata.
- El ascenso a F es contenido institucional proporcionado por el usuario; no modificar por eso tablas G.
- Esta entrega restaura el código desde el ZIP adjunto porque el directorio del proyecto estaba vacío.
- Las fichas consultan también `/matches/{id}/` para recuperar cancha y dorsales. Se conserva el dorsal
  más reciente publicado por jugador (ID de la fuente), no se genera uno. Las planillas están limitadas
  a cuatro partidos concurrentes y doce segundos por consulta para respetar el tiempo del worker.
- `/api/datos` responde siempre desde la copia, sin esperar la sincronización. `estado-fuente` en Blobs
  registra el último fallo y activa el aviso antes del umbral de ocho horas.
- No ejecutar builds, servidores ni validaciones locales en este entorno: la plataforma valida el despliegue.

- El comando de Netlify instala dependencias desde `pnpm-lock.yaml` con `--prod=false` antes de
  ejecutar `pnpm run build`; los despliegues por CLI pueden partir sin `node_modules`.
