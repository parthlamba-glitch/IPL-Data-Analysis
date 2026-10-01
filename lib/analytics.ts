import prepared from "@/data/ipl.json";
import type { Match, Filters, Batter, Bowler } from "./types";

const all = prepared as Match[];
const seasons = [...new Set(all.map((m) => m.season))].sort();
if (
  all.length !== 1095 ||
  seasons.length !== 17 ||
  seasons[0] !== 2008 ||
  seasons.at(-1) !== 2024
)
  throw new Error("Prepared IPL data failed validation");
export const options = {
  seasons,
  teams: [...new Set(all.flatMap((m) => [m.team1, m.team2]))].sort(),
  venues: [...new Set(all.map((m) => m.venue))].sort(),
  players: [
    ...new Set(
      all.flatMap((m) => [
        ...m.batting.map((p) => p.name),
        ...m.bowling.map((p) => p.name),
      ]),
    ),
  ].sort(),
};
const sum = (items: number[]) => items.reduce((a, b) => a + b, 0);
const pct = (a: number, b: number) => (b ? +((a / b) * 100).toFixed(1) : 0);
const rate = (a: number, b: number, mult = 1) =>
  b ? +((a / b) * mult).toFixed(2) : 0;
export function analyze(f: Filters) {
  const matches = all.filter(
    (m) =>
      (!f.season || m.season === f.season) &&
      (!f.team || m.team1 === f.team || m.team2 === f.team) &&
      (!f.venue || m.venue === f.venue) &&
      (!f.result || m.result === f.result) &&
      (!f.from || m.date >= f.from) &&
      (!f.to || m.date <= f.to) &&
      (!f.player ||
        m.batting.some((p) => p.name === f.player) ||
        m.bowling.some((p) => p.name === f.player)),
  );
  const bat = new Map<string, Batter & { innings: number }>(),
    bowl = new Map<
      string,
      Bowler & { matches: number; fourWicket: number; fiveWicket: number }
    >();
  const teamMap = new Map<
    string,
    {
      team: string;
      matches: number;
      wins: number;
      runs: number;
      wickets: number;
    }
  >();
  const teamSeasonMap = new Map<
    string,
    {
      team: string;
      season: number;
      matches: number;
      wins: number;
      runs: number;
    }
  >();
  const playerSeasonMap = new Map<
    number,
    {
      season: number;
      runs: number;
      balls: number;
      wickets: number;
      bowlerRuns: number;
      bowlerBalls: number;
    }
  >();
  const seasonMap = new Map<
    number,
    {
      season: number;
      matches: number;
      runs: number;
      wickets: number;
      deliveries: number;
    }
  >();
  const venueMap = new Map<
    string,
    { venue: string; matches: number; tossWins: number }
  >();
  let first = 0,
    chase = 0,
    tie = 0,
    noResult = 0;
  for (const m of matches) {
    let s = seasonMap.get(m.season);
    if (!s) {
      s = { season: m.season, matches: 0, runs: 0, wickets: 0, deliveries: 0 };
      seasonMap.set(m.season, s);
    }
    s.matches++;
    s.runs += m.runs;
    s.wickets += m.wickets;
    s.deliveries += m.deliveries;
    for (const name of [m.team1, m.team2]) {
      let t = teamMap.get(name);
      if (!t) {
        t = { team: name, matches: 0, wins: 0, runs: 0, wickets: 0 };
        teamMap.set(name, t);
      }
      const teamRuns = sum(
        m.innings.filter((i) => i.team === name).map((i) => i.runs),
      );
      t.matches++;
      t.wins += m.winner === name ? 1 : 0;
      t.runs += teamRuns;
      t.wickets += sum(
        m.bowling.filter((p) => p.team === name).map((p) => p.wickets),
      );
      const key = m.season + "|" + name;
      let ts = teamSeasonMap.get(key);
      if (!ts) {
        ts = { team: name, season: m.season, matches: 0, wins: 0, runs: 0 };
        teamSeasonMap.set(key, ts);
      }
      ts.matches++;
      ts.wins += m.winner === name ? 1 : 0;
      ts.runs += teamRuns;
    }
    let v = venueMap.get(m.venue);
    if (!v) {
      v = { venue: m.venue, matches: 0, tossWins: 0 };
      venueMap.set(m.venue, v);
    }
    v.matches++;
    v.tossWins += m.winner && m.tossWinner === m.winner ? 1 : 0;
    if (m.result === "tie") tie++;
    else if (!m.winner) noResult++;
    else if (m.winner === m.firstBattingTeam) first++;
    else chase++;
    for (const p of m.batting) {
      if (f.team && p.team !== f.team) continue;
      if (f.player && p.name !== f.player) continue;
      let x = bat.get(p.name);
      if (!x) {
        x = {
          name: p.name,
          team: p.team,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          dismissals: 0,
          innings: 0,
        };
        bat.set(p.name, x);
      }
      if (x.team !== p.team) x.team = "Multiple teams";
      x.runs += p.runs;
      x.balls += p.balls;
      x.fours += p.fours;
      x.sixes += p.sixes;
      x.dismissals += p.dismissals;
      x.innings += p.balls > 0 ? 1 : 0;
      if (f.player) {
        let ps = playerSeasonMap.get(m.season);
        if (!ps) {
          ps = {
            season: m.season,
            runs: 0,
            balls: 0,
            wickets: 0,
            bowlerRuns: 0,
            bowlerBalls: 0,
          };
          playerSeasonMap.set(m.season, ps);
        }
        ps.runs += p.runs;
        ps.balls += p.balls;
      }
    }
    for (const p of m.bowling) {
      if (f.team && p.team !== f.team) continue;
      if (f.player && p.name !== f.player) continue;
      let x = bowl.get(p.name);
      if (!x) {
        x = {
          name: p.name,
          team: p.team,
          runs: 0,
          balls: 0,
          wickets: 0,
          dots: 0,
          powerplayRuns: 0,
          powerplayBalls: 0,
          deathRuns: 0,
          deathBalls: 0,
          matches: 0,
          fourWicket: 0,
          fiveWicket: 0,
        };
        bowl.set(p.name, x);
      }
      if (x.team !== p.team) x.team = "Multiple teams";
      for (const k of [
        "runs",
        "balls",
        "wickets",
        "dots",
        "powerplayRuns",
        "powerplayBalls",
        "deathRuns",
        "deathBalls",
      ] as const)
        x[k] += p[k];
      x.matches++;
      x.fourWicket += p.wickets >= 4 ? 1 : 0;
      x.fiveWicket += p.wickets >= 5 ? 1 : 0;
      if (f.player) {
        let ps = playerSeasonMap.get(m.season);
        if (!ps) {
          ps = {
            season: m.season,
            runs: 0,
            balls: 0,
            wickets: 0,
            bowlerRuns: 0,
            bowlerBalls: 0,
          };
          playerSeasonMap.set(m.season, ps);
        }
        ps.wickets += p.wickets;
        ps.bowlerRuns += p.runs;
        ps.bowlerBalls += p.balls;
      }
    }
  }
  const batters = [...bat.values()]
    .map((p) => ({
      ...p,
      average: rate(p.runs, p.dismissals),
      strikeRate: rate(p.runs, p.balls, 100),
      notOuts: Math.max(0, p.innings - p.dismissals),
    }))
    .sort((a, b) => b.runs - a.runs);
  const bowlers = [...bowl.values()]
    .map((p) => ({
      ...p,
      economy: rate(p.runs, p.balls, 6),
      average: rate(p.runs, p.wickets),
      strikeRate: rate(p.balls, p.wickets),
      overs: Math.floor(p.balls / 6) + "." + (p.balls % 6),
      powerplayEconomy: rate(p.powerplayRuns, p.powerplayBalls, 6),
      deathEconomy: rate(p.deathRuns, p.deathBalls, 6),
    }))
    .sort((a, b) => b.wickets - a.wickets);
  const teams = [...teamMap.values()]
    .map((t) => ({
      ...t,
      losses: t.matches - t.wins,
      winPct: pct(t.wins, t.matches),
    }))
    .sort((a, b) => b.wins - a.wins);
  const seasons = [...seasonMap.values()]
    .map((s) => ({ ...s, runsPerMatch: rate(s.runs, s.matches) }))
    .sort((a, b) => a.season - b.season);
  return {
    filters: f,
    kpis: {
      matches: matches.length,
      deliveries: sum(matches.map((m) => m.deliveries)),
      runs: sum(matches.map((m) => m.runs)),
      wickets: sum(matches.map((m) => m.wickets)),
      seasons: seasons.length,
      teams: teams.length,
      players: new Set([...bat.keys(), ...bowl.keys()]).size,
    },
    outcomes: {
      first,
      chase,
      tie,
      noResult,
      firstPct: pct(first, first + chase),
      chasePct: pct(chase, first + chase),
    },
    seasons,
    teams,
    teamSeasons: [...teamSeasonMap.values()].map((t) => ({
      ...t,
      winPct: pct(t.wins, t.matches),
    })),
    playerSeasons: [...playerSeasonMap.values()].sort(
      (a, b) => a.season - b.season,
    ),
    batters,
    bowlers,
    venues: [...venueMap.values()]
      .map((v) => ({ ...v, tossWinPct: pct(v.tossWins, v.matches) }))
      .sort((a, b) => b.matches - a.matches),
    matches: matches
      .map(({ batting, bowling, ...m }) => ({
        ...m,
        topBatters: [...batting].sort((a, b) => b.runs - a.runs).slice(0, 3),
        topBowlers: [...bowling]
          .sort((a, b) => b.wickets - a.wickets)
          .slice(0, 3),
      }))
      .sort((a, b) => b.date.localeCompare(a.date)),
  };
}
