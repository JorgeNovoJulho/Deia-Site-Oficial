# Publicação do site oficial de Déia

Domínio pretendido: https://superstarcreator.online

Este repositório é EXCLUSIVO do portal público do jogo *Déia e os Nove Reinos Majestosos*, separado do projeto Godot `DeiaNoveReinos`.

## Estado
- Site V6.4 preparado em pacote local, ainda não enviado integralmente ao GitHub.
- As imagens oficiais são essenciais e **não podem ser substituídas por ilustrações de outros personagens**.
- NÃO ativar GitHub Pages antes de existir `index.html` funcional e `assets/img/` completo.
- DNS Hostinger permanece intocado até validação do endereço Pages.

## Ordem de publicação
1. Enviar `index.html`, `assets/`, `content/`, `demos/` e os arquivos auxiliares na raiz do repositório.
2. Conferir arquivos, imagens e caminhos de importação.
3. Em Settings > Pages, escolher Deploy from a branch, `main`, `/(root)`.
4. Conferir o endereço inicial de Pages antes de alterar DNS.
5. Configurar o domínio personalizado `superstarcreator.online` em Pages e depois alterar somente os registros web DNS na Hostinger, preservando MX/TXT e os demais serviços.
6. Conferir HTTPS, `www`, celular, imagens e navegação.

## Registros Hostinger observados em 28/10/2026
- A `@` -> `2.57.91.91` (atual; **não alterar antes de validar o Pages**)
- CNAME `www` -> `superstarcreator.online` (atual)

Não realizar `push` no projeto Godot; sua fase de habilidades 02C.10 continua pausada.
