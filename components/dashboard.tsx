"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CircleHelp,
  Filter,
  Menu,
  Search,
  Shield,
  Target,
  Trophy,
  Users,
  X,
} from "lucide-react";

type AnyRow = Record<string, any>;
type Payload = {
  options: {
    seasons: number[];
    teams: string[];
    venues: string[];
    players: string[];
  };
  data: {
    filters: AnyRow;
    kpis: AnyRow;
    outcomes: AnyRow;
    seasons: AnyRow[];
    teams: AnyRow[];
    teamSeasons: AnyRow[];
    playerSeasons: AnyRow[];
    batters: AnyRow[];
    bowlers: AnyRow[];
    venues: AnyRow[];
    matches: AnyRow[];
  };
};
const nav = [
  ["dashboard", "Dashboard", Activity],
  ["matches", "Matches", CalendarDays],
  ["batting", "Batting", BarChart3],
  ["bowling", "Bowling", Target],
  ["teams", "Teams", Shield],
  ["seasons", "Seasons", Trophy],
  ["players", "Players", Users],
  ["methodology", "Methodology", CircleHelp],
] as const;
const navGroups = [
  { label: "Overview", ids: ["dashboard"] },
  { label: "Explore", ids: ["matches", "teams", "players", "seasons"] },
  { label: "Analysis", ids: ["batting", "bowling"] },
  { label: "Reference", ids: ["methodology"] },
] as const;
const pageCopy: Record<
  string,
  { eyebrow: string; title: string; description: string }
> = {
  dashboard: {
    eyebrow: "THE IPL, IN CONTEXT",
    title: "IPL Analytics",
    description:
      "Explore how IPL cricket evolved from 2008 to 2024 through 1,095 matches and more than 260,000 deliveries.",
  },
  matches: {
    eyebrow: "THE MATCH ARCHIVE",
    title: "Find a match.",
    description:
      "Search the IPL archive by team, venue, date or result, then open a match for its innings and standout performances.",
  },
  batting: {
    eyebrow: "BATTING ANALYSIS",
    title: "Who led with the bat?",
    description:
      "Compare runs, average, strike rate and boundary scoring across players and seasons.",
  },
  bowling: {
    eyebrow: "BOWLING ANALYSIS",
    title: "Wickets and control.",
    description:
      "See which bowlers combined wicket-taking with economy, and how their figures changed by phase.",
  },
  teams: {
    eyebrow: "FRANCHISE HISTORY",
    title: "How teams compare.",
    description:
      "Explore wins, scoring and season performance across the franchises in this dataset.",
  },
  seasons: {
    eyebrow: "2008 — 2024",
    title: "Season by season.",
    description:
      "Follow the league chronologically and compare scoring and wickets across each IPL year.",
  },
  players: {
    eyebrow: "PLAYER RECORDS",
    title: "Find a player.",
    description:
      "Search the batting and bowling records, then explore a player's career and season-by-season figures.",
  },
  methodology: {
    eyebrow: "ABOUT THE NUMBERS",
    title: "How this is measured.",
    description:
      "The source, definitions and limitations behind every chart and figure on this site.",
  },
};
const fmt = (n: number) => new Intl.NumberFormat("en-IN").format(n || 0);
const short = (s: string) =>
  s
    .replace("Royal Challengers Bangalore", "RCB")
    .replace("Chennai Super Kings", "CSK")
    .replace("Mumbai Indians", "MI")
    .replace("Kolkata Knight Riders", "KKR")
    .replace("Sunrisers Hyderabad", "SRH")
    .replace("Rajasthan Royals", "RR")
    .replace("Punjab Kings", "PBKS")
    .replace("Delhi Capitals", "DC")
    .replace("Gujarat Titans", "GT")
    .replace("Lucknow Super Giants", "LSG");
