# Portfólio — Juliano Andrade

Site bilíngue de estudos de caso sobre sistemas de IA em produção: agentes,
recuperação sobre base própria, avaliação automatizada e pipelines de dados.

A maior parte do trabalho descrito aqui é de empresa ou de cliente e está sob
confidencialidade. Os casos descrevem **arquitetura e decisões**, sem expor
código proprietário, credenciais, clientes ou dados de operação.

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000 → redireciona para /pt
npm run build
npx tsc --noEmit
```

Não há variável de ambiente para configurar: o site é estático e o conteúdo
vive no repositório.

## Decisões que valem conhecer antes de mexer

**Tradução é checada pelo compilador.** `conteudo/pt.ts` e `conteudo/en.ts`
satisfazem o mesmo tipo `Conteudo`. Se um idioma ganha um campo que o outro não
tem, **o build quebra** — a página não sai pela metade em produção. É o motivo
de o conteúdo ser módulo TypeScript em vez de JSON ou arquivo de tradução solto.

**O tipo impõe a disciplina editorial.** Em `conteudo/tipos.ts`:

- `Papel` é obrigatório em todo caso, e `descricao` também — não existe linha de
  papel genérica repetida de projeto em projeto. `pessoasNoTime` é opcional de
  propósito: número de time que não se sabe não deve ser inventado para
  preencher campo.
- `Metrica` exige `periodo`. Número sem período é slogan, não resultado.
- `Decisao` exige `descartado` e `custo`. Sem isso vira lista de tecnologia.

**Animação sem biblioteca.** `IntersectionObserver` só adiciona a classe
`visivel`; quem anima é o CSS em `app/globals.css`. Não há JavaScript medindo
tela nem laço de animação, e `prefers-reduced-motion` desliga tudo. O estado
inicial oculto depende da classe `js-pronto` no `<html>`: sem JavaScript, o
conteúdo aparece — nunca uma página em branco por causa de animação.

**Geometria separada do conteúdo.** Os diagramas de arquitetura têm as
coordenadas em `conteudo/diagramas/` e os rótulos no conteúdo traduzido. Uma
tradução mais longa não desloca o desenho. As descrições dos nós ficam numa
lista abaixo do SVG, não dentro dele: texto em SVG não quebra linha, não é
selecionável de forma confiável e some em leitor de tela.

**Sem `cacheComponents`.** O recurso serve a páginas que misturam shell estático
com dado dinâmico, e este site não tem dado dinâmico. Mantê-lo ligado custava
correção: ele é incompatível com `dynamicParams = false`, e sem isso um slug
inexistente respondia **HTTP 200 com conteúdo de 404** — soft 404, que buscador
indexa como página válida.

## Estrutura

```
app/[idioma]/
  layout.tsx              layout raiz — não existe app/layout.tsx, é o padrão
                          de i18n do Next, e é o que faz o lang do <html>
                          refletir a rota
  page.tsx                home
  casos/[slug]/page.tsx   estudo de caso
components/
  DiagramaArquitetura.tsx SVG revelado nó a nó
  Revelar.tsx             observador de scroll
  AlternadorIdioma.tsx    troca o idioma preservando a rota atual
conteudo/
  tipos.ts                o contrato
  pt.ts / en.ts           mesmo tipo, build quebra se divergirem
  diagramas/              coordenadas dos SVG
```

## Uso do código e do conteúdo

O **código** está aqui para ser lido e aproveitado à vontade — o padrão de i18n
tipado e a revelação por scroll sem biblioteca são as partes que valem copiar.

O **conteúdo** (textos dos casos, trajetória, métricas) é pessoal e descreve
trabalho real. Não republique como se fosse seu.
