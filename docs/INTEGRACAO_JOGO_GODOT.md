# Integração com o jogo Déia — canal oficial
Atualizado em 2026-11-03. Integração DOCUMENTAL, sem sincronização automática nem demo publicada por esta alteração.

## Repositórios e responsabilidades
- **Jogo Godot, scripts, cenas e testes:** https://github.com/JorgeNovoJulho/DeiaNoveReinos
- **Site oficial, notícias, cards, lore e demos homologadas:** https://github.com/JorgeNovoJulho/Deia-Site-Oficial
- **Portal publicado:** https://jorgenovojulho.github.io/Deia-Site-Oficial/
- Documentação recíproca: https://github.com/JorgeNovoJulho/DeiaNoveReinos/blob/main/docs/INTEGRACAO_SITE_OFICIAL.md (link ficará válido após integração do PR do jogo à main).

## Fonte e publicação: limites
`content/lore.json` e `BIBLIA_MESTRA_V6_3.md` são recursos narrativos do site. O jogo possui a sua Bíblia V3 e `AGENTS.md`, com preservação da lore aprovada. Não assumir equivalência: reconciliar por aprovação antes de espelhar alterações.
Imagens de `assets/img/` são material de apresentação; não presumir transparência, tamanho, animação, direitos de uso ou adequação à importação como sprite do Godot.
A pasta `demos/` só deve receber builds Web **exportadas do repositório do jogo**, testadas e autorizadas; não copiar o projeto-fonte inteiro ou dados privados.

## Procedimento para publicar uma demo
1. Receber de responsável pelo jogo: commit SHA, versão do Godot, versão da demo, inventário de arquivos de exportação, relatório de testes e aprovação.
2. Colocar exportação num novo diretório `demos/<versao>/` em branch de desenvolvimento do site.
3. Criar manifesto `demos/<versao>/build-info.json` com `game_repository`, `game_commit`, `godot_version`, `build_date`, `status`, `tested_on`, `release_notes` e `approved_by`. Não preencher dados não verificados.
4. Verificar links relativos, política de cache, compatibilidade do Godot Web com GitHub Pages, carregamento em desktop/mobile, entradas, áudio, memória e console.
5. Rodar os testes existentes do site (.github/workflows/verify-portal.yml) e conferir o link real da demo.
6. Abrir PR e exigir aprovação antes de mesclar para `main`. Atualizar diário de desenvolvimento só depois da implantação verificada.

## Publicação de notícias do desenvolvimento
O site pode publicar marcos, fotos, arte e descrições aprovadas. Todo marco deve indicar seu status: planejado, protótipo implementado, testado, aprovado, publicado. Informar link para commit/PR de origem quando aplicável. Nenhum anúncio de funcionalidade implementada deve depender apenas de um texto de narrativa.

## Verificações pendentes
- Não foi identificada integração automática entre os dois repositórios.
- A publicação de demonstrações Godot Web requer exportação e testes reais, ainda não efetuados nesta alteração.
- Não modificar domínio, DNS, branch de publicação ou `index.html` nesta etapa.
- Auditar diferenças entre versões da Bíblia antes de promover uma como oficial universal.