function Panel({
  title,
  sub,
  children,
  className = "",
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={"panel " + className}>
      <div className="panel-head">
        <div>
          <h2>{title}</h2>
          {sub && <p>{sub}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}
function Chart({
  data,
  kind = "bar",
  x,
  y,
  color = "#d7ae6a",
  height = 290,
}: {
  data: AnyRow[];
  kind?: "bar" | "line" | "area";
  x: string;
  y: string;
  color?: string;
  height?: number;
}) {
  if (!data.length)
    return <div className="empty">No data for these filters.</div>;
  const common = [
    <CartesianGrid
      key="grid"
      stroke="#313b34"
      vertical={false}
      strokeDasharray="2 4"
    />,
    <XAxis
      key="x"
      dataKey={x}
      stroke="#a5b2a5"
      tickLine={false}
      axisLine={false}
      fontSize={12}
      minTickGap={12}
      tickMargin={10}
      tickFormatter={(v) =>
        String(v).length > 17 ? String(v).slice(0, 15) + "…" : v
      }
    />,
    <YAxis
      key="y"
      stroke="#a5b2a5"
      tickLine={false}
      axisLine={false}
      fontSize={12}
      width={48}
      domain={kind === "bar" ? [0, "auto"] : ["dataMin - 20", "dataMax + 20"]}
      tickFormatter={(v) =>
        Intl.NumberFormat("en", { notation: "compact" }).format(v)
      }
    />,
    <Tooltip
      key="tooltip"
      contentStyle={{
        background: "#1a221c",
        border: "1px solid #59675a",
        borderRadius: 3,
        color: "#fff",
      }}
      formatter={(v) => fmt(Number(v))}
    />,
  ];
  return (
    <div className="chart" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {kind === "bar" ? (
          <BarChart
            data={data}
            margin={{ top: 10, right: 22, left: 0, bottom: 16 }}
          >
            {common}
            <Bar
              dataKey={y}
              fill={color}
              radius={[5, 5, 0, 0]}
              maxBarSize={42}
            />
          </BarChart>
        ) : kind === "area" ? (
          <AreaChart
            data={data}
            margin={{ top: 10, right: 22, left: 0, bottom: 16 }}
          >
            {common}
            <Area
              type="monotone"
              dataKey={y}
              stroke={color}
              fill={color}
              fillOpacity={0.14}
              strokeWidth={3}
            />
          </AreaChart>
        ) : (
          <LineChart
            data={data}
            margin={{ top: 10, right: 22, left: 0, bottom: 16 }}
          >
            {common}
            <Line
              type="monotone"
              dataKey={y}
              stroke={color}
              strokeWidth={3}
              dot={{ r: 3 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note?: string;
}) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{typeof value === "number" ? fmt(value) : value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}
function Table({
  columns,
  rows,
  onClick,
}: {
  columns: {
    key: string;
    label: string;
    render?: (v: any, r: AnyRow) => React.ReactNode;
  }[];
  rows: AnyRow[];
  onClick?: (r: AnyRow) => void;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={numericColumns.has(c.key) ? "num" : ""}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.id || r.name || r.team || r.season || i}
              onClick={onClick ? () => onClick(r) : undefined}
              onKeyDown={
                onClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onClick(r);
                      }
                    }
                  : undefined
              }
              tabIndex={onClick ? 0 : undefined}
              aria-label={
                onClick
                  ? `Open match ${r.team1} versus ${r.team2} on ${r.date}`
                  : undefined
              }
              className={onClick ? "clickable" : ""}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={numericColumns.has(c.key) ? "num" : ""}
                >
                  {c.render ? c.render(r[c.key], r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && (
        <div className="empty">No results match your filters.</div>
      )}
    </div>
  );
}
const cols = (pairs: [string, string][]) =>
  pairs.map(([key, label]) => ({ key, label }));
const numericColumns = new Set([
  "innings",
  "runs",
  "average",
  "strikeRate",
  "fours",
  "sixes",
  "notOuts",
  "wickets",
  "economy",
  "overs",
  "fourWicket",
  "fiveWicket",
  "matches",
  "wins",
  "losses",
  "winPct",
  "season",
  "runsPerMatch",
  "powerplayEconomy",
  "deathEconomy",
  "tossWinPct",
]);
export default function Dashboard({ section }: { section: string }) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [payload, setPayload] = useState<Payload | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AnyRow | null>(null);
  const [minWickets, setMinWickets] = useState(20);
  const [compare, setCompare] = useState("");
  const [compareSecond, setCompareSecond] = useState("");
  useEffect(() => {
    if (!selected) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [selected]);
  const qs = new URLSearchParams(filters).toString();
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("ipl-filters");
      if (saved) setFilters(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    sessionStorage.setItem("ipl-filters", JSON.stringify(filters));
  }, [filters]);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/analytics" + (qs ? "?" + qs : ""), {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw Error("Could not load analytics");
        return r.json();
      })
      .then((x) => {
        setPayload(x);
        setError("");
        setBusy(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError(e.message);
          setBusy(false);
        }
      });
    return () => controller.abort();
  }, [qs]);
  const set = (k: string, v: string) => {
    setBusy(true);
    setFilters((x) => {
      const n = { ...x };
      if (v) n[k] = v;
      else delete n[k];
      return n;
    });
  };
  const d = payload?.data,
    o = payload?.options;
  const title = nav.find((n) => n[0] === section)?.[1] || "Dashboard";
  const matchRows = useMemo(
    () =>
      d?.matches.filter((m) => {
        const s = search.toLowerCase();
        return (
          !s ||
          [
            m.team1,
            m.team2,
            m.venue,
            m.city,
            m.winner,
            m.date,
            m.playerOfMatch,
          ].some((v) => String(v).toLowerCase().includes(s))
        );
      }) || [],
    [d, search],
  );
  if (!nav.some((n) => n[0] === section))
    return (
      <div className="empty">
        Unknown page. <Link href="/">Go home</Link>
      </div>
    );
  return (
    <div className="shell">
      <aside className={"sidebar " + (menu ? "open" : "")}>
        <Link href="/" className="brand">
          <span className="brand-mark">IPL</span>
          <span>
            ANALYTICS<small>2008 — 2024</small>
          </span>
        </Link>
        <nav aria-label="Primary navigation">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-label">{group.label}</div>
              {group.ids.map((id) => {
                const item = nav.find((entry) => entry[0] === id)!;
                return (
                  <Link
                    onClick={() => setMenu(false)}
                    key={id}
                    href={id === "dashboard" ? "/" : "/" + id}
                    aria-current={section === id ? "page" : undefined}
                    className={"nav-item " + (section === id ? "active" : "")}
                  >
                    {item[1]}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="sidebar-foot">
          DATASET · 2008–2024
          <br />
          <small>1,095 MATCHES · 17 SEASONS</small>
        </div>
      </aside>
      {menu && <div className="scrim" onClick={() => setMenu(false)} />}
      <nav className="mobile-nav" aria-label="Quick navigation">
        {nav
          .filter(([id]) =>
            ["dashboard", "matches", "teams", "players"].includes(id),
          )
          .map(([id, label, Icon]) => (
            <Link
              key={id}
              href={id === "dashboard" ? "/" : "/" + id}
              aria-current={section === id ? "page" : undefined}
              className={section === id ? "active" : ""}
            >
              <Icon size={19} />
              <span>{id === "dashboard" ? "Overview" : label}</span>
            </Link>
          ))}
        <button
          type="button"
          aria-label="Open all sections"
          onClick={() => setMenu(true)}
        >
          <Menu size={19} />
          <span>More</span>
        </button>
      </nav>
      <div className="main">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Open menu"
            onClick={() => setMenu(true)}
          >
            <Menu size={21} />
          </button>
          <div className="crumb">
            IPL ANALYTICS <span>/</span> <b>{title}</b>
          </div>
          <div className="top-right">
            <span className="edition">17 seasons of IPL data</span>
          </div>
        </header>
        <main className="content">
          <div className={"page-intro page-intro-" + section}>
            <div>
              <div className="eyebrow">{pageCopy[section].eyebrow}</div>
              <h1>{pageCopy[section].title}</h1>
              <p>{pageCopy[section].description}</p>
            </div>
            {section === "dashboard" && (
              <div className="intro-badge">
                2008 <span>—</span> 2024
              </div>
            )}
          </div>
          {section !== "methodology" && (
            <div className="filters" aria-label="Filters for this analysis">
              <div className="filter-title">
                <Filter size={15} /> FILTERS{" "}
                <small>Apply to this analysis</small>
              </div>
              <label>
                Season
                <select
                  value={filters.season || ""}
                  onChange={(e) => set("season", e.target.value)}
                >
                  <option value="">All seasons</option>
                  {o?.seasons.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label>
                Team
                <select
                  value={filters.team || ""}
                  onChange={(e) => set("team", e.target.value)}
                >
                  <option value="">All teams</option>
                  {o?.teams.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label>
                Player
                <select
                  value={filters.player || ""}
                  onChange={(e) => set("player", e.target.value)}
                >
                  <option value="">All players</option>
                  {o?.players.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label>
                Venue
                <select
                  value={filters.venue || ""}
                  onChange={(e) => set("venue", e.target.value)}
                >
                  <option value="">All venues</option>
                  {o?.venues.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              {Object.keys(filters).length > 0 && (
                <button
                  className="clear"
                  onClick={() => {
                    setBusy(true);
                    setFilters({});
                  }}
                >
                  Clear all <X size={14} />
                </button>
              )}
            </div>
          )}
          {error ? (
            <div className="error" role="alert">
              <h2>Unable to load this analysis.</h2>
              <p>
                Check your connection and try again. Your selected filters will
                be preserved.
              </p>
              <button onClick={() => location.reload()}>
                Try again <ArrowRight size={16} />
              </button>
            </div>
          ) : busy || !d ? (
            <div className="loading" aria-label="Loading analytics">
              <div className="skeleton" />
              <div className="skeleton" />
              <div className="skeleton" />
            </div>
          ) : d.kpis.matches === 0 && section !== "methodology" ? (
            <div className="empty-state">
              <span>NO MATCHES FOUND</span>
              <h2>Nothing matches these filters.</h2>
              <p>
                Try another season, team, player or venue to continue exploring.
              </p>
              <button
                onClick={() => {
                  setBusy(true);
                  setFilters({});
                }}
              >
                Reset filters <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <>
              {section === "dashboard" && (
                <>
                  <div className="section-kicker">DATASET AT A GLANCE</div>
                  <div className="stats three overview-stats">
                    <Stat
                      label="Matches"
                      value={d.kpis.matches}
                      note="Played in the selected view"
                    />
                    <Stat
                      label="Deliveries"
                      value={d.kpis.deliveries}
                      note="Ball by ball records"
                    />
                    <Stat
                      label="Seasons"
                      value={d.kpis.seasons}
                      note="2008 through 2024"
                    />
                  </div>
                  <div className="section-kicker">HOW THE GAME HAS CHANGED</div>
                  <div className="grid primary-story">
                    <Panel
                      title="How has IPL scoring changed?"
                      sub="Average total runs per match, both innings combined"
                    >
                      <Chart
                        data={d.seasons}
                        kind="area"
                        x="season"
                        y="runsPerMatch"
                        height={320}
                      />
                    </Panel>
                    <Panel
                      title="Batting first or chasing?"
                      sub="Share of decided matches won"
                    >
                      <div className="outcomes">
                        <div>
                          <div className="outcome-head">
                            <span>Batting first</span>
                            <b>{d.outcomes.firstPct}%</b>
                          </div>
                          <div className="track">
                            <i style={{ width: d.outcomes.firstPct + "%" }} />
                          </div>
                          <small>{fmt(d.outcomes.first)} wins</small>
                        </div>
                        <div>
                          <div className="outcome-head">
                            <span>Chasing</span>
                            <b>{d.outcomes.chasePct}%</b>
                          </div>
                          <div className="track blue">
                            <i style={{ width: d.outcomes.chasePct + "%" }} />
                          </div>
                          <small>{fmt(d.outcomes.chase)} wins</small>
                        </div>
                        <p>
                          {d.outcomes.tie} ties · {d.outcomes.noResult} no
                          results excluded from percentages
                        </p>
                      </div>
                    </Panel>
                  </div>
                  <div className="section-kicker">THE PEOPLE AND TEAMS</div>
                  <div className="grid two">
                    <Panel
                      title="Which teams have won most?"
                      sub="Wins in the selected matches"
                    >
                      <Chart
                        data={d.teams
                          .slice(0, 8)
                          .map((x) => ({ ...x, team: short(x.team) }))}
                        x="team"
                        y="wins"
                        color="#6dabb5"
                      />
                    </Panel>
                    <Panel
                      title="Who leads the records?"
                      sub="Run scorers and bowler wicket takers"
                    >
                      <div className="performers">
                        <div>
                          <h4>TOP BATTERS</h4>
                          {d.batters.slice(0, 5).map((p, i) => (
                            <div className="performer" key={p.name}>
                              <em>0{i + 1}</em>
                              <span>
                                {p.name}
                                <small>{short(p.team)}</small>
                              </span>
                              <strong>
                                {fmt(p.runs)} <small>RUNS</small>
                              </strong>
                            </div>
                          ))}
                        </div>
                        <div>
                          <h4>TOP BOWLERS</h4>
                          {d.bowlers.slice(0, 5).map((p, i) => (
                            <div className="performer" key={p.name}>
                              <em>0{i + 1}</em>
                              <span>
                                {p.name}
                                <small>{short(p.team)}</small>
                              </span>
                              <strong>
                                {fmt(p.wickets)} <small>WKTS</small>
                              </strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Panel>
                  </div>
                  <div className="explore-links" aria-label="Explore the data">
                    <span>EXPLORE THE DATA</span>
                    {["matches", "teams", "players", "seasons"].map((id) => (
                      <Link key={id} href={"/" + id}>
                        {id[0].toUpperCase() + id.slice(1)}{" "}
                        <ArrowRight size={16} />
                      </Link>
                    ))}
                  </div>
                </>
              )}
              {section === "matches" && (
                <>
                  <div className="section-heading">
                    <div>
                      <h2>Match explorer</h2>
                      <p>
                        {fmt(matchRows.length)} matches · select a row for
                        innings and performers
                      </p>
                    </div>
                    <div className="search">
                      <Search size={17} />
                      <input
                        aria-label="Search matches"
                        placeholder="Search team, venue, date…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="filters compact">
                    <label>
                      Result
                      <select
                        value={filters.result || ""}
                        onChange={(e) => set("result", e.target.value)}
                      >
                        <option value="">All results</option>
                        {["runs", "wickets", "tie", "no result"].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      From
                      <input
                        type="date"
                        value={filters.from || ""}
                        onChange={(e) => set("from", e.target.value)}
                      />
                    </label>
                    <label>
                      To
                      <input
                        type="date"
                        value={filters.to || ""}
                        onChange={(e) => set("to", e.target.value)}
                      />
                    </label>
                  </div>
                  <Panel title="Results" sub="Most recent first">
                    <Table
                      rows={matchRows.slice(0, 100)}
                      onClick={setSelected}
                      columns={[
                        {
                          key: "team1",
                          label: "TEAMS",
                          render: (_, r) => (
                            <strong className="match-teams">
                              {r.team1} <span>vs</span> {r.team2}
                            </strong>
                          ),
                        },
                        {
                          key: "winner",
                          label: "RESULT",
                          render: (_, r) =>
                            r.winner
                              ? r.winner +
                                " won" +
                                (r.result === "runs" || r.result === "wickets"
                                  ? " by " + r.margin + " " + r.result
                                  : "")
                              : r.result,
                        },
                        { key: "date", label: "DATE" },
                        { key: "venue", label: "VENUE" },
                      ]}
                    />
                    <div className="table-note">
                      Showing the latest {Math.min(100, matchRows.length)}{" "}
                      matches. Use filters or search to narrow results.
                    </div>
                  </Panel>
                </>
              )}
              {section === "batting" && (
                <>
                  <div className="stats four">
                    <Stat label="BATTERS" value={d.batters.length} />
                    <Stat
                      label="RUNS"
                      value={d.batters.reduce((a, p) => a + p.runs, 0)}
                    />
                    <Stat
                      label="FOURS"
                      value={d.batters.reduce((a, p) => a + p.fours, 0)}
                    />
                    <Stat
                      label="SIXES"
                      value={d.batters.reduce((a, p) => a + p.sixes, 0)}
                    />
                  </div>
                  <div className="section-kicker">PLAYER RANKINGS</div>
                  <Panel
                    title="Batting records"
                    sub="Strike rate = batter runs / balls faced × 100; wides excluded from balls"
                  >
                    <Table
                      rows={d.batters.slice(0, 100)}
                      columns={cols([
                        ["name", "BATTER"],
                        ["team", "TEAM"],
                        ["innings", "INN"],
                        ["runs", "RUNS"],
                        ["average", "AVG"],
                        ["strikeRate", "SR"],
                        ["fours", "4S"],
                        ["sixes", "6S"],
                        ["notOuts", "NO"],
                      ])}
                    />
                  </Panel>
                  <div className="section-kicker">SCORING PATTERNS</div>
                  <div className="grid two">
                    <Panel
                      title="Who scored the most runs?"
                      sub="Batter runs in selected matches"
                    >
                      <Chart data={d.batters.slice(0, 10)} x="name" y="runs" />
                    </Panel>
                    <Panel
                      title="Who hit the most sixes?"
                      sub="Sixes in selected matches"
                    >
                      <Chart
                        data={[...d.batters]
                          .sort((a, b) => b.sixes - a.sixes)
                          .slice(0, 10)}
                        x="name"
                        y="sixes"
                        color="#84adb1"
                      />
                    </Panel>
                  </div>
                </>
              )}
              {section === "bowling" && (
                <>
                  <div className="stats four">
                    <Stat label="BOWLERS" value={d.bowlers.length} />
                    <Stat
                      label="BOWLER WICKETS"
                      value={d.bowlers.reduce((a, p) => a + p.wickets, 0)}
                    />
                    <Stat
                      label="LEGAL BALLS"
                      value={d.bowlers.reduce((a, p) => a + p.balls, 0)}
                    />
                    <Stat
                      label="DOT BALLS"
                      value={d.bowlers.reduce((a, p) => a + p.dots, 0)}
                    />
                  </div>
                  <div className="section-kicker">PLAYER RANKINGS</div>
                  <Panel
                    title="Bowling records"
                    sub="Wides and no-balls count as runs; neither counts as a legal ball"
                  >
                    <div className="inline-control">
                      <label>
                        Minimum wickets{" "}
                        <input
                          type="number"
                          min="0"
                          max="300"
                          value={minWickets}
                          onChange={(e) =>
                            setMinWickets(Math.max(0, Number(e.target.value)))
                          }
                        />
                      </label>
                    </div>
                    <Table
                      rows={d.bowlers
                        .filter((p) => p.wickets >= minWickets)
                        .slice(0, 100)}
                      columns={cols([
                        ["name", "BOWLER"],
                        ["team", "TEAM"],
                        ["wickets", "WKTS"],
                        ["economy", "ECON"],
                        ["average", "AVG"],
                        ["strikeRate", "SR"],
                        ["overs", "OVERS"],
                        ["fourWicket", "4WI"],
                        ["fiveWicket", "5WI"],
                      ])}
                    />
                  </Panel>
                  <div className="section-kicker">
                    WICKET-TAKING AND CONTROL
                  </div>
                  <div className="grid two">
                    <Panel
                      title="Who took the most wickets?"
                      sub="Dismissals credited to the bowler"
                    >
                      <Chart
                        data={d.bowlers.slice(0, 10)}
                        x="name"
                        y="wickets"
                      />
                    </Panel>
                    <Panel
                      title="How does economy change by phase?"
                      sub="Runs conceded per six legal balls"
                    >
                      <Table
                        rows={d.bowlers
                          .filter(
                            (p) =>
                              p.powerplayBalls >= 200 && p.deathBalls >= 200,
                          )
                          .sort((a, b) => a.deathEconomy - b.deathEconomy)
                          .slice(0, 12)}
                        columns={cols([
                          ["name", "BOWLER"],
                          ["powerplayEconomy", "PP ECON"],
                          ["deathEconomy", "DEATH ECON"],
                        ])}
                      />
                    </Panel>
                  </div>
                </>
              )}
              {section === "teams" && (
                <>
                  <div className="stats four">
                    <Stat label="TEAMS" value={d.teams.length} />
                    <Stat label="TOTAL MATCHES" value={d.kpis.matches} />
                    <Stat
                      label="DECIDED"
                      value={d.outcomes.first + d.outcomes.chase}
                    />
                    <Stat label="SEASONS" value={d.kpis.seasons} />
                  </div>
                  <div className="grid two">
                    <Panel
                      title="Wins by team"
                      sub="Franchise names normalized across eras"
                    >
                      <Chart
                        data={d.teams
                          .slice(0, 10)
                          .map((x) => ({ ...x, team: short(x.team) }))}
                        x="team"
                        y="wins"
                      />
                    </Panel>
                    <Panel
                      title="Compare teams"
                      sub="Compare franchise records in the selected matches"
                    >
                      <div className="compare-controls">
                        <label>
                          Team A
                          <select
                            className="compare-select"
                            aria-label="First team to compare"
                            value={compare || d.teams[0]?.team || ""}
                            onChange={(e) => setCompare(e.target.value)}
                          >
                            {d.teams.map((t) => (
                              <option key={t.team}>{t.team}</option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Team B
                          <select
                            className="compare-select"
                            aria-label="Second team to compare"
                            value={
                              compareSecond ||
                              d.teams[1]?.team ||
                              d.teams[0]?.team ||
                              ""
                            }
                            onChange={(e) => setCompareSecond(e.target.value)}
                          >
                            {d.teams.map((t) => (
                              <option key={t.team}>{t.team}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="comparison">
                        {[
                          compare || d.teams[0]?.team,
                          compareSecond || d.teams[1]?.team,
                        ]
                          .filter(Boolean)
                          .map((name, i) => {
                            const t = d.teams.find(
                              (team) => team.team === name,
                            );
                            return (
                              t && (
                                <div key={i}>
                                  <h3>{t.team}</h3>
                                  <div>
                                    <span>Matches</span>
                                    <strong>{fmt(t.matches)}</strong>
                                  </div>
                                  <div>
                                    <span>Wins</span>
                                    <strong>{fmt(t.wins)}</strong>
                                  </div>
                                  <div>
                                    <span>Win rate</span>
                                    <strong>{t.winPct}%</strong>
                                  </div>
                                </div>
                              )
                            );
                          })}
                      </div>
                    </Panel>
                  </div>
                  <Panel
                    title="Team standings"
                    sub="Win rate uses all matches in the selected view"
                  >
                    <Table
                      rows={d.teams}
                      columns={cols([
                        ["team", "TEAM"],
                        ["matches", "MATCHES"],
                        ["wins", "WINS"],
                        ["losses", "NON-WINS"],
                        ["winPct", "WIN %"],
                        ["runs", "RUNS"],
                        ["wickets", "BOWLER WKTS"],
                      ])}
                    />
                  </Panel>
                </>
              )}
              {section === "seasons" && (
                <>
                  <div className="season-cards">
                    {o?.seasons.map((year) => {
                      const s = d.seasons.find((item) => item.season === year);
                      return (
                        <button
                          key={year}
                          onClick={() =>
                            set(
                              "season",
                              filters.season === String(year)
                                ? ""
                                : String(year),
                            )
                          }
                          className={
                            "season-card " +
                            (filters.season === String(year) ? "selected" : "")
                          }
                          aria-pressed={filters.season === String(year)}
                        >
                          <small>IPL SEASON</small>
                          <strong>{year}</strong>
                          <span>
                            {s ? `${s.matches} matches` : "View season"}{" "}
                            <ArrowRight size={15} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid two">
                    <Panel title="Runs by season" sub="Includes extras">
                      <Chart data={d.seasons} x="season" y="runs" kind="area" />
                    </Panel>
                    <Panel title="Wickets by season" sub="All dismissals">
                      <Chart
                        data={d.seasons}
                        x="season"
                        y="wickets"
                        kind="line"
                        color="#6dabb5"
                      />
                    </Panel>
                  </div>
                  <Panel
                    title="Season summary"
                    sub="Average runs per match includes both innings"
                  >
                    <Table
                      rows={d.seasons}
                      columns={cols([
                        ["season", "SEASON"],
                        ["matches", "MATCHES"],
                        ["runs", "RUNS"],
                        ["wickets", "WICKETS"],
                        ["runsPerMatch", "RUNS / MATCH"],
                      ])}
                    />
                  </Panel>
                </>
              )}
              {section === "players" && (
                <>
                  <div className="section-heading">
                    <div>
                      <h2>Player finder</h2>
                      <p>Search careers across batting and bowling records</p>
                    </div>
                    <div className="search">
                      <Search size={17} />
                      <input
                        aria-label="Search players"
                        placeholder="Search player name…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="section-kicker">
                    {search
                      ? "SEARCH RESULTS"
                      : "LEADING RUN SCORERS · SELECT A PLAYER"}
                  </div>
                  <div className="player-list">
                    {(search
                      ? (o?.players || [])
                          .filter((x) =>
                            x.toLowerCase().includes(search.toLowerCase()),
                          )
                          .slice(0, 30)
                      : d.batters.slice(0, 12).map((p) => p.name)
                    ).map((name) => (
                      <button
                        key={name}
                        onClick={() => set("player", name)}
                        className={filters.player === name ? "selected" : ""}
                      >
                        <span>{name}</span>
                        {!search && (
                          <small>
                            {fmt(
                              d.batters.find((p) => p.name === name)?.runs || 0,
                            )}{" "}
                            runs
                          </small>
                        )}
                        <ArrowRight size={15} />
                      </button>
                    ))}
                  </div>
                  {search &&
                    !(o?.players || []).some((x) =>
                      x.toLowerCase().includes(search.toLowerCase()),
                    ) && (
                      <div className="empty">
                        No player matches “{search}”. Try a shorter name.
                      </div>
                    )}
                  {filters.player && (
                    <div className="grid two">
                      <Panel title="Batting profile" sub={filters.player}>
                        {d.batters
                          .filter((p) => p.name === filters.player)
                          .map((p) => (
                            <div className="profile" key={p.name}>
                              <Stat label="RUNS" value={p.runs} />
                              <Stat label="AVERAGE" value={p.average} />
                              <Stat label="STRIKE RATE" value={p.strikeRate} />
                              <Stat label="INNINGS" value={p.innings} />
                            </div>
                          ))}
                      </Panel>
                      <Panel title="Bowling profile" sub={filters.player}>
                        {d.bowlers
                          .filter((p) => p.name === filters.player)
                          .map((p) => (
                            <div className="profile" key={p.name}>
                              <Stat label="WICKETS" value={p.wickets} />
                              <Stat label="ECONOMY" value={p.economy} />
                              <Stat label="AVERAGE" value={p.average} />
                              <Stat label="OVERS" value={p.overs} />
                            </div>
                          ))}
                      </Panel>
                    </div>
                  )}
                </>
              )}
              {section === "methodology" && (
                <>
                  <div className="stats four">
                    <Stat label="MATCHES" value={1095} />
                    <Stat label="DELIVERIES" value={260920} />
                    <Stat label="SEASONS" value={17} />
                    <Stat label="DATA END" value="2024" />
                  </div>
                  <div className="method-grid">
                    {[
                      [
                        "01",
                        "Source & scope",
                        "IPL match and ball-by-ball CSV data supplied with this repository, covering 2008–2024. Records are preprocessed into compact match summaries at build preparation time.",
                      ],
                      [
                        "02",
                        "Season normalization",
                        "The match date determines the displayed IPL year. Source labels such as 2007/08 and 2009/10 otherwise misclassify the 2008 and 2010 tournaments.",
                      ],
                      [
                        "03",
                        "Team identity",
                        "Historical names are mapped to canonical franchise names for joins and filters. Delhi Daredevils becomes Delhi Capitals; Kings XI Punjab becomes Punjab Kings.",
                      ],
                      [
                        "04",
                        "Batting order",
                        "The first batting team is derived from inning 1 delivery records. Decided matches only are used for batting-first and chasing percentages. Ties and no-results are counted separately.",
                      ],
                      [
                        "05",
                        "Bowling calculations",
                        "Economy is bowler runs conceded divided by legal balls, multiplied by six. Wides and no-balls add runs but do not add legal balls. Byes and leg-byes are excluded from bowler runs. Run-outs and retirements are excluded from bowler wickets.",
                      ],
                      [
                        "06",
                        "Quality checks",
                        "The preparation script validates source row counts, match IDs, unique delivery keys, season coverage, team joins, innings structure, and run arithmetic. It stops on inconsistent inputs.",
                      ],
                      [
                        "07",
                        "Known limits",
                        "This is a fixed historical snapshot ending in 2024. Franchise renames are combined; the original match file remains unchanged. Super overs appear in delivery totals where present. Match outcomes and player awards come from the supplied source.",
                      ],
                    ].map(([n, h, p]) => (
                      <div className="method" key={n}>
                        <span>{n}</span>
                        <h3>{h}</h3>
                        <p>{p}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {section === "matches" && (
                <Panel
                  title="Venue activity"
                  sub="Most used grounds in selected matches"
                >
                  <Table
                    rows={d.venues.slice(0, 12)}
                    columns={cols([
                      ["venue", "VENUE"],
                      ["matches", "MATCHES"],
                      ["tossWinPct", "TOSS WINNER WON %"],
                    ])}
                  />
                </Panel>
              )}
              {section === "teams" && (
                <Panel
                  title="Team performance by season"
                  sub="Choose a team in the global filter to focus this view"
                >
                  <Chart
                    data={d.teamSeasons
                      .filter(
                        (t) => t.team === (filters.team || d.teams[0]?.team),
                      )
                      .sort((a, b) => a.season - b.season)}
                    kind="line"
                    x="season"
                    y="winPct"
                    color="#6dabb5"
                  />
                </Panel>
              )}
              {section === "players" && filters.player && (
                <div className="grid two">
                  <Panel title="Runs by season" sub={filters.player}>
                    <Chart
                      data={d.playerSeasons}
                      kind="area"
                      x="season"
                      y="runs"
                    />
                  </Panel>
                  <Panel title="Wickets by season" sub={filters.player}>
                    <Chart
                      data={d.playerSeasons}
                      kind="line"
                      x="season"
                      y="wickets"
                      color="#6dabb5"
                    />
                  </Panel>
                </div>
              )}
            </>
          )}
        </main>
        <footer>
          IPL ANALYTICS <span>·</span> 2008–2024 <span>·</span> Built from
          verified ball-by-ball data
        </footer>
      </div>
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Match details"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              aria-label="Close match details"
              onClick={() => setSelected(null)}
            >
              <X size={20} />
            </button>
            <div className="eyebrow">MATCH DETAILS · {selected.date}</div>
            <h2>
              {selected.team1} <span>vs</span> {selected.team2}
            </h2>
            <p>
              {selected.venue}, {selected.city}
            </p>
            <div className="match-result">
              {selected.winner
                ? selected.winner +
                  " won" +
                  (selected.result === "runs" || selected.result === "wickets"
                    ? " by " + selected.margin + " " + selected.result
                    : "")
                : selected.result}
            </div>
            <div className="innings">
              {selected.innings.map((i: AnyRow) => (
                <div key={i.number}>
                  <span>
                    INNINGS {i.number} · {i.team}
                  </span>
                  <strong>
                    {i.runs}/{i.wickets}
                  </strong>
                </div>
              ))}
            </div>
            <div className="match-meta">
              <p>
                <b>Toss</b> {selected.tossWinner} chose to{" "}
                {selected.tossDecision}
              </p>
              <p>
                <b>Player of the match</b>{" "}
                {selected.playerOfMatch || "Not recorded"}
              </p>
              <p>
                <b>Top scorers</b>{" "}
                {selected.topBatters
                  .map((x: AnyRow) => x.name + " " + x.runs)
                  .join(" · ")}
              </p>
              <p>
                <b>Top bowlers</b>{" "}
                {selected.topBowlers
                  .map((x: AnyRow) => x.name + " " + x.wickets)
                  .join(" · ")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
