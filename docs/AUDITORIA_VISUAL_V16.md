# Auditoria visual V16

Base auditada: `b4e921a750b3bd16ffbb81d3c4bc76dc181b7890`.
Referência visual consultada: `Portal de Déia e os Nove Reinos(1).png`, imagem aprovada fornecida anteriormente pelo usuário. A prancha de personagens não foi confundida com a referência de composição.

## Correções

- O banner V13 continua com 1983 × 793 pixels e SHA256 `13fc255eccf6be18ca7139d35635bd0bb57e90e760ace846172341e4cf2787e2`. Sem redesenho, filtros ou corte. Atalhos da capa preservados; botões separados no celular.
- Retratos contidos nos limites do card; a dimensão intrínseca das imagens já não ultrapassa o contêiner. Recortes individuais de Déia, Fhenrir e Déia Celestial usam exclusivamente as pranchas oficiais existentes.
- As nove miniaturas de paisagem e o carrossel usam regiões do mapa oficial. As pranchas completas dos reinos continuam nas fichas, com proporção 4:3 e sem recorte. Nenhum chefe foi substituído por outra criatura.
- Vovó Brasa, Alderyon, Seralyth, Elyndor, Aethrakar e as duas aparências já aprovadas de Vael’Zhar foram preservados. Aethrakar continua distinto de Vael’Zhar. Elyndor também apresenta sua arte na ficha de viajante.
- Galeria da página inicial agora abre o modal com zoom, por clique ou teclado. A galeria principal conserva as referências e os retratos aprovados. As pranchas narrativas de Déia Celestial e Vael’Zhar são representadas pelos retratos, sem seus textos reveladores.
- As duas folhas de refinamento `refinement-v14.css` e `layout-audit-v16.css` foram substituídas na página por uma única camada ativa, `portal-v16.css`. Os arquivos históricos permanecem disponíveis para reversão. Foram unificados limites de imagem, molduras, espaçamentos, quebras responsivas e estilos de leitura; estilos-base e módulos funcionais anteriores continuam carregados.
- O catálogo público mostra somente faixas com arquivo de áudio associado. Registros de planejamento, inclusive títulos narrativos, não são exibidos como músicas publicadas. O catálogo de trabalho do administrador não foi alterado. A página inicial usa um player real, e a reprodução de uma faixa pausa a anterior.
- Menu móvel, busca, destaque da seção ativa, foco e redução de movimento preservados/refinados.

## Verificação reproduzível

O workflow `Verify portal` testa Chromium em 1440, 1024, 768, 390 e 360 pixels, primeiro contra os arquivos da revisão. Em `main`, aguarda o GitHub Pages servir exatamente o HTML da revisão e repete os testes contra o endereço público. Capturas PNG são anexadas ao run.

Cobertura: proporção do banner, seus dois links, ausência de transbordamento horizontal, menu e Escape, todos os retratos, limites dos contêineres, todas as imagens renderizadas, nove miniaturas de paisagem, nove fichas de reino, nove fichas de viajante, galeria principal e inicial com zoom/reset, âncoras internas, filtros musicais, categoria vazia, reprodução de cada áudio publicado, exclusividade de reprodução, busca e tela de entrada administrativa em cada largura.

Os 13 novos recortes foram comparados pixel a pixel com as respectivas regiões de origem, após decodificação. Resultado: zero pixels alterados. Fontes e coordenadas exatas estão em `content/recortes-oficiais-v16.json`.

## Limites e pendências

- O painel foi verificado na tela de entrada, com console protegido, campo de token mascarado e layout responsivo. Publicação, exclusão e uploads autenticados não foram executados como teste, pois a sessão administrativa não estava autenticada. A publicação desta auditoria utiliza o conector GitHub autorizado para o repositório do site.
- As miniaturas de paisagem derivam do mapa aprovado; sua nitidez é limitada à resolução das regiões originais. Artes individuais de paisagem com resolução maior só devem substituir essas miniaturas quando forem fornecidas e aprovadas.
- Sem exportação Web real verificada, o site mantém o aviso de testes jogáveis pendentes, sem botão de demo inventada.
- O banner V13 tem proporção própria, diferente da faixa hero do mockup de referência. A composição mantém essa proporção integral, em vez de cortar a arte para copiar a altura do mockup.
- Nenhuma alteração no repositório Godot ou no DNS da Hostinger.

## Arquivos da revisão

Textos/código: `index.html`, `assets/portal-v16.css`, `assets/portal-v7.js`, `assets/codex-v82.js`, `assets/polish-v12.js`, `assets/music-catalog.js`, `content/lore.json` (somente três caminhos de imagem), `content/recortes-oficiais-v16.json`, `tests/portal-smoke.cjs`, `.github/workflows/verify-portal.yml` e este relatório.

Novas imagens: `assets/img/personagens/deia-retrato-oficial.webp`, `deia-celestial-retrato-oficial.webp`, `fhenrir-retrato-oficial.webp`, `deia-acao-oficial.webp`; `assets/img/reinos/reino-0-paisagem-oficial.webp` até `reino-8-paisagem-oficial.webp`.

Nenhum arquivo existente de imagem foi apagado ou sobrescrito. As repetições de personagem entre prévia, ficha e galeria são intencionais; cada local aponta para a identidade correspondente.
