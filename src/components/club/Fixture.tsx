import { FichaPartido } from './FichaPartido'
import { useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import type { Categoria, Partido } from '@/lib/datos'
import { TEXTO_RESULTADO, enlaceMapa, fechaTaco, rival } from '@/lib/formato'
import { cn } from '@/lib/utils'
import { Escudo, esPropio } from './Escudo'
import { COLOR_RESULTADO } from './Resultados'
import { Seccion, Vacio } from './Seccion'

function Nombre({ partido, lado }: { partido: Partido; lado: 'local' | 'visitante' }) {
  const e = partido[lado]
  return <span className={esPropio(e) ? 'font-bold text-foreground' : 'font-semibold text-azul'}>{e.nombre}</span>
}

function FilaFixture({ partido }: { partido: Partido }) {
  const t = fechaTaco(partido)
  const jugado = partido.estado === 'jugado' && partido.resultado
  const detalle = [
    partido.ronda,
    jugado
      ? `${TEXTO_RESULTADO[partido.resultado!]} ${partido.golesLocal} – ${partido.golesVisitante}`
      : `${t.hora} h`,
    partido.cancha,
  ].filter(Boolean)

  return (
    <li className="fixture-fila flex gap-4 border-l-4 border-l-azul border-b border-border bg-background p-4 sm:p-6">
      <div
        className={cn(
          'flex w-16 shrink-0 flex-col items-center justify-center rounded-xl py-2.5 font-display leading-none',
          jugado ? 'bg-azul-claro text-azul' : 'bg-azul text-white',
        )}
      >
        <span className="text-sm font-bold tracking-wider">{t.dia}</span>
        <span className="my-0.5 text-3xl font-extrabold">{t.num}</span>
        <span className={cn('text-sm font-bold tracking-wider', !jugado && 'text-amarillo')}>{t.mes}</span>
      </div>
      <Escudo equipo={rival(partido)} tam={44} className="mt-3 hidden sm:inline-flex" />
      <div className="min-w-0 flex-1">
        <p className="text-lg leading-snug">
          <Nombre partido={partido} lado="local" /> <span className="text-muted-foreground">vs</span>{' '}
          <Nombre partido={partido} lado="visitante" />
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-muted-foreground">
          {jugado && (
            <span aria-hidden="true" className={cn('inline-block size-2.5 rounded-full', COLOR_RESULTADO[partido.resultado!].fondo)} />
          )}
          {detalle.join(' · ')}
          {!jugado && <span className="rounded bg-amarillo px-1.5 py-0.5 text-xs font-bold text-azul uppercase">Por jugar</span>}
        </p>
        {partido.cancha && (
          <a
            href={enlaceMapa(partido.cancha)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold tracking-wider text-azul-vivo uppercase hover:underline"
          >
            <MapPin className="size-4" aria-hidden="true" /> Ver en Google Maps
          </a>
        )}
        <FichaPartido partido={partido} />
      </div>
    </li>
  )
}

export function Fixture({ categoria }: { categoria: Categoria }) {
  const fases = useMemo(() => {
    const orden: string[] = []
    for (const p of categoria.partidos) if (!orden.includes(p.fase)) orden.push(p.fase)
    return orden.reverse() // la fase en curso primero
  }, [categoria])
  const [fase, setFase] = useState(categoria.faseActual)

  const partidos = categoria.partidos.filter((p) => p.fase === (fases.includes(fase) ? fase : fases[0]))

  return (
    <Seccion
      id="fixture"
      antetitulo={`${categoria.nombre} · ${categoria.divisional} · ${categoria.temporada}`}
      titulo="Fixture"
      className="bg-white"
    >
      {fases.length > 1 && (
        <div role="group" aria-label="Fases del torneo" className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {fases.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={f === fase}
              onClick={() => setFase(f)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none',
                f === fase ? 'border-azul bg-azul text-white' : 'border-input bg-white text-azul hover:bg-azul-claro',
              )}
            >
              {f}
              {f === categoria.faseActual && <span className="ml-1.5 text-amarillo">●</span>}
            </button>
          ))}
        </div>
      )}
      {partidos.length === 0 ? (
        <Vacio>Sin información</Vacio>
      ) : (
        <ol className="grid gap-3">
          {partidos.map((p) => (
            <FilaFixture key={p.id} partido={p} />
          ))}
        </ol>
      )}
    </Seccion>
  )
}
