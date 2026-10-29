# Auditoria de correspondência entre pedidos e código — V24

Data: 29/10/2026. Escopo exclusivo: repositório público `JorgeNovoJulho/Deia-Site-Oficial`.

| Requisito solicitado | Encontrado antes da V24 | Corrigido nesta rodada | Observação/limite |
|---|---|---|---|
| Banner V13 com links | Sim | Preservado | Comparação visual com mockup não homologada |
| Grade de mundos e retratos responsiva | Sim, V21/V23 | Preservada | Não promete equivalência exata em pixels |
| Zoom de imagens de reinos | Sim, V18.4 | Preservado | Teste real por Playwright |
| Exploração/boss no modal dos reinos | Sim, V18.3 | Preservado | Dependente de músicas existentes |
| Player público de músicas | Sim | Ordenação por `published_at` incluída | Registros antigos não têm datas históricas confiáveis |
| Editor musical por card no painel | Sim | Armazena `published_at` quando salvo | Autenticação exige token GitHub com permissão |
| Player de vídeo na seção de testes | NÃO, era só imagem | SIM, `assets/video-feature-v24.js` | Sem vídeo oficial, mostra aviso correto |
| Alterar vídeo pelo painel | NÃO | SIM, aba `Vídeo em destaque` | MP4/WebM até 18 MB via Contents API |
| Modal de personagem com carrossel | NÃO | SIM, imagens oficiais já cadastradas | Nem todas as artes novas anteriores foram enviadas ao repositório |
| Música tema/batalha dos personagens no modal | NÃO | SIM, seletor baseado no catálogo | Só toca faixa realmente publicada; atualmente poucas têm áudio |
| Galeria pública com zoom | Sim | Preservada | Imagens WebP existentes |
| Imagens de personagens aprovadas | Algumas existentes | Não substituídas | Retratos gerados fora do GitHub precisam ser homologados e publicados |
| Administrador no menu | Sim | Preservado | Rota do admin é pública, escrita requer GitHub |
| Layout final idêntico à referência | NÃO comprovado | NÃO | Depende de comparação estética visual |
| Testes em navegador público | Sim, workflows | Ampliados na V24 | Verificar status do workflow associado ao commit |

## Segurança / conteúdo

- Não publicar lore interna ou spoilers em novos conteúdos públicos.
- Não guardar token de acesso no site público.
- Recursos não publicados devem ter mensagens claras; não simular vídeo ou música existente.
- Antes de afirmar conclusão, verificar GitHub Pages e o teste Playwright.

## Arquivos V24

`assets/video-feature-v24.js`, `assets/video-feature-v24.css`, `content/video-feature.json`, `admin/index.html`, `admin/admin.js`, `assets/music-catalog.js`, `assets/codex-v82.js`, `assets/character-media-v24.css`, `index.html`, `tests/portal-smoke.cjs`.
