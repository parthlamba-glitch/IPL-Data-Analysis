"""Build validated, compact match summaries from the checked-in IPL CSVs."""
import csv
import json
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "Resources"
OUT = ROOT / "data" / "ipl.json"
TEAM_ALIASES = {
    "Delhi Daredevils": "Delhi Capitals",
    "Kings XI Punjab": "Punjab Kings",
    "Rising Pune Supergiant": "Rising Pune Supergiants",
    "Royal Challengers Bengaluru": "Royal Challengers Bangalore",
}
NON_BOWLER_WICKETS = {"run out", "retired hurt", "retired out", "obstructing the field"}


def read(name):
    with (DATA / name).open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def team(name):
    return TEAM_ALIASES.get(name, name)


def number(value):
    return int(float(value or 0))


def main():
    matches = read("corrected_data.csv")
    deliveries = read("deliveries.csv")
    merged = read("merged_data.csv")
    assert len(matches) == 1095 and len(deliveries) == len(merged) == 260920, "Unexpected source row counts"
    assert len({m["id"] for m in matches}) == len(matches), "Duplicate match IDs"
    by_id = {}
    for row in matches:
        season = int(row["date"][:4])
        assert 2008 <= season <= 2024 and row["season"][:4] in {str(season), str(season - 1)}, "Invalid season"
        mid = row["id"]
        by_id[mid] = {
            "id": mid, "season": season, "date": row["date"], "venue": row["venue"], "city": row["city"],
            "team1": team(row["team1"]), "team2": team(row["team2"]), "winner": team(row["winner"]) if row["winner"] else "",
            "result": row["result"], "margin": number(row["result_margin"]), "tossWinner": team(row["toss_winner"]),
            "tossDecision": row["toss_decision"], "playerOfMatch": row["player_of_match"],
            "innings": {}, "batting": {}, "bowling": {}, "runs": 0, "wickets": 0, "deliveries": 0,
        }
    assert {d["match_id"] for d in deliveries} == set(by_id), "Delivery match IDs differ"
    seen = set()
    for d in deliveries:
        m = by_id[d["match_id"]]
        batting_team, bowling_team = team(d["batting_team"]), team(d["bowling_team"])
        assert {batting_team, bowling_team} == {m["team1"], m["team2"]}, "Team normalization failed"
        inning = number(d["inning"])
        assert 1 <= inning <= 6 and 0 <= number(d["over"]) <= 19, "Invalid innings or over"
        key = (d["match_id"], inning, d["over"], d["ball"])
        assert key not in seen, "Duplicate delivery key"
        seen.add(key)
        ir = m["innings"].setdefault(str(inning), {"team": batting_team, "runs": 0, "wickets": 0})
        assert ir["team"] == batting_team, "Innings has inconsistent batting team"
        runs = number(d["total_runs"]); bat_runs = number(d["batsman_runs"])
        extra = number(d["extra_runs"]); wicket = number(d["is_wicket"])
        assert runs == bat_runs + extra, "Run total mismatch"
        legal = d["extras_type"] not in {"wides", "noballs"}
        conceded = bat_runs + (extra if d["extras_type"] in {"wides", "noballs"} else 0)
        bowler_wicket = wicket and d["dismissal_kind"] not in NON_BOWLER_WICKETS
        phase = "powerplay" if number(d["over"]) <= 5 else "death" if number(d["over"]) >= 16 else "middle"
        ir["runs"] += runs; ir["wickets"] += wicket
        m["runs"] += runs; m["wickets"] += wicket; m["deliveries"] += 1
        b = m["batting"].setdefault(d["batter"], {"name": d["batter"], "team": batting_team, "runs": 0, "balls": 0, "fours": 0, "sixes": 0, "dismissals": 0})
        b["runs"] += bat_runs; b["balls"] += d["extras_type"] != "wides"
        b["fours"] += bat_runs == 4; b["sixes"] += bat_runs == 6
        if wicket and d["player_dismissed"]:
            out = m["batting"].setdefault(d["player_dismissed"], {"name": d["player_dismissed"], "team": batting_team, "runs": 0, "balls": 0, "fours": 0, "sixes": 0, "dismissals": 0})
            out["dismissals"] += 1
        w = m["bowling"].setdefault(d["bowler"], {"name": d["bowler"], "team": bowling_team, "runs": 0, "balls": 0, "wickets": 0, "dots": 0,
                                                   "powerplayRuns": 0, "powerplayBalls": 0, "deathRuns": 0, "deathBalls": 0})
        w["runs"] += conceded; w["balls"] += legal; w["wickets"] += bowler_wicket
        w["dots"] += legal and runs == 0
        if phase != "middle":
            w[phase + "Runs"] += conceded; w[phase + "Balls"] += legal
    output = []
    for m in by_id.values():
        m["firstBattingTeam"] = m["innings"].get("1", {}).get("team", "")
        m["innings"] = [{"number": int(n), **v} for n, v in sorted(m["innings"].items(), key=lambda x: int(x[0]))]
        m["batting"] = list(m["batting"].values())
        m["bowling"] = list(m["bowling"].values())
        output.append(m)
    assert sorted({m["season"] for m in output}) == list(range(2008, 2025)), "Missing or bogus season"
    assert sum(m["deliveries"] for m in output) == len(deliveries), "Delivery aggregation mismatch"
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(output, separators=(",", ":")), encoding="utf-8")
    print(f"Prepared {len(output)} matches, {len(deliveries)} deliveries, seasons 2008–2024 -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
