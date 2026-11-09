import { SECCIONES } from './Encabezado'
import type { RespuestaDatos } from '@/lib/datos'
import { ESCUDO_PROPIO, imagen } from '@/lib/formato'
import { AvisoActualizacion } from './AvisoActualizacion'
import { INSTAGRAM_URL, INSTAGRAM_USUARIO, IconoInstagram } from './Instagram'

export function Pie({ datos }: { datos: RespuestaDatos }) {
  return (
    <footer className="bg-azul text-white">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <img src={imagen(ESCUDO_PROPIO, 128)} alt="" width={56} height={56} loading="lazy" className="size-14 rounded-full bg-white object-contain p-0.5" />
          <div>
            <p className="font-display text-2xl leading-none font-extrabold uppercase">Colegio San Isidro</p>
            <p className="mt-1 text-sm text-white/70">Liga Universitaria de Deportes · Montevideo, Uruguay</p>
          </div>
        </div>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-amarillo hover:underline">
          <IconoInstagram className="size-5" />@{INSTAGRAM_USUARIO}
        </a>
      </div>
      <nav aria-label="Todas las secciones" className="mx-auto flex max-w-content flex-wrap gap-x-6 gap-y-3 px-4 pb-8">{SECCIONES.map((s) => <a key={s.id} href={`#${s.id}`} className="text-sm hover:text-amarillo">{s.texto}</a>)}</nav>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-content flex-col gap-2 px-4 py-4 text-xs text-white/60 sm:px-6 md:flex-row md:justify-between">
          <AvisoActualizacion datos={datos} className="text-white/60" />
          <p>
            Datos:{' '}
            <a href="https://lud-stats.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              LUD Stats
            </a>{' '}
            (estadísticas no oficiales de la Liga).
          </p>
        </div>
      </div>
    </footer>
  )
}
