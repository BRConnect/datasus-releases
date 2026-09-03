# Fontes oficiais verificadas

Consulta realizada em 15 de agosto de 2026 (GMT-3).

| Fonte | Resultado atual identificado | Uso previsto |
| --- | --- | --- |
| `http://sihd.datasus.gov.br/versao/versao_sisaih01.php` | Competência **07/2026**, versões **25.10** e **25.11** do SISAIH01. A página expõe links FTP para os executáveis. | Coletar a competência e todos os instaladores da competência mais recente. |
| `https://sia.datasus.gov.br/versao/listar_ftp_bpa.php` | **BPAMAG0500.exe**, publicado em **09-Jul-2026**, **7,4 MB**. | Coletar a versão BPA mais recente e seus metadados. |
| `https://sia.datasus.gov.br/versao/listar_ftp_sia.php` | **BDSIA202607b.exe**, publicado em **13-Aug-2026**, **9,3 MB**. A página também traz o instalador do sistema **SIA0601.exe**, publicado em 14-Aug-2026. | Coletar o banco mensal SIA mais recente por padrão; manter a regra extensível para incluir o instalador principal posteriormente. |
| `https://ciha.saude.gov.br/versao/versao_ciha1.php` | **CIHA01_VER2033.exe**, versão **20.33**, com **3.667.172 bytes**. | Coletar a versão atual do instalador CIHA01 e republicá-la em release HTTPS. |
| `http://sigtap.datasus.gov.br/tabela-unificada/app/download.jsp` + RSS `http://sigtap.datasus.gov.br/tabela-unificada/competencias.rss` | **TabelaUnificada_202608_v2608141139.zip**, competência **08/2026**, com **2.153.883 bytes**. | Consultar o RSS oficial, selecionar a maior competência, tentar o download FTP cinco vezes e preservar o manifesto anterior se o serviço permanecer indisponível. |

## Premissas de atualização

1. As páginas oficiais são a fonte de verdade dos nomes, versões, datas, tamanhos e links.
2. O sincronizador deve preservar todos os arquivos de uma mesma competência atual, pois o SISAIH01 pode oferecer mais de uma versão para a competência mais recente.
3. O sincronizador deve ignorar materiais auxiliares, como arquivos `LEIAME`, PDFs e layouts, exceto se a regra de coleta for expandida posteriormente.
4. Cada item publicado deve reter a URL de origem para auditoria no catálogo.
5. Para o SIA, a identificação de “mais recente” deve priorizar o padrão `BDSIAAAAAMMb.exe`, ordenando ano, mês e sufixo alfabético, em vez de depender apenas da data de alteração apresentada pela página.
6. Para o SIGTAP, o RSS de competências é consultado antes da página visual, pois contém o link direto do ZIP e continua sendo útil quando a página de downloads retorna indisponibilidade; o FTP recebe tentativas independentes com espera progressiva.

## Endereços de referência observados

| Arquivo | Endereço de origem exposto pelo portal |
| --- | --- |
| `BPAMAG0500.exe` | `ftp://arpoador.datasus.gov.br/siasus/BPA/BPAMAG0500.exe` |
| `BDSIA202607b.exe` | `ftp://arpoador.datasus.gov.br/siasus/sia/BDSIA202607b.exe` |
| `sisaih01_ver2511.exe` | `ftp://ftp2.datasus.gov.br/public/sistemas/dsweb/SIHD/Programas/sisaih01_ver2511.exe` |
| `CIHA01_VER2033.exe` | `ftp://ftp2.datasus.gov.br/public/sistemas/dsweb/SIHD/CIHA/Programas/CIHA01_VER2033.exe` |
| `TabelaUnificada_202608_v2608141139.zip` | `ftp://ftp2.datasus.gov.br/pub/sistemas/tup/downloads/TabelaUnificada_202608_v2608141139.zip` |
