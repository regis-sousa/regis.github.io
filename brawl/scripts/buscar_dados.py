"""
Busca os dados do jogador na API oficial do Brawl Stars e atualiza:
  - data/conta.json      (snapshot mais recente, sobrescrito)
  - data/historico.json  (um registro novo é ANEXADO por execução, uma vez por dia)

Variáveis de ambiente esperadas:
  BRAWL_API_TOKEN  -> token gerado em developer.brawlstars.com
  PLAYER_TAG       -> tag do jogador, com ou sem '#', ex: 232CGY9VQV
"""

import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone

API_BASE = "https://api.brawlstars.com/v1"
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


def tag_codificada(tag: str) -> str:
    tag = tag.strip()
    if not tag.startswith("#"):
        tag = "#" + tag
    return urllib.parse.quote(tag)


def buscar(endpoint: str, token: str) -> dict:
    req = urllib.request.Request(
        f"{API_BASE}{endpoint}",
        headers={"Authorization": f"Bearer {token}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        corpo = e.read().decode("utf-8", errors="ignore")
        if e.code == 403:
            print(
                "ERRO 403: a chave de API não autoriza o IP atual desta execução.\n"
                "Isso é esperado se o IP dos runners do GitHub Actions mudou e não "
                "foi re-autorizado no developer.brawlstars.com.\n"
                f"Resposta da API: {corpo}",
                file=sys.stderr,
            )
        else:
            print(f"ERRO {e.code} ao chamar {endpoint}: {corpo}", file=sys.stderr)
        raise


def main():
    token = os.environ.get("BRAWL_API_TOKEN")
    tag_bruta = os.environ.get("PLAYER_TAG")

    if not token or not tag_bruta:
        print("Defina BRAWL_API_TOKEN e PLAYER_TAG nas variáveis de ambiente.", file=sys.stderr)
        sys.exit(1)

    tag_url = tag_codificada(tag_bruta)

    jogador = buscar(f"/players/{tag_url}", token)

    agora = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    conta = {
        "atualizadoEm": agora,
        "tag": jogador.get("tag"),
        "name": jogador.get("name"),
        "expLevel": jogador.get("expLevel"),
        "expPoints": jogador.get("expPoints"),
        "trophies": jogador.get("trophies"),
        "highestTrophies": jogador.get("highestTrophies"),
        "3vs3Victories": jogador.get("3vs3Victories"),
        "soloVictories": jogador.get("soloVictories"),
        "duoVictories": jogador.get("duoVictories"),
        "club": {
            "tag": jogador.get("club", {}).get("tag") if jogador.get("club") else None,
            "name": jogador.get("club", {}).get("name") if jogador.get("club") else "Sem clube",
        },
        "brawlers": [
            {
                "id": b.get("id"),
                "name": b.get("name"),
                "power": b.get("power"),
                "rank": b.get("rank"),
                "trophies": b.get("trophies"),
                "highestTrophies": b.get("highestTrophies"),
                "gadgets": b.get("gadgets", []),
                "starPowers": b.get("starPowers", []),
                "gears": b.get("gears", []),
            }
            for b in jogador.get("brawlers", [])
        ],
    }

    os.makedirs(DATA_DIR, exist_ok=True)

    with open(os.path.join(DATA_DIR, "conta.json"), "w", encoding="utf-8") as f:
        json.dump(conta, f, ensure_ascii=False, indent=2)

    # Anexa um snapshot no histórico, só um por dia (evita duplicar se o job
    # rodar mais de uma vez no mesmo dia via workflow_dispatch manual)
    historico_path = os.path.join(DATA_DIR, "historico.json")
    historico = []
    if os.path.exists(historico_path):
        with open(historico_path, "r", encoding="utf-8") as f:
            historico = json.load(f)

    hoje = datetime.now(timezone.utc).date().isoformat()
    novo_registro = {
        "data": hoje,
        "trophies": conta["trophies"],
        "brawlersDesbloqueados": len(conta["brawlers"]),
    }

    if historico and historico[-1]["data"] == hoje:
        historico[-1] = novo_registro
    else:
        historico.append(novo_registro)

    with open(historico_path, "w", encoding="utf-8") as f:
        json.dump(historico, f, ensure_ascii=False, indent=2)

    print(f"OK — dados de {conta['name']} atualizados ({conta['trophies']} troféus, {len(conta['brawlers'])} brawlers).")


if __name__ == "__main__":
    main()
