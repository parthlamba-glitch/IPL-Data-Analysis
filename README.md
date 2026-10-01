# IPL Analytics

A responsive IPL analytics application built with Next.js, React, TypeScript, Recharts, and a validated data preparation pipeline. It covers **1,095 matches and 260,920 deliveries from 2008–2024**.

## Quick start

Requires Node.js 20.9 or newer. The prepared production data is checked in, so Python is only needed when rebuilding it from the CSVs.

```bash
npm install
npm run dev
```

Open the URL printed by Next.js. To verify a production build:

```bash
npm run build
npm run start
```

No environment variables, localhost endpoints, external database, or Windows-specific paths are required. The site loads its own `/api/analytics` route.

## Architecture

```text
Resources/*.csv              Source match and delivery data
scripts/prepare_data.py      Normalize, validate, and aggregate once
data/ipl.json                Prepared match-level analytics (committed)
lib/analytics.ts             Central filtered query and derived statistics
app/api/analytics/route.ts   Cached server-side analytics endpoint
components/dashboard.tsx     Responsive charts, filters, tables, and explorer
app/[section]/page.tsx       Matches, batting, bowling, teams, seasons,
                            players, and methodology routes
```

The server reads the compact prepared data once per process. Filters are applied centrally before KPIs and charts are derived. Raw ball-by-ball data is never sent to the browser. The dashboard and all pages share season, team, player, and venue filters. Match results can also be filtered on the match page.

## Rebuild data

Python 3.10+ standard library is sufficient:

```bash
python scripts/prepare_data.py
```

The script reads `Resources/corrected_data.csv` and `Resources/deliveries.csv`, validates row counts, IDs, unique delivery keys, season coverage, team joins, innings, and run arithmetic, then writes `data/ipl.json`. It verifies that `Resources/merged_data.csv` has the expected row count. The production app uses the prepared JSON and does not require the CSV files at runtime.

Season is derived from the match date to correct source labels such as `2007/08` and `2009/10`. Historical team aliases are mapped to canonical franchise names. Batting-first results use the actual first innings. Bowling economy includes wides and no-balls as runs but excludes both from legal balls.

## Vercel deployment

1. Push this repository, including `data/ipl.json`, to GitHub.
2. Import it into Vercel as a **Next.js** project with the repository root as the root directory.
3. Use the default `npm install` install command and `npm run build` build command.
4. No environment variables or custom Vercel configuration are needed.
5. Deploy. The API route and static pages are included in the same deployment.

If the source CSVs change, run `python scripts/prepare_data.py`, review the validation output, and commit the updated `data/ipl.json` before deploying.

## Data and limitations

The dataset is a fixed snapshot ending in 2024. Team renames are combined under current canonical names for analysis; this does not preserve historical branding on charts. Super-over deliveries appear in delivery totals where the source includes them. Batting averages use runs divided by recorded dismissals. Bowling wickets exclude run-outs and non-bowler dismissals. The match page displays the latest 100 results after filtering; its search operates on the filtered match list. See the in-app Methodology page for details.

The source Streamlit implementation remains in `app.py` for reference and is not used by the Vercel app. Two notebooks currently exist in `notebooks/`; other notebook files and `Resources/matches.csv` are locally deleted in the pre-existing working tree. They are not required for production. Existing deletions were left untouched.
