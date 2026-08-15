/**
 * Direção visual: Arquivo de Serviço Público — transparência operacional, linguagem direta e dados organizados para leitura e impressão.
 */
import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como o DATASUS Releases trata dados técnicos e métricas agregadas de acesso.",
  alternates: { canonical: "/privacidade" },
};

const sections = [
  { id: "responsavel", label: "1. Responsável" },
  { id: "dados", label: "2. Dados e finalidades" },
  { id: "medicao", label: "3. Métricas anônimas" },
  { id: "compartilhamento", label: "4. Serviços de terceiros" },
  { id: "direitos", label: "5. Seus direitos" },
  { id: "seguranca", label: "6. Segurança e alterações" },
  { id: "referencias", label: "7. Referências" },
];

export default function PrivacyPage() {
  return (
    <LegalShell
      active="privacidade"
      eyebrow="Transparência de dados"
      title="Política de Privacidade"
      summary="Explicação objetiva sobre dados técnicos, métricas anônimas e os canais para exercer direitos relacionados à privacidade."
      sections={sections}
    >
      <p className="legal-lead">Esta política descreve o tratamento de informações no DATASUS Releases. O site não possui cadastro, área logada, formulário de contato nem coleta intencional de dados de saúde, dados de pacientes ou credenciais.</p>

      <section id="responsavel">
        <h2>1. Responsável pelo site</h2>
        <p>O responsável pelo projeto é <strong>Lucas Camargo Stivan</strong>. Para dúvidas, solicitações de privacidade ou relato de conteúdo inadequado, utilize as <a href="https://github.com/BRConnect/datasus-releases/issues" target="_blank" rel="noreferrer">Issues públicas do repositório</a>. Não inclua dados pessoais, credenciais ou dados de saúde nesse canal.</p>
      </section>

      <section id="dados">
        <h2>2. Dados tratados e finalidades</h2>
        <div className="legal-table-wrap" role="region" aria-label="Dados tratados e finalidades" tabIndex={0}>
          <table className="legal-data-table">
            <thead><tr><th scope="col">Categoria</th><th scope="col">Exemplos</th><th scope="col">Finalidade</th></tr></thead>
            <tbody>
              <tr><th scope="row">Preferência local</th><td>Tema claro ou escuro</td><td>Manter a aparência escolhida no seu próprio navegador. Essa preferência é armazenada localmente e não é enviada pelo código do site.</td></tr>
              <tr><th scope="row">Métricas agregadas</th><td>Página acessada, referenciador, tipo de dispositivo, navegador e localização aproximada</td><td>Entender o uso geral do catálogo, priorizar melhorias e detectar problemas de navegação.</td></tr>
              <tr><th scope="row">Desempenho</th><td>Web Vitals, rota/URL, tipo de rede, navegador, dispositivo e país</td><td>Medir a experiência real de carregamento e corrigir gargalos técnicos.</td></tr>
            </tbody>
          </table>
        </div>
        <p>O site não solicita nome, e-mail, CPF, dados de saúde ou informações financeiras. Evite incluir dados pessoais nas URLs e nos canais públicos vinculados ao projeto.</p>
      </section>

      <section id="medicao">
        <h2>3. Web Analytics e Speed Insights</h2>
        <p>Quando ativados na Vercel, o Web Analytics e o Speed Insights registram pontos de dados para estatísticas agregadas e desempenho. Segundo a documentação da Vercel, essas ferramentas foram desenhadas para registrar dados anônimos, sem reconstruir sessões de navegação nem identificar uma pessoa ou endereço IP. O Web Analytics não utiliza cookies de terceiros; seu identificador de sessão é descartado após 24 horas.</p>
        <p>Esses recursos usam scripts de medição da Vercel. Eles não são empregados pelo projeto para criar perfis individualizados, realizar publicidade comportamental ou rastrear pessoas entre sites.</p>
      </section>

      <section id="compartilhamento">
        <h2>4. Serviços de terceiros e links externos</h2>
        <p>A hospedagem e as métricas são operadas pela Vercel. O catálogo também consulta a API pública do GitHub para listar releases e direciona você a páginas do GitHub e dos portais oficiais do DATASUS. Cada serviço externo possui sua própria política, práticas de segurança e possível processamento internacional de dados.</p>
        <p>O DATASUS Releases não vende dados pessoais nem compartilha deliberadamente dados para publicidade. Informações técnicas necessárias à entrega do site podem ser tratadas pelos provedores de infraestrutura conforme suas políticas e configurações aplicáveis.</p>
      </section>

      <section id="direitos">
        <h2>5. Seus direitos</h2>
        <p>Nos termos da Lei Geral de Proteção de Dados (LGPD), titulares podem solicitar confirmação de tratamento, acesso, correção, anonimização, bloqueio, eliminação, portabilidade quando aplicável, informação sobre compartilhamentos e revogação de consentimento. Como o projeto foi estruturado para não manter uma base de usuários identificáveis, algumas solicitações podem não ser tecnicamente aplicáveis.</p>
        <p>Para encaminhar uma solicitação, abra uma Issue sem publicar informações sensíveis e indique que se trata de assunto de privacidade. Caso a solicitação envolva dados tratados diretamente por um provedor, como Vercel ou GitHub, ele poderá orientar você a usar seus próprios canais de atendimento.</p>
      </section>

      <section id="seguranca">
        <h2>6. Segurança, retenção e alterações</h2>
        <p>O projeto emprega HTTPS, dependências atualizadas e acesso público apenas ao conteúdo necessário ao catálogo. Nenhuma medida elimina todos os riscos de segurança; mantenha seu navegador atualizado e confirme os arquivos antes de executá-los.</p>
        <p>Os dados de medição seguem os prazos e as configurações dos provedores responsáveis. Esta política pode mudar para refletir alterações técnicas, legais ou operacionais. A data exibida no início da página indica a versão vigente.</p>
      </section>

      <section id="referencias">
        <h2>7. Referências</h2>
        <ol className="legal-references">
          <li><a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noreferrer">Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (LGPD)</a>.</li>
          <li><a href="https://www.gov.br/mec/pt-br/acesso-a-informacao/lgpd/direitos-titulares-dados" target="_blank" rel="noreferrer">Direitos dos Titulares de Dados Pessoais — Gov.br</a>.</li>
          <li><a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer">Vercel Web Analytics — Privacy and Compliance</a>.</li>
          <li><a href="https://vercel.com/docs/speed-insights/privacy-policy" target="_blank" rel="noreferrer">Vercel Speed Insights — Privacy &amp; Compliance</a>.</li>
        </ol>
      </section>
    </LegalShell>
  );
}
