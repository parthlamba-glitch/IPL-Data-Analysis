export type Batter = {
  name: string;
  team: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  dismissals: number;
};
export type Bowler = {
  name: string;
  team: string;
  runs: number;
  balls: number;
  wickets: number;
  dots: number;
  powerplayRuns: number;
  powerplayBalls: number;
  deathRuns: number;
  deathBalls: number;
};
export type Inning = {
  number: number;
  team: string;
  runs: number;
  wickets: number;
};
export type Match = {
  id: string;
  season: number;
  date: string;
  venue: string;
  city: string;
  team1: string;
  team2: string;
  winner: string;
  result: string;
  margin: number;
  tossWinner: string;
  tossDecision: string;
  playerOfMatch: string;
  firstBattingTeam: string;
  innings: Inning[];
  batting: Batter[];
  bowling: Bowler[];
  runs: number;
  wickets: number;
  deliveries: number;
};
export type Filters = {
  season?: number;
  team?: string;
  player?: string;
  venue?: string;
  result?: string;
  from?: string;
  to?: string;
};
