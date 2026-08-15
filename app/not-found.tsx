/**
 * Direção visual: Arquivo de Serviço Público — o estado ausente mantém o tom de catálogo e uma rota de retorno clara.
 */
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f3eb] px-6 text-[#1c2724]">
      <section className="max-w-md border-l-2 border-[#c86b42] pl-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#c86b42]">Registro não localizado · 404</p>
        <h1 className="mt-3 font-display text-5xl tracking-[-0.05em]">Esta ficha não está no acervo.</h1>
        <p className="mt-5 text-sm leading-6 text-[#5b655f]">O endereço consultado não corresponde a uma página disponível neste catálogo.</p>
        <Link href="/" className="mt-7 inline-flex bg-[#0a5b4a] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#074b3d]">Voltar ao catálogo</Link>
      </section>
    </main>
  );
}
