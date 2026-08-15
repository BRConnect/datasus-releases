/**
 * Direção visual: Arquivo de Serviço Público — linguagem objetiva, blocos editoriais e condições de uso auditáveis.
 */
import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Condições de uso do catálogo público DATASUS Releases.",
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
      <p className="legal-lead">Estes Termos de Uso regulam o acesso ao <strong>DATASUS Releases</strong>, catálogo independente que reúne referências e links HTTPS para versões publicadas dos programas SISAIH01, BPA e SIA.</p>

      <section id="objeto">
        <h2>1. Objeto do serviço</h2>
        <p>O DATASUS Releases facilita a consulta às versões identificadas nos portais oficiais do DATASUS. A automação do projeto verifica as fontes descritas no catálogo e, quando encontra uma versão compatível, publica uma cópia em uma release pública do GitHub para viabilizar o download por HTTPS.</p>
        <p>O projeto é independente e informativo. Ele não representa, não substitui e não mantém vínculo institucional com o Ministério da Saúde, DATASUS ou demais órgãos mencionados.</p>
      </section>

      <section id="uso">
        <h2>2. Uso permitido</h2>
        <p>Você pode consultar, baixar e compartilhar os links oferecidos pelo catálogo para fins legítimos, respeitando as normas aplicáveis, a documentação dos sistemas e os direitos dos respectivos titulares. Antes de instalar um arquivo, confirme o nome, a versão, a data e a origem indicados na ficha da release.</p>
        <p>É vedado utilizar o site para interferir em sua operação, contornar controles de segurança, distribuir arquivos modificados como se fossem oficiais ou empregar o conteúdo em atividade ilícita.</p>
      </section>

      <section id="fontes">
        <h2>3. Fontes e downloads</h2>
        <p>As páginas de origem são apresentadas em cada registro para possibilitar auditoria. Os arquivos disponibilizados por este projeto são cópias de instaladores encontrados nessas fontes; a decisão de usar, executar ou distribuir um programa permanece sob responsabilidade de quem o baixa.</p>
        <p>O catálogo busca reduzir atritos de compatibilidade com FTP em navegadores modernos, mas não garante que toda versão existente esteja disponível, que uma fonte externa permaneça acessível ou que um instalador seja adequado ao seu ambiente.</p>
      </section>

      <section id="disponibilidade">
        <h2>4. Disponibilidade e atualização</h2>
        <p>A consulta automatizada está programada para ocorrer diariamente. O funcionamento pode ser temporariamente afetado por indisponibilidade das fontes, do GitHub, da infraestrutura de hospedagem, por atualizações de segurança ou por manutenção do projeto.</p>
        <p>As informações são oferecidas no estado em que se encontram, sem promessa de continuidade ininterrupta ou de adequação a uma finalidade específica. Para processos críticos, confira sempre a fonte oficial antes de prosseguir.</p>
      </section>

      <section id="propriedade">
        <h2>5. Propriedade intelectual</h2>
        <p>O código-fonte do DATASUS Releases é disponibilizado sob a licença Apache-2.0, conforme o arquivo <a href="https://github.com/BRConnect/datasus-releases/blob/main/LICENSE" target="_blank" rel="noreferrer">LICENSE</a> do repositório. Marcas, nomes de sistemas, programas e conteúdos de fontes externas pertencem aos respectivos titulares e permanecem sujeitos às suas próprias condições.</p>
      </section>

      <section id="alteracoes">
        <h2>6. Alterações destes termos</h2>
        <p>Estes termos podem ser atualizados para refletir mudanças no serviço, nas fontes monitoradas, na infraestrutura ou na legislação aplicável. A data de atualização exibida no início da página indica a versão vigente; a continuidade de uso após a publicação da alteração representa ciência do novo texto.</p>
      </section>

      <section id="contato">
        <h2>7. Contato</h2>
        <p>Para relatar um link incorreto, uma questão sobre o conteúdo ou uma solicitação relacionada a estes Termos, utilize as <a href="https://github.com/BRConnect/datasus-releases/issues" target="_blank" rel="noreferrer">Issues do repositório no GitHub</a>. Não envie senhas, tokens, dados de pacientes ou outras informações sensíveis nesse canal público.</p>
      </section>
    </LegalShell>
  );
}
