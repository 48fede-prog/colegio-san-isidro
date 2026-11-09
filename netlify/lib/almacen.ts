/**
 * Última copia buena de los datos, guardada en Netlify Blobs.
 * Si la fuente falla, la web sigue mostrando esta copia.
 */
import { getStore } from '@netlify/blobs'
import type { Datos } from '../../src/lib/datos.ts'
import semilla from '../../data.json' with { type: 'json' }
import { obtenerDatosLud } from './lud.ts'

const CLAVE_DATOS = 'ultimo'
const CLAVE_PEDIDO = 'refresco-pedido'
const CLAVE_ESTADO = 'estado-fuente'

/** Pasadas estas horas se intenta actualizar desde la fuente. */
export const HORAS_FRESCO = 3
/** Pasadas estas horas se muestra el aviso "datos actualizados el…". */
export const HORAS_AVISO = 8

const almacen = () => getStore('lud-datos')

export const datosManuales = semilla as unknown as Datos

export const edadHoras = (d: Datos) =>
  (Date.now() - new Date(d.actualizado).getTime()) / 3_600_000

export async function leerGuardados(): Promise<Datos | null> {
  try {
    return ((await almacen().get(CLAVE_DATOS, { type: 'json' })) as Datos | null) ?? null
  } catch (error) {
    console.error('No se pudo leer la copia guardada')
    return null
  }
}

/**
 * Devuelve la copia más nueva entre la guardada (Blobs) y `data.json`.
 * Así, si la fuente deja de funcionar, alcanza con editar `data.json`
 * (y su campo "actualizado") para que la web muestre esos datos.
 */
export function masNuevos(guardados: Datos | null): Datos {
  if (!guardados) return datosManuales
  return new Date(guardados.actualizado) >= new Date(datosManuales.actualizado)
    ? guardados
    : datosManuales
}

/** Descarga de la fuente y guarda. Lanza si la fuente falla. */
export async function refrescar(timeoutMs: number): Promise<Datos> {
  const previos = masNuevos(await leerGuardados())
  try {
    const nuevos = await obtenerDatosLud({ timeoutMs, previos })
    await almacen().setJSON(CLAVE_DATOS, nuevos)
    await almacen().setJSON(CLAVE_ESTADO, { fallo: false })
    return nuevos
  } catch (error) {
    await almacen().setJSON(CLAVE_ESTADO, { fallo: true }).catch(() => {})
    throw error
  }
}

/** Evita disparar muchos refrescos seguidos (uno cada 15 minutos como máximo). */
export async function reservarRefresco(): Promise<boolean> {
  const store = almacen()
  try {
    const pedido = (await store.get(CLAVE_PEDIDO, { type: 'json' })) as { en: string } | null
    if (pedido && Date.now() - new Date(pedido.en).getTime() < 15 * 60_000) return false
    await store.setJSON(CLAVE_PEDIDO, { en: new Date().toISOString() })
    return true
  } catch {
    return false
  }
}

/** Estado de la última consulta, separado de la última respuesta válida. */
export async function falloFuente(): Promise<boolean> {
  try {
    const estado = await almacen().get(CLAVE_ESTADO, { type: 'json' }) as { fallo: boolean } | null
    return estado?.fallo ?? false
  } catch {
    return false
  }
}
