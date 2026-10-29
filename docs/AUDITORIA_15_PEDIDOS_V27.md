# Auditoria dos últimos 15 pedidos — Déia Site Oficial (V27)

Esta auditoria compara os pedidos recentes do usuário com **o código encontrado no GitHub**, e distingue arquivos presentes de recursos realmente testados. Não considerar imagens antigas como "novas artes publicadas".

| Nº | Pedido recorrente | Situação verificada no código | Conclusão |
|---|---|---|---|
| 1 | Fidelidade ao layout final aprovado | CSS V21/V26 e aprimoramentos, mas sem comparação exata dos screenshots em cada breakpoint | **Pendente de aprovação visual** |
| 2 | Cards e seções com alturas proporcionais | Regras de grid V21/V23 existentes | **Parcial; requer aferição visual** |
| 3 | Molduras douradas, transparências, efeitos e transições | Implementadas nas folhas V20/V21/V26, agora compiladas em V27 | **Presente; estética depende de comparação** |
| 4 | Menu expansível no celular e acesso administrador | `portal-v7.js`, `admin/` e links no menu | **Implementado; teste de navegação** |
| 5 | Imagens oficiais dos nove reinos | Arquivos `reino-0` a `reino-8` referenciados | **Presente** |
| 6 | Zoom real dos reinos e tela centralizada | `realm-viewer-v18.js`, zoom com dimensões reais | **Implementado/testado** |
| 7 | Música exploração/boss no modal dos reinos, fechar interrompe | Seletor integrado a `music-catalog.json` | **Implementado apenas para faixas disponíveis** |
| 8 | Personagens: carrossel de todas as imagens | `codex-v82.js` possui seleção de artes conhecidas | **Parcial: novos arquivos não estão todos no repositório** |
| 9 | Música tema/batalha nos modais de personagens | Controles adicionados em V24 | **Presente; faltam faixas individuais no catálogo** |
| 10 | Retrato individual consistente de Vael'Zhar e Vaelor | Arquivos distintos `vaelzhar-aprovado.webp` e `vaelor-aprovado.webp` | **Arquivos existentes; novas pranchas solicitadas não estão integralmente incorporadas** |
| 11 | Música com miniatura e player premium na home e catálogo | Players V25/V26 com capa, progresso, volume, efeitos e artes oficiais | **Implementado; aprovado no código, estética não homologada** |
| 12 | Músicas novas em primeiro lugar | `published_at` nas novas publicações; legado sem data usa ordem de fallback | **Parcial para músicas históricas** |
| 13 | Admin: upload/editar/pausar/excluir por card de música | `admin/admin.js` e editor por card | **Implementado; testes autenticados ainda pendentes** |
| 14 | Capas individuais editáveis no administrador | Campo `musicCover` e validação de arquivo criado na V27 | **Implementado nesta rodada; uso autenticado pendente** |
| 15 | Vídeo na home, tela cheia e configuração admin | `video-feature-v24.js`, `content/video-feature.json`, admin | **Player pronto, vídeo oficial não enviado (src null)** |

## Alterações V27
- Editor de capa individual por música e verificação de caminho de imagem no GitHub.
- Ajuste no teste automatizado para exigir o campo de capa.
- Compilação das 12 folhas CSS publicadas em uma só, `assets/portal-compiled-v27.css`, preservando precedência, fontes e originais para rollback.

## Pendências reais que não podem ser chamadas concluídas
1. Incorporar as novas artes dos personagens, usando arquivos oficiais individuais e aprovação estética; a existência de retrato antigo não cobre o pedido de arte nova.
2. Conteúdo de vídeo oficial: nenhum arquivo configurado atualmente, não inventar vídeo.
3. Faixas tema e batalha ausentes; não simular reprodução.
4. Homologação visual de fidelidade à referência de layout aprovada, em desktop/tablet/celular, com screenshots lado a lado.
5. Teste autenticado de gravações/remoções no painel, por segurança não usar token do usuário em automações públicas.
6. Migração de lore confidencial de repositório público para destino privado: envolve decisão explícita de conteúdo e histórico Git.

**Regra de continuidade:** nunca relatar apenas "GitHub recebeu commit" como comprovação visual. Requer testes Chromium e comparação com o layout desejado.
