# Auditoria do portal — 31/10/2026

## Homologações
- S01, S02 e S03: aprovados pelo usuário.
- S04: Chromium testa zoom e encaixe da imagem; verificação manual do gesto de arrasto ainda necessária.
- S05: GitHub Actions executa regressão, smoke e teste e2e. Última execução aprovada: 41164445433.
- S06: execução responsiva desktop, tablet e mobile aprovada; análise estética fina ainda deve ser feita com screenshots.
- S07: 83 referências estáticas no HTML encontradas no repositório; 36/36 imagens de cenários disponíveis; 39/117 cards RPG disponíveis.
- S08: página de login e bloqueio do console sem autenticação verificados; funcionalidades autenticadas pendentes de teste com acesso autorizado.

## Arquivos pendentes
- 78 cards RPG: Terra dos Doces, Cavernas Obscuras, Terra dos Mortos, Pântano Venenoso, Terra dos Dinossauros e Terra do Futuro, 13 por reino.
- 82 de 87 entradas do catálogo musical não têm arquivo associado. Cinco têm mídia.

## Regras de segurança e preservação
1. Preservar identidades e artes oficiais e não criar nomes ou bosses novos.
2. Proteger os três primeiros reinos e as abas/audio já aprovados.
3. Exigir GitHub Actions verde antes de considerar uma alteração homologada.
4. Validar capturas em desktop, tablet e celular.
5. Não exigir nem acessar tokens pessoais do administrador; testes reais de publicação exigem sessão do proprietário.
6. Godot: não fazer push sem aprovação específica.
