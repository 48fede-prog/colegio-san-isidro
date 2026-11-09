import type { Partido } from '@/lib/datos'
import { fechaLarga } from '@/lib/formato'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
const grupos = [ ['goal', 'Goleadores'], ['substitution', 'Cambios'], ['yellow_card', 'Tarjetas amarillas'], ['red_card', 'Tarjetas rojas'] ] as const
export function FichaPartido({ partido: p }: { partido: Partido }) {
  return <Dialog><DialogTrigger className="mt-3 border-b border-azul pb-1 text-sm font-bold text-azul hover:text-azul-vivo">Abrir ficha del partido ↗</DialogTrigger>
    <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-xl">
      <DialogTitle className="pr-6 font-display text-3xl font-bold uppercase">{p.local.nombre} <span className="text-azul-vivo">{p.golesLocal ?? '–'} : {p.golesVisitante ?? '–'}</span> {p.visitante.nombre}</DialogTitle>
      <DialogDescription>{fechaLarga(p)} · {p.cancha ?? 'Sin información'} · {p.fase || 'Sin información'} · {p.ronda}</DialogDescription>
      {grupos.map(([tipo, titulo]) => {
        const eventos = p.detalle?.eventos.filter((e) => e.tipo === tipo) ?? []
        return <section key={tipo} className="border-t border-border pt-4"><h3 className="font-display text-xl font-bold uppercase">{titulo}</h3>{eventos.length ? <ul className="mt-2 space-y-3">{eventos.map((e, i) => <li key={i} className="text-sm"><span className="mr-2 font-bold text-azul">{e.minuto === null ? 'Sin información' : `${e.minuto}′`}</span>{tipo === 'substitution' ? `Entra: ${e.entra ?? 'Sin información'} · Sale: ${e.sale ?? 'Sin información'}` : e.jugador ?? 'Sin información'}<span className="block text-xs text-muted-foreground">{e.equipo === p.local.id ? p.local.nombre : e.equipo === p.visitante.id ? p.visitante.nombre : 'Sin información'}</span></li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">Sin información</p>}</section>
      })}
      {p.detalle && <p className="text-xs text-muted-foreground">Datos actualizados el {new Date(p.detalle.actualizado).toLocaleDateString('es-UY', { timeZone: 'America/Montevideo' })}</p>}
    </DialogContent>
  </Dialog>
}
