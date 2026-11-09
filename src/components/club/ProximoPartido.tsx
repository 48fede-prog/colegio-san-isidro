import type { Categoria, ClaveCategoria, Partido } from '@/lib/datos'
import { aFecha, fechaLarga } from '@/lib/formato'
import { Escudo } from './Escudo'
export function proximoPartido(c: Categoria, ahora = Date.now()): Partido | null {
  return c.partidos.find((p) => p.estado === 'programado' && aFecha(p.fecha).getTime() > ahora - 2 * 3_600_000) ?? null
}
export function ProximoPartido({ categoria }: { categoria: Categoria; categorias: Categoria[]; onCambiar: (c: ClaveCategoria) => void }) {
  const p = proximoPartido(categoria)
  return <section id="proximo" aria-labelledby="titulo-proximo" className="border-b-4 border-azul bg-amarillo text-azul">
    <div className="mx-auto grid max-w-content items-center gap-4 px-5 py-5 md:grid-cols-[180px_1fr_auto]">
      <div><h2 id="titulo-proximo" className="font-display text-2xl font-extrabold uppercase">Próximo partido</h2><p className="text-xs font-semibold uppercase">{categoria.nombre}</p></div>
      {p ? <><div className="flex items-center gap-3 font-display text-lg font-bold uppercase sm:text-2xl"><Escudo equipo={p.local} tam={36} /><span>{p.local.nombre}</span><span className="text-sm opacity-60">vs</span><Escudo equipo={p.visitante} tam={36} /><span>{p.visitante.nombre}</span></div><div className="text-sm"><p className="font-bold">{fechaLarga(p)}</p><p>{p.cancha ?? 'Sin información'}</p></div></> : <p className="text-sm">Sin información sobre el próximo partido.</p>}
    </div>
  </section>
}
