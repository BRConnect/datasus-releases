/**
 * Direção visual: Arquivo de Serviço Público — linguagem objetiva, blocos editoriais e condições de uso auditáveis.
 */
import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de uso do catálogo independente DATASUS Releases, suas fontes oficiais, cópias em GitHub Releases e downloads HTTPS.",
  alternates: { canonical: "/termos" },
};

const sections = [
  { id: "objeto", label: "1. Objeto do serviço" },
  { id: "uso", label: "2. Uso permitido" },
  { id: "fontes", label: "3. Fontes e downloads" },
  { id: "disponibilidade", label: "4. Disponibilidade" },
  { id: "propriedade", label: "5. Propriedade intelectual" },
  { id: "alteracoes", label: "6. Alterações" },
  { id: "contato", label: "7. Contato" },
];

export default function TermsPage() {
  return (
    <LegalShell
      active="termos"
      eyebrow="Documento público"
      title="Termos de Uso"
      summary="Regras claras para consultar o acervo, conferir as fontes e utilizar os arquivos disponibilizados pelo projeto."
      sections={sections}
    >
      <p className="legal-lead">Estes Termos de Uso regulam o acesso ao <strong>DATASUS Releases</strong>, catálogo técnico independente que organiza referências, versões e links HTTPS para arquivos relacionados aos sistemas SISAIH01, BPA, SIA, CIHA01 e à tabela SIGTAP.</p>

      <section id="objeto">
        <h2>1. Objeto do serviço</h2>
        <p>O DATASUS Releases facilita a consulta às versões identificadas nos portais oficiais do DATASUS. A automação consulta páginas, feeds de competência e endereços de transferência das fontes monitoradas, identifica os arquivos que atendem às regras do catálogo e, quando possível, publica uma cópia em uma GitHub Release para viabilizar o download por HTTPS.</p>
        <p>O projeto é independente e informativo. Ele não representa, não substitui e não mantém vínculo institucional com o Ministério da Saúde, DATASUS ou demais órgãos mencionados.</p>
      </section>

      <section id="uso">
        <h2>2. Uso permitido</h2>
        <p>Você pode consultar, baixar e compartilhar os links oferecidos pelo catálogo para fins legítimos, respeitando as normas aplicáveis, a documentação dos sistemas e os direitos dos respectivos titulares. Antes de instalar ou importar um arquivo, confirme o nome, a versão, a competência, o tamanho, o checksum quando disponível e a origem indicados na ficha da release.</p>
        <p>É vedado utilizar o site para interferir em sua operação, contornar controles de segurança, distribuir arquivos modificados como se fossem oficiais ou empregar o conteúdo em atividade ilícita.</p>
      </section>

      <section id="fontes">
        <h2>3. Fontes e downloads</h2>
        <p>As páginas e endereços de origem são apresentados em cada registro para possibilitar auditoria. Os arquivos disponibilizados por este projeto são cópias obtidas das fontes monitoradas e republicadas em GitHub Releases; essa republicação não transforma o projeto em órgão oficial, não constitui endosso do fabricante ou órgão de origem e não altera os direitos dos respectivos titulares.</p>
        <p>O catálogo busca reduzir atritos de compatibilidade com FTP em navegadores modernos, mas não garante que toda versão existente esteja disponível, que uma fonte externa permaneça acessível, que o arquivo original continue inalterado em sua origem ou que um instalador seja adequado ao seu ambiente.</p>
      </section>

      <section id="disponibilidade">
        <h2>4. Disponibilidade e atualização</h2>
        <p>A consulta automatizada está programada para ocorrer diariamente, normalmente no ciclo de atualização indicado na home. Fontes instáveis, como portais que dependem de FTP ou páginas de download intermitentes, recebem novas tentativas e podem manter o último manifesto válido até que uma consulta confiável seja concluída. O funcionamento também pode ser afetado por indisponibilidade das fontes, do GitHub, da Vercel, da rede ou por manutenção do projeto.</p>
        <p>As informações são oferecidas no estado em que se encontram, sem promessa de continuidade ininterrupta ou de adequação a uma finalidade específica. Para processos críticos, confira sempre a fonte oficial antes de prosseguir.</p>
      </section>

      <section id="propriedade">
        <h2>5. Propriedade intelectual</h2>
        <p>O código-fonte do DATASUS Releases é disponibilizado sob a licença Apache-2.0, conforme o arquivo <a href="https://github.com/BRConnect/datasus-releases/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">LICENSE</a> do repositório. Marcas, nomes de sistemas, programas, tabelas e conteúdos de fontes externas pertencem aos respectivos titulares e permanecem sujeitos às suas próprias condições. Os assets publicados em GitHub Releases são cópias de arquivos de origem e não devem ser apresentados como uma distribuição institucional do Ministério da Saúde ou do DATASUS.</p>
      </section>

      <section id="alteracoes">
        <h2>6. Alterações destes termos</h2>
        <p>Estes termos podem ser atualizados para refletir mudanças no serviço, nas fontes monitoradas, na infraestrutura, nos recursos de medição ou na legislação aplicável. A data de atualização exibida no início da página indica a versão vigente. Alterações relevantes serão registradas no repositório e passam a valer após sua publicação nesta página.</p>
      </section>

      <section id="contato">
        <h2>7. Contato</h2>
        <p>Para relatar um link incorreto, uma questão sobre o conteúdo ou uma solicitação relacionada a estes Termos, utilize as <a href="https://github.com/BRConnect/datasus-releases/issues" target="_blank" rel="noopener noreferrer">Issues do repositório no GitHub</a>. Não envie senhas, tokens, dados de pacientes ou outras informações sensíveis nesse canal público.</p>
      </section>
    </LegalShell>
  );
}
