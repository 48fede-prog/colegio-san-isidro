import { useRef } from 'react'
import { FichaPartido } from './FichaPartido'
import { ArrowRight } from 'lucide-react'
import type { Categoria, Partido, Resultado } from '@/lib/datos'
import { TEXTO_RESULTADO, fechaCorta } from '@/lib/formato'
import { cn } from '@/lib/utils'
import { Escudo, esPropio } from './Escudo'
import { Seccion, Vacio } from './Seccion'

export const COLOR_RESULTADO: Record<Resultado, { borde: string; texto: string; fondo: string }> = {
  V: { borde: 'border-t-victoria', texto: 'text-victoria', fondo: 'bg-victoria' },
  E: { borde: 'border-t-amarillo', texto: 'text-amber-700', fondo: 'bg-amarillo' },
  D: { borde: 'border-t-derrota', texto: 'text-derrota', fondo: 'bg-derrota' },
}

function Linea({ partido, lado }: { partido: Partido; lado: 'local' | 'visitante' }) {
  const e = partido[lado]
  const goles = lado === 'local' ? partido.golesLocal : partido.golesVisitante
  const otro = lado === 'local' ? partido.golesVisitante : partido.golesLocal
  const nuestro = esPropio(e)
  const gano = (goles ?? 0) > (otro ?? 0)
  return (
    <div className="flex items-center gap-4">
      <Escudo equipo={e} tam={40} />
      <span className={cn('min-w-0 flex-1 text-lg leading-tight', nuestro ? 'font-bold text-foreground' : 'text-muted-foreground')}>
        {e.nombre}
      </span>
      <span className={cn('font-display text-5xl leading-none font-extrabold tabular-nums', gano ? 'text-azul' : 'text-azul/45')}>
        {goles}
      </span>
    </div>
  )
}

export function TarjetaResultado({ partido }: { partido: Partido }) {
  const r = partido.resultado!
  return (
    <article className={cn('rounded-2xl border-t-[6px] bg-white p-6 shadow-sm ring-1 ring-border', COLOR_RESULTADO[r].borde)}>
      <header className="mb-5 flex items-start justify-between gap-3 text-xs font-bold tracking-[0.14em] uppercase">
        <span className="text-muted-foreground">
          {[partido.ronda, fechaCorta(partido), partido.cancha].filter(Boolean).join(' · ')}
        </span>
        <span className={COLOR_RESULTADO[r].texto}>{TEXTO_RESULTADO[r]}</span>
      </header>
      <div className="space-y-4">
        <Linea partido={partido} lado="local" />
        <Linea partido={partido} lado="visitante" />
      </div>
    </article>
  )
}

export function UltimosResultados({ categoria }: { categoria: Categoria }) {
  const cinta = useRef<HTMLDivElement>(null)
  const jugados = categoria.partidos.filter((p) => p.estado === 'jugado' && p.resultado)
  const ultimos = [...jugados].reverse()
  const resumen = jugados.reduce(
    (acc, p) => ({ ...acc, [p.resultado!]: acc[p.resultado!] + 1 }),
    { V: 0, E: 0, D: 0 } as Record<Resultado, number>,
  )

  return (
    <Seccion
      id="resultados"
      antetitulo={`${categoria.nombre} · Temporada ${categoria.temporada}`}
      titulo="Últimos resultados"
      extra={
        jugados.length > 0 && (
          <dl className="flex gap-2 text-center" aria-label="Balance de la temporada">
            {(['V', 'E', 'D'] as const).map((k) => (
              <div key={k} className="min-w-16 rounded-xl bg-white px-3 py-2 ring-1 ring-border">
                <dt className="text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase">{TEXTO_RESULTADO[k]}s</dt>
                <dd className={cn('font-display text-3xl font-extrabold', COLOR_RESULTADO[k].texto)}>{resumen[k]}</dd>
              </div>
            ))}
          </dl>
        )
      }
    >
      {ultimos.length === 0 ? (
        <Vacio>Todavía no hay partidos jugados en esta temporada.</Vacio>
      ) : (
        <div ref={cinta} className="carrusel-resultados flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5" aria-label="Todos los resultados">
          {ultimos.map((p) => (
            <div key={p.id} className="w-[85%] max-w-sm shrink-0 snap-start sm:w-[340px]"><TarjetaResultado partido={p} /><FichaPartido partido={p} /></div>
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-center gap-3" aria-label="Controles del carrusel"><button type="button" aria-label="Resultados anteriores" className="border border-azul px-5 py-2 text-azul" onClick={() => cinta.current?.scrollBy({ left: -360, behavior: 'smooth' })}>←</button><button type="button" aria-label="Más resultados" className="border border-azul px-5 py-2 text-azul" onClick={() => cinta.current?.scrollBy({ left: 360, behavior: 'smooth' })}>→</button></div>
      <a href="#fixture" className="mt-6 inline-flex items-center gap-2 text-sm font-bold tracking-[0.16em] text-azul-vivo uppercase hover:underline">
        Ver todos los partidos <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </Seccion>
  )
}
