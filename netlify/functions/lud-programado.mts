/**
 * Cada 3 horas pide un refresco de los datos (solo en el deploy publicado).
 */
import type { Config } from '@netlify/functions'

export default async () => {
  const base = Netlify.env.get('URL')
  if (!base) return
  await fetch(new URL('/.netlify/functions/lud-refresco', base), { method: 'POST' }).catch(
    (error) => console.error('No se pudo pedir el refresco programado', error),
  )
}

export const config: Config = {
  schedule: '0 */3 * * *',
}
