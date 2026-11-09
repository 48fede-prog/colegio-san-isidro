/**
 * GET /api/datos — fixture, resultados, tabla y plantel de Colegio San Isidro.
 *
 * - Responde con la última copia guardada (rápido) y la CDN la cachea.
 * - Si la copia tiene más de 3 h, pide un refresco en segundo plano.
 * - Si la fuente falla, sigue sirviendo la última copia (o `data.json`)
 *   con `desactualizado: true` para que la web muestre el aviso.
 */
import type { Config, Context } from '@netlify/functions'
import type { RespuestaDatos } from '../../src/lib/datos.ts'
import {
  falloFuente,
  HORAS_AVISO,
  HORAS_FRESCO,
  edadHoras,
  leerGuardados,
  masNuevos,
  reservarRefresco,
} from '../lib/almacen.ts'

export default async (req: Request, context: Context) => {
  const [guardados, fallo] = await Promise.all([leerGuardados(), falloFuente()])
  const datos = masNuevos(guardados)

  // La respuesta pública nunca espera la descarga completa de todas las planillas.
  if ((!guardados || edadHoras(datos) > HORAS_FRESCO) && (await reservarRefresco())) {
    context.waitUntil(pedirRefresco(req))
  }

  const cuerpo: RespuestaDatos = { ...datos, desactualizado: fallo || !!datos.avisos?.length || edadHoras(datos) > HORAS_AVISO }

  return Response.json(cuerpo, {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Netlify-CDN-Cache-Control':
        'public, durable, s-maxage=1800, stale-while-revalidate=86400',
    },
  })
}

function pedirRefresco(req: Request) {
  const url = new URL('/.netlify/functions/lud-refresco', req.url)
  return fetch(url, { method: 'POST' }).catch((error) =>
    console.error('No se pudo pedir el refresco', error),
  )
}

export const config: Config = {
  path: '/api/datos',
  method: 'GET',
}
