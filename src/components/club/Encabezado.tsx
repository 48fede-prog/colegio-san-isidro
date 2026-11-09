import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ESCUDO_PROPIO, imagen } from '@/lib/formato'
import { INSTAGRAM_URL, INSTAGRAM_USUARIO, IconoInstagram } from './Instagram'

export const SECCIONES = [
  { id: 'inicio', texto: 'Inicio' },
  { id: 'proximo', texto: 'Próximo partido' },
  { id: 'resultados', texto: 'Resultados' },
  { id: 'fixture', texto: 'Fixture' },
  { id: 'tabla', texto: 'Tabla de posiciones' },
  { id: 'plantel', texto: 'Plantel y estadísticas' },
  { id: 'tecnicos', texto: 'Directores técnicos' },
  { id: 'club', texto: 'El club' },
  { id: 'instagram', texto: 'Instagram' },
  { id: 'contacto', texto: 'Contacto' },
]

export function Marca() {
  return (
    <a href="#inicio" className="flex min-w-0 items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
      <img
        src={imagen(ESCUDO_PROPIO, 112)}
        alt="Escudo de Colegio San Isidro"
        width={48}
        height={48}
        className="size-12 shrink-0 object-contain"
      />
      <span className="min-w-0 leading-none">
        <span className="block truncate font-display text-[1.65rem] font-extrabold tracking-tight text-azul uppercase">
          San Isidro
        </span>
        <span className="mt-0.5 block font-display text-sm font-bold tracking-[0.32em] text-azul-vivo uppercase">
          Universitario
        </span>
      </span>
    </a>
  )
}

export function Encabezado() {
  return (
    <>
      <div className="bg-azul text-white">
        <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-2 text-xs font-semibold tracking-wide sm:px-6 sm:text-sm">
          <span>Liga Universitaria de Deportes</span>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-amarillo hover:underline"
          >
            <IconoInstagram />@{INSTAGRAM_USUARIO}
          </a>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto flex h-[4.5rem] max-w-content items-center justify-between gap-4 px-4 sm:px-6">
          <Marca />
          <nav aria-label="Secciones" className="hidden lg:block">
            <ul className="flex gap-1">
              {SECCIONES.filter((s) => ['resultados', 'fixture', 'tabla', 'plantel', 'club'].includes(s.id)).map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="rounded-md px-3 py-2 text-sm font-semibold text-azul hover:bg-azul-claro">
                    {s.texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Sheet>
            <SheetTrigger
              className="inline-flex size-12 items-center justify-center rounded-lg bg-azul-claro text-azul focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="size-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[82vw] max-w-sm bg-azul text-white">
              <SheetHeader>
                <SheetTitle className="font-display text-3xl font-extrabold text-white uppercase">Menú</SheetTitle>
                <SheetDescription className="text-white/70">Colegio San Isidro · LUD</SheetDescription>
              </SheetHeader>
              <nav aria-label="Secciones" className="px-4">
                <ul className="flex flex-col">
                  {SECCIONES.map((s) => (
                    <li key={s.id}>
                      <SheetClose asChild>
                        <a
                          href={`#${s.id}`}
                          className="block border-b border-white/10 py-3.5 font-display text-2xl font-bold tracking-wide uppercase hover:text-amarillo"
                        >
                          {s.texto}
                        </a>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  )
}
