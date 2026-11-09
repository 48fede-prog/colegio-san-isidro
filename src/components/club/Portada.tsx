import type { Categoria } from '@/lib/datos'
const foto = (w: number) => `/.netlify/images?url=/img/portada.png&w=${w}&fm=webp&q=75`
export function Portada({ categorias }: { categorias: Categoria[] }) {
  return <section id="inicio" className="portada-csi relative isolate flex min-h-svh items-end overflow-hidden bg-azul text-white">
    <img src={foto(1600)} srcSet={`${foto(640)} 640w, ${foto(1200)} 1200w, ${foto(1920)} 1920w`} sizes="100vw" alt="El plantel de San Isidro reunido antes de salir a la cancha" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_55%]" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-azul via-azul/30 to-azul/10" />
    <div className="mx-auto w-full max-w-content px-5 pt-32 pb-16 sm:px-8 lg:pb-20">
      <p className="mb-6 flex items-center gap-3 text-xs font-bold tracking-[.24em] uppercase"><span className="h-0.5 w-12 bg-amarillo" /> Colegio San Isidro · Desde 2023</p>
      <h1 className="max-w-4xl font-display text-[clamp(4.5rem,12vw,10rem)] leading-[.83] font-extrabold tracking-tight uppercase">La actitud<br />no se <span className="text-amarillo">negocia.</span></h1>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-white/35 pt-6">
        <p className="max-w-xs text-base text-white/85">Dos categorías. Una misma camiseta.<br />Fútbol de Liga Universitaria, Uruguay.</p>
        <a href="#fixture" className="border-b-2 border-amarillo pb-2 font-display text-xl font-bold tracking-wider uppercase">Mirá el fixture ↗</a>
      </div>
      <p className="mt-6 text-xs tracking-wider text-white/65">{categorias.map((c) => `${c.nombre} · ${c.temporada}`).join(' / ')}</p>
    </div>
  </section>
}
