# Brawl Tracker

Site estático (GitHub Pages) que mostra estatísticas da sua conta de Brawl Stars,
atualizado automaticamente 1x por dia via GitHub Actions.

## Estrutura

```
.github/workflows/atualizar.yml   → roda o script todo dia às 04:00 UTC
scripts/buscar_dados.py           → chama a API oficial e gera os JSONs
data/conta.json                   → snapshot atual (sobrescrito a cada execução)
data/historico.json               → um registro por dia (troféus, brawlers)
data/config.json                  → único número mantido manualmente: total de brawlers no jogo
index.html / brawlers.html        → páginas do site
css/style.css, js/*.js            → estilo e lógica
```

## Passo a passo pra colocar no ar

### 1. Criar a chave de API
1. Acesse **developer.brawlstars.com**, faça login com sua conta Supercell ID
2. Crie uma nova chave (**Create New Key**)
3. Em **IP address**, informe o IP que aparecer no log da primeira execução do workflow
   (veja o passo 4) — isso é necessário porque os runners do GitHub Actions não têm IP fixo

### 2. Configurar os *secrets* do repositório
No GitHub: **Settings → Secrets and variables → Actions → New repository secret**

| Nome | Valor |
|---|---|
| `BRAWL_API_TOKEN` | o token gerado no passo 1 |
| `PLAYER_TAG` | `232CGY9VQV` (sua tag, sem `#`) |

### 3. Subir os arquivos
Suba todo o conteúdo desta pasta pro seu repositório, ative o **GitHub Pages** apontando
pra branch principal, e confirme que o domínio próprio está configurado em **Settings → Pages**.

### 4. Rodar o workflow manualmente pela primeira vez
Vá em **Actions → Atualizar dados do Brawl Stars → Run workflow**.
Ele vai:
- Mostrar o IP público daquela execução no log
- Tentar chamar a API (vai falhar com erro 403 na primeira vez, porque esse IP
  ainda não está autorizado)

Copie o IP mostrado no log e volte no developer.brawlstars.com pra autorizá-lo na chave.
Rode o workflow de novo — agora deve funcionar.

## ⚠️ Sobre o IP não ser fixo (importante)

Os runners do GitHub Actions usam um IP **diferente a cada execução**, sorteado de um range
gigantesco da Azure. Isso significa que, de tempos em tempos, o IP autorizado na sua chave
vai ficar desatualizado e o workflow vai voltar a falhar com erro 403 — os dados antigos
continuam no site (o script não sobrescreve nada se a chamada falhar), só não atualizam.

Pensei em automatizar esse re-cadastro de IP usando login programático na sua conta Supercell,
mas decidi **não** incluir isso: são endpoints não-documentados oficialmente, que podem mudar
sem aviso e potencialmente ferem os termos de uso da Supercell ao automatizar login. Prefiro
ser direto sobre isso a te entregar algo frágil ou arriscado.

Três alternativas reais, dá pra escolher a que fizer mais sentido:

1. **Manual, de vez em quando** — quando o site parar de atualizar, você roda o workflow
   manualmente, pega o IP do log, atualiza na chave. Rápido (2 min), mas exige lembrar.
2. **Self-hosted runner** — instalar o runner do GitHub Actions numa máquina sua com IP fixo
   (um Raspberry Pi, um PC ligado, um servidor doméstico). Aí o IP nunca muda e o workflow
   nunca quebra. É a solução mais robusta e ainda gratuita, só exige ter um dispositivo ligado.
3. **Proxy com IP fixo** — rodar a chamada à API através de um VPS baratinho (tipo Oracle Cloud
   Free Tier, que tem IP fixo grátis) em vez de direto do GitHub Actions.

Pra começar, sugiro a opção 1 — é zero setup extra — e migrar pra opção 2 depois se incomodar
ter que reautorizar o IP de vez em quando.

## Atualizar o total de brawlers do jogo

A API não informa quantos brawlers *existem no jogo*, só quantos você tem. Sempre que a
Supercell lançar um brawler novo, edite `data/config.json` e ajuste `totalBrawlersNoJogo`.
