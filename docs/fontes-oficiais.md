# Fontes oficiais verificadas

Consulta realizada em 15 de agosto de 2026 (GMT-3).

| Fonte | Resultado atual identificado | Uso previsto |
| --- | --- | --- |
| `http://sihd.datasus.gov.br/versao/versao_sisaih01.php` | Competência **07/2026**, versões **25.10** e **25.11** do SISAIH01. A página expõe links FTP para os executáveis. | Coletar a competência e todos os instaladores da competência mais recente. |
| `https://sia.datasus.gov.br/versao/listar_ftp_bpa.php` | **BPAMAG0500.exe**, publicado em **09-Jul-2026**, **7,4 MB**. | Coletar a versão BPA mais recente e seus metadados. |
| `https://sia.datasus.gov.br/versao/listar_ftp_sia.php` | **BDSIA202607b.exe**, publicado em **13-Aug-2026**, **9,3 MB**. A página também traz o instalador do sistema **SIA0601.exe**, publicado em 14-Aug-2026. | Coletar o banco mensal SIA mais recente por padrão; manter a regra extensível para incluir o instalador principal posteriormente. |

## Premissas de atualização

1. As páginas oficiais são a fonte de verdade dos nomes, versões, datas, tamanhos e links.
2. O sincronizador deve preservar todos os arquivos de uma mesma competência atual, pois o SISAIH01 pode oferecer mais de uma versão para a competência mais recente.
3. O sincronizador deve ignorar materiais auxiliares, como arquivos `LEIAME`, PDFs e layouts, exceto se a regra de coleta for expandida posteriormente.
4. Cada item publicado deve reter a URL de origem para auditoria no catálogo.
5. Para o SIA, a identificação de “mais recente” deve priorizar o padrão `BDSIAAAAAMMb.exe`, ordenando ano, mês e sufixo alfabético, em vez de depender apenas da data de alteração apresentada pela página.

## Endereços de referência observados

| Arquivo | Endereço de origem exposto pelo portal |
| --- | --- |
| `BPAMAG0500.exe` | `ftp://arpoador.datasus.gov.br/siasus/BPA/BPAMAG0500.exe` |
| `BDSIA202607b.exe` | `ftp://arpoador.datasus.gov.br/siasus/sia/BDSIA202607b.exe` |
| `sisaih01_ver2511.exe` | `ftp://ftp2.datasus.gov.br/public/sistemas/dsweb/SIHD/Programas/sisaih01_ver2511.exe` |
