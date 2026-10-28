# Déia — Portal para superstarcreator.online

## O que está pronto
Site estático responsivo com HTML e CSS, imagens webp otimizadas, capítulos, personagens, nove reinos, galeria, 87 temas previstos, espaço de demos e diário.

## COMO PUBLICAR — GitHub Pages
1. Crie um repositório público separado (sugerido: `deia-site`) para não expor código do jogo.
2. Envie o conteúdo **desta pasta**, com index.html na raiz. Não altere o projeto Godot.
3. Em Settings > Pages: selecione Deploy from a branch, branch main, pasta /root.
4. No DNS do domínio superstarcreator.online configure registros A para o apex: 185.199.108.153, 185.199.109.153, 185.199.110.153 e 185.199.111.153; remova A/AAAA conflitantes do apex. Ou, para subdomínio `www`, crie CNAME `www` -> `<USUARIO-GITHUB>.github.io` (substitua pelo usuário real, não use texto literal).
5. DOMÍNIO PENDENTE DE AUTORIZAÇÃO: não há CNAME ativo nesta publicação. Após aprovação, configurar superstarcreator.online em Settings > Pages, conferir DNS e ativar HTTPS quando disponível.
6. Verifique site via celular e computador. Configurações devem ser conferidas contra documentação atual do provedor escolhido.

**Nota:** DNS e deploy não foram realizados aqui; é necessário acesso ao painel que administra o domínio e à conta de hospedagem.

## Música e demos
Música: organizar MP3/OGG autorais em assets/audio e atualizar item correspondente em content/lore.json e o HTML gerado. Não publicar conteúdo sem direitos.
Demos: somente builds Godot Web exportadas, testadas e auditadas, em `demos/<reino>/`.

## Atualização sem divergência
`content/lore.json` é referência estruturada; esta entrega é uma versão estática. Cada alteração aprovada exige reconstrução do HTML, validação das imagens e publicação da nova versão. Não há sincronização automática habilitada com o jogo. A fase 02C.10 continua pausada.
