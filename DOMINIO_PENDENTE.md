# Plano do domínio — aguarda aprovação

Domínio: superstarcreator.online. Nenhum DNS foi alterado.

Primeiro publicar em https://jorgenovojulho.github.io/Deia-Site-Oficial/.
Em Settings > Pages: Deploy from a branch, main, /(root), Save.

Após autorização expressa: configurar Custom domain como superstarcreator.online e criar CNAME na raiz com esse conteúdo. Na Hostinger, conferir e substituir somente registros A/AAAA conflitantes do apex, preservando MX/TXT e outros serviços.

| Tipo | Nome | Valor |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | jorgenovojulho.github.io |

Conferir propagação e certificado; ativar Enforce HTTPS quando disponível.
Documentação: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

O pacote original V6.4 contém 15 WebP. Elas foram preservadas byte a byte. Músicas e demos não foram adicionadas. O CSS foi corrigido para carregar img/cover.webp relativamente a assets/site.css. JavaScript apenas destaca a navegação atual por aria-current.
