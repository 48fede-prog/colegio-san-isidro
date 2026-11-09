import { useState } from 'react'
import { Seccion } from './Seccion'
import { INSTAGRAM_URL } from './Instagram'
export function Institucion() {
  const [sinFoto, setSinFoto] = useState(false)
  return <>
    <Seccion id="tecnicos" antetitulo="Los que marcan el rumbo" titulo="Directores técnicos" className="bg-azul-claro">
      <div className="grid gap-0 border-t-2 border-azul md:grid-cols-2">{[['Primera · Mayores', 'Fabrizio Borsani'], ['Sub-20', 'Martín Guigou']].map(([categoria, nombre], i) => <article key={nombre} className="border-b border-azul/25 py-8 md:pr-10"><p className="mb-3 text-xs font-bold tracking-widest text-azul-vivo uppercase">0{i + 1} / {categoria}</p><h3 className="font-display text-4xl font-bold text-azul uppercase">{nombre}</h3><p className="mt-2 text-sm text-muted-foreground">Director técnico</p></article>)}</div>
    </Seccion>
    <Seccion id="club" antetitulo="Nuestra historia recién empieza" titulo="El club" className="club-institucion">
      <div className="grid items-start gap-10 md:grid-cols-[1.1fr_1fr]">
        <div><p className="font-display text-5xl font-bold text-azul uppercase">Colegio<br />San Isidro<span className="text-amarillo">.</span></p><p className="mt-6 max-w-md text-lg">Desde 2023, compartimos camiseta en la Liga Universitaria de Deportes de Uruguay.</p></div>
        <dl className="divide-y divide-border border-y border-border">{[['Fundación', '2023'], ['Categorías', 'Sub 20 y Mayores'], ['Sub 20', 'Liga Universitaria · Divisional C'], ['Mayores', 'Liga Universitaria · Divisional G, recién ascendidos a F']].map(([titulo, valor]) => <div key={titulo} className="grid grid-cols-[100px_1fr] gap-4 py-4"><dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{titulo}</dt><dd className="font-semibold text-azul">{valor}</dd></div>)}</dl>
      </div>
    </Seccion>
    <Seccion id="instagram" antetitulo="La vida del equipo, afuera de la cancha" titulo="Seguinos en Instagram" className="bg-azul-claro">
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden bg-azul text-white">
        {!sinFoto && <img src="/.netlify/images?url=/img/instagram.jpg&w=1200&fm=webp" onError={() => setSinFoto(true)} alt="San Isidro en Instagram" loading="lazy" className="max-h-[520px] w-full object-cover" />}
        {sinFoto && <img src="/.netlify/images?url=/img/escudo.png&w=240&fm=webp" alt="Escudo de Colegio San Isidro" loading="lazy" className="mx-auto h-56 w-56 object-contain p-10" />}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/20 px-5 py-6"><span className="font-display text-2xl font-bold sm:text-4xl">@san_isidro_universitario</span><span className="text-xl transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span></div>
      </a>
    </Seccion>
  </>
}
