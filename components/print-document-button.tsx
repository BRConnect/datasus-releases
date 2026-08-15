/**
 * Direção visual: Arquivo de Serviço Público — ação utilitária, direta e compatível com impressão do navegador.
 */
"use client";

export function PrintDocumentButton() {
  return (
    <button type="button" className="legal-print-button" onClick={() => window.print()}>
      Imprimir documento
    </button>
  );
}
