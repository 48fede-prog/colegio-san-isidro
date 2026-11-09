import { useEffect, useState } from 'react'
import semilla from '../../data.json'
import type { Datos, RespuestaDatos } from './datos'

const CLAVE_LOCAL = 'csi-datos-v1'
const HORAS_AVISO = 8

const edadHoras = (d: Datos) => (Date.now() - new Date(d.actualizado).getTime()) / 3_600_000
const masNuevo = (a: Datos, b: Datos) => new Date(a.actualizado) >= new Date(b.actualizado)

export type EstadoDatos = 'cargando' | 'listo' | 'sin-conexion'

/**
 * Datos del equipo. Arranca con `data.json` (incluido en el sitio, así la
 * página nunca queda vacía), después usa la copia del navegador y por último
 * lo que devuelve la función `/api/datos`.
 */
export function useDatos() {
  const [datos, setDatos] = useState<RespuestaDatos>({
    ...(semilla as unknown as Datos),
    desactualizado: false,
  })
  const [estado, setEstado] = useState<EstadoDatos>('cargando')

  useEffect(() => {
    let vigente = true
    let actual = semilla as unknown as Datos

    try {
      const local = localStorage.getItem(CLAVE_LOCAL)
      if (local) {
        const guardado = JSON.parse(local) as RespuestaDatos
        if (guardado?.categorias && masNuevo(guardado, actual)) {
          actual = guardado
          setDatos({ ...guardado, desactualizado: edadHoras(guardado) > HORAS_AVISO })
        }
      }
    } catch {
      /* copia local corrupta: se ignora */
    }

    fetch('/api/datos', { signal: AbortSignal.timeout(20_000) })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<RespuestaDatos>
      })
      .then((nuevos) => {
        if (!vigente || !Array.isArray(nuevos?.categorias)) throw new Error('Formato')
        if (masNuevo(nuevos, actual)) {
          setDatos(nuevos)
          try {
            localStorage.setItem(CLAVE_LOCAL, JSON.stringify(nuevos))
          } catch {
            /* sin espacio: no pasa nada */
          }
        } else {
          setDatos({ ...actual, desactualizado: nuevos.desactualizado || edadHoras(actual) > HORAS_AVISO })
        }
        setEstado('listo')
      })
      .catch(() => {
        if (!vigente) return
        setDatos((d) => ({ ...d, desactualizado: true }))
        setEstado('sin-conexion')
      })

    return () => {
      vigente = false
    }
  }, [])

  return { datos, estado }
}
