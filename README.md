# 🏏 IPL Analytics

> An interactive analytics platform for exploring the evolution of the Indian Premier League through **1,095 matches and 260,920 ball-by-ball deliveries from 2008–2024**.

**IPL Analytics** transforms raw IPL match and delivery data into an interactive web application for exploring matches, teams, players, batting, bowling, and season-level trends.

The project originally began as a Python and Streamlit-based data analysis project and has evolved into a **Vercel-ready Next.js analytics application** with a validated data preparation pipeline, centralized analytics layer, and responsive frontend.

---

## 🌐 Live Demo

**Live Application:** [IPL Analytics](https://ipl-data-analysis-omega.vercel.app/)

---

## 📸 Preview

### Dashboard

![IPL Analytics Dashboard](docs/dashboard.png)

### Match Explorer

![Match Explorer](docs/matches.png)

### Batting Analytics

![Batting Analytics](docs/batting.png)

### Bowling Analytics

![Bowling Analytics](docs/bowling.png)

> Screenshots can be added to the `docs/` directory after the final UI is deployed.

---

## 📌 Project Overview

The Indian Premier League has accumulated thousands of matches and hundreds of thousands of individual deliveries since its first season.

Raw ball-by-ball data contains a huge amount of information, but extracting meaningful patterns from it requires careful preprocessing, statistical aggregation, validation, and visualization.

This project turns that data into an interactive analytics experience where users can explore questions such as:

- How has IPL scoring changed over time?
- Which teams have performed consistently?
- Who are the leading run scorers?
- Which bowlers combine wickets with efficiency?
- How does batting first compare with chasing?
- How have players performed across different seasons?
- How do statistics change when filtering by season, team, player, or venue?

The application combines **data engineering, statistical analysis, data visualization, frontend development, and deployment** into a single project.

---

## 📊 Dataset

The current dataset covers IPL matches from **2008 to 2024**.

| Metric | Value |
|---|---:|
| Matches | 1,095 |
| Deliveries | 260,920 |
| Seasons | 17 |
| Coverage | 2008–2024 |

The analysis is based on match-level and ball-by-ball IPL data.

Instead of sending all **260,920 delivery records** to the browser, the production application uses a prepared analytical representation of the dataset.

---

## ✨ Features

### 🏠 Dashboard

The dashboard provides a high-level overview of IPL history.

It includes:

- Tournament statistics
- Match and delivery counts
- Season-level scoring trends
- Batting-first vs chasing analysis
- Team performance
- Top batting performers
- Top bowling performers
- Interactive analytical filters

The dashboard provides an overview first and allows users to progressively explore individual areas of IPL history.

---

### 🏆 Match Explorer

Explore the IPL match archive using:

- Match search
- Season filtering
- Team filtering
- Player filtering
- Venue filtering
- Date filtering
- Match results
- Innings information

Individual match views provide available information such as:

- Teams
- Date
- Venue
- Toss
- Winner
- Winning margin
- Innings scores
- Batting performances
- Bowling performances

The Match Explorer is designed around quickly finding and inspecting individual matches without sending the entire ball-by-ball dataset to the client.

---

### 🏏 Batting Analytics

Explore batting performance throughout IPL history.

Available metrics include:

- Runs
- Batting average
- Strike rate
- Innings
- Fours
- Sixes

The interface supports filtering by:

- Season
- Team
- Player

Visualizations and tables provide different ways to compare batting performance.

---

### 🎯 Bowling Analytics

Explore bowling performance using:

- Wickets
- Economy
- Bowling average
- Bowling strike rate
- Overs
- Runs conceded
- Powerplay economy
- Death-over economy

The bowling analysis also includes a configurable minimum-wicket threshold so comparisons can be restricted to bowlers with a meaningful number of wickets.

---

### 🏆 Team Analytics

Explore franchise performance throughout IPL history.

Team analysis includes:

- Matches
- Wins
- Losses
- Win percentage
- Runs
- Wickets
- Season performance
- Team comparisons

Historical franchise aliases are normalized for analytical consistency.

For example:

```text
Delhi Daredevils → Delhi Capitals
Kings XI Punjab  → Punjab Kings
```

This allows historical records to be grouped consistently when calculating team-level statistics.

---

### 📅 Season Explorer

Explore IPL seasons chronologically from:

```text
2008
2009
2010
...
2024
```

Season analysis includes available:

- Matches
- Teams
- Total runs
- Total wickets
- Average score
- Highest score
- Lowest score
- Season trends

The season pipeline specifically corrects inconsistent source labels so that each IPL season is represented by the year in which it was played.

---

### 👤 Player Analytics

Search and explore individual players through:

- Career statistics
- Season performance
- Batting statistics
- Bowling statistics where applicable
- Match-level information

The player interface is designed for statistical exploration and comparison.

---

### 📖 Methodology

The application includes a dedicated methodology section explaining how the data is processed and how important statistics are calculated.

Topics include:

- Data preparation
- Season normalization
- Team normalization
- Batting-order determination
- Bowling economy
- Filtering
- Statistical definitions
- Dataset limitations

This provides transparency into how the statistics displayed by the application are produced.

---

## 🧹 Data Quality & Validation

A major part of this project involved identifying and correcting issues in the source data rather than simply visualizing it.

The preparation pipeline performs validation and normalization before data reaches the production application.

### Season Normalization

The source contains season labels such as:

```text
2007/08
2009/10
```

Using the first four characters would incorrectly classify:

```text
2008 → 2007
2010 → 2009
```

For example, the original match data classified all **58 matches played in 2008 as season 2007** and all **60 matches played in 2010 as season 2009**.

The preparation pipeline instead derives the IPL season from the actual match date.

The resulting season range is:

```text
2008
2009
2010
...
2024
```

This ensures that:

- 2008 appears as 2008
- 2010 appears as its own season
- the incorrect 2007 season does not appear in the application

---

### Team Name Normalization

Historical team names differ between parts of the source data.

Historical names are therefore mapped to canonical franchise names before analytical calculations are performed.

Examples include:

```text
Delhi Daredevils → Delhi Capitals
Kings XI Punjab  → Punjab Kings
```

This prevents historical naming differences from affecting:

- Team filters
- Dataset joins
- Team comparisons
- Season analysis
- Team-level statistics

---

### Batting Order

The original analysis used the first team listed in the match data as a proxy for the team batting first.

That assumption is not reliable.

The current pipeline determines the actual batting team from the first innings in the delivery data.

This information is then used for batting-first and chasing analysis.

---

### Batting First vs Chasing

The application calculates match outcomes using the actual batting order.

The analysis distinguishes between:

- Batting-first wins
- Chasing wins
- Other match outcomes where applicable

The calculation does not assume that `team1` automatically batted first.

---

### Bowling Economy

Bowling economy distinguishes between **runs conceded** and **legal deliveries**.

Wides and no-balls contribute to runs conceded but do not count as legal deliveries.

Economy is therefore calculated using the equivalent of:

```text
Economy = Runs Conceded / Legal Balls × 6
```

This prevents illegal deliveries from incorrectly affecting the number of balls used in economy calculations.

---

### Bowling Wickets

Bowling wicket statistics exclude dismissals that are not credited to the bowler, such as:

- Run-outs
- Other non-bowler dismissals

This keeps bowler wicket totals consistent with standard cricket scoring conventions.

---

### Bowling Wicket Threshold

The bowling analysis includes a configurable minimum-wicket threshold.

The displayed threshold and the underlying calculation use the same value, preventing discrepancies between the interface and the analysis.

---

### Centralized Filtering

The application uses a centralized analytics layer.

The general flow is:

```text
User Filters
     │
     ▼
Filtered Data
     │
     ▼
Derived Statistics
     │
     ▼
KPIs / Charts / Tables
```

This ensures that relevant filters such as:

- Season
- Team
- Player
- Venue

are applied consistently before statistics are calculated.

---

## 🏗️ Architecture

The application separates data preparation, analytics, API access, and presentation.

```text
                    Source CSV Data
                           │
                           ▼
                ┌─────────────────────┐
                │  prepare_data.py    │
                │                     │
                │  • Normalize        │
                │  • Validate         │
                │  • Aggregate        │
                └──────────┬──────────┘
                           │
                           ▼
                    data/ipl.json
                           │
                           ▼
                ┌─────────────────────┐
                │  Analytics Layer    │
                │  lib/analytics.ts   │
                │                     │
                │  • Filtering        │
                │  • KPIs             │
                │  • Statistics       │
                └──────────┬──────────┘
                           │
                           ▼
                   /api/analytics
                           │
                           ▼
                ┌─────────────────────┐
                │  Next.js Frontend   │
                │                     │
                │  • Dashboard        │
                │  • Matches          │
                │  • Batting          │
                │  • Bowling          │
                │  • Teams            │
                │  • Seasons          │
                │  • Players          │
                │  • Methodology      │
                └─────────────────────┘
```

The raw ball-by-ball dataset is not repeatedly processed in the browser.

Instead, the project prepares the data once and exposes the analytical results required by the frontend.

---

## ⚡ Performance Architecture

The raw dataset contains **260,920 deliveries**.

Sending the complete delivery dataset to the browser would be unnecessary for most dashboard operations.

The application therefore uses a prepared data pipeline:

```text
Raw CSV Files
      │
      ▼
Validation
      │
      ▼
Normalization
      │
      ▼
Aggregation
      │
      ▼
Prepared JSON
      │
      ▼
Server-side Analytics
      │
      ▼
Frontend
```

This provides several benefits:

- Smaller browser payloads
- Faster initial rendering
- Less client-side computation
- Centralized statistical logic
- Easier validation
- Simpler frontend components

The browser receives prepared match-level and analytical information instead of the complete raw delivery dataset.

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15**
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Recharts**
- **Lucide React**

### Data Processing

- **Python**
- CSV
- JSON
- Custom validation pipeline
- Custom preprocessing and aggregation

### Analytics

- TypeScript
- Server-side analytics route
- Centralized filtering
- Derived statistical calculations

### Development

- ESLint
- Prettier
- npm

### Deployment

- **Vercel**
- **GitHub**

---

## 📁 Project Structure

```text
IPL-Data-Analysis/
│
├── app/
│   ├── api/
│   │   └── analytics/
│   │       └── route.ts
│   │
│   ├── matches/
│   ├── batting/
│   ├── bowling/
│   ├── teams/
│   ├── seasons/
│   ├── players/
│   ├── methodology/
│   └── ...
│
├── components/
│   └── dashboard.tsx
│
├── lib/
│   └── analytics.ts
│
├── scripts/
│   └── prepare_data.py
│
├── data/
│   └── ipl.json
│
├── Resources/
│   ├── corrected_data.csv
│   ├── deliveries.csv
│   └── merged_data.csv
│
├── notebooks/
│
├── app.py
├── package.json
├── tsconfig.json
├── eslint.config.*
└── README.md
```

### Important Files

| File | Purpose |
|---|---|
| `scripts/prepare_data.py` | Validates, normalizes, and prepares source data |
| `data/ipl.json` | Prepared production dataset |
| `lib/analytics.ts` | Central filtering and statistical logic |
| `app/api/analytics/route.ts` | Server-side analytics endpoint |
| `components/dashboard.tsx` | Dashboard UI and analytical components |
| `app.py` | Original Streamlit implementation kept for reference |

The original Streamlit application is not used by the production Next.js deployment.

---

## 🚀 Getting Started

### Requirements

You need:

- **Node.js 20.9+**
- **npm**

Python **3.10+** is only required if you want to rebuild the prepared dataset.

Python is not required to run the production web application.

### 1. Clone the Repository

```bash
git clone https://github.com/parthlamba-glitch/IPL-Data-Analysis.git
cd IPL-Data-Analysis
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Open the URL displayed by Next.js, typically:

```text
http://localhost:3000
```

---

## ⚙️ Available Scripts

### Development

```bash
npm run dev
```

Starts the Next.js development server.

### Production Build

```bash
npm run build
```

Creates an optimized production build.

### Production Server

```bash
npm run start
```

Runs the production build locally.

### Lint

```bash
npm run lint
```

Runs ESLint across the project.

### Prepare Data

```bash
npm run data:prepare
```

Equivalent to:

```bash
python scripts/prepare_data.py
```

This rebuilds the prepared analytical dataset.

---

## 🔄 Data Preparation

The production application uses:

```text
data/ipl.json
```

as its prepared dataset.

The preparation pipeline is implemented in:

```text
scripts/prepare_data.py
```

It reads the source IPL data, including:

```text
Resources/corrected_data.csv
Resources/deliveries.csv
```

and verifies the expected relationship with the available merged data.

The preparation pipeline:

1. Reads the source datasets
2. Validates match and delivery relationships
3. Checks row counts
4. Validates unique delivery keys
5. Normalizes season labels
6. Normalizes historical team names
7. Determines actual batting order
8. Validates innings information
9. Validates run arithmetic
10. Calculates required analytical fields
11. Writes the prepared production dataset

Run:

```bash
python scripts/prepare_data.py
```

The production application does not need to run this process on every request.

---

## 🔍 Validation

The current application has been verified using:

```bash
npm install
python scripts/prepare_data.py
npm run build
npm run lint
npm run dev
```

The application has also been checked for:

- Working application routes
- Filtered API results
- Prepared data loading
- Desktop layout
- Mobile layout
- Production build compatibility
- Correct season normalization
- Correct team normalization
- Batting-order calculation
- Bowling economy handling
- Consistent analytical filters

The production application does not require:

- A local Python runtime for normal operation
- An external database
- Windows-specific paths
- Localhost API dependencies
- Environment variables

---

## ☁️ Vercel Deployment

The application is designed to run as a standard Next.js project on Vercel.

### 1. Push the Repository to GitHub

Make sure the prepared dataset is committed:

```text
data/ipl.json
```

### 2. Import the Repository into Vercel

Create a new project on Vercel and connect the GitHub repository.

Use the repository root as the project root.

### 3. Build Configuration

Install command:

```bash
npm install
```

Build command:

```bash
npm run build
```

No environment variables are currently required.

### 4. Deploy

Vercel will build the Next.js application and deploy the frontend and server-side analytics route together.

---

## 🔁 Updating the Dataset

If the source CSV files change, rebuild the prepared dataset:

```bash
python scripts/prepare_data.py
```

Review the validation output and then commit the updated:

```text
data/ipl.json
```

Push the change to GitHub and redeploy the application.

---

## 📈 Analytical Approach

The project separates the analytical workflow into four major stages:

```text
Raw Data
    │
    ▼
Validation & Normalization
    │
    ▼
Analytical Aggregation
    │
    ▼
Interactive Visualization
```

This separation allows the frontend to focus on:

- Presentation
- Filtering
- Interaction
- Visualization

while statistical calculations remain centralized.

---

## 🎨 Design Principles

The frontend follows several core principles.

### Data First

The visual design is intended to make the data easier to understand rather than overwhelm it with decoration.

### Clear Hierarchy

Important statistics and analytical questions receive stronger visual emphasis than secondary information.

### Consistent Filtering

Filters are applied through a shared analytics layer instead of being independently implemented by individual charts.

### Progressive Exploration

Users can begin with the overview and progressively move into deeper analysis:

```text
Dashboard
    │
    ├── Teams
    ├── Seasons
    ├── Players
    └── Matches
         │
         ▼
    Detailed Statistics
```

### Responsive Interface

The application is designed for:

- Desktop
- Tablet
- Mobile

---

## ⚠️ Data Limitations

### Fixed Dataset

The current dataset is a fixed snapshot ending in **2024**.

The application does not automatically update when new IPL seasons are played.

### Historical Franchise Names

Historical franchise names are normalized to canonical names for analytical grouping.

This prioritizes statistical consistency over preserving historical branding in every visualization.

### Super Overs

Super-over deliveries are included in delivery totals where they are present in the source data.

### Batting Averages

Batting averages are calculated using runs and recorded dismissals available in the dataset.

### Bowling Wickets

Bowling wicket statistics exclude dismissals that are not credited to the bowler, such as run-outs and other non-bowler dismissals.

### Match Explorer

The Match Explorer displays the latest 100 results after filtering.

Search operates on the filtered match list.

---

## 🕰️ Project Evolution

This project originally began as a Python-based IPL data analysis project.

The original implementation used:

- Python
- Pandas
- NumPy
- Matplotlib
- Seaborn
- Streamlit
- Jupyter notebooks

The initial version focused primarily on exploratory data analysis and interactive visualizations.

During development, several data-quality and architectural issues were identified, including:

- Incorrect season labels
- Inconsistent historical team names
- Incorrect batting-first assumptions
- Inconsistent filtering between analytical pages
- Incorrect handling of wides in bowling economy
- Mismatch between displayed and applied bowling wicket thresholds

The project was subsequently restructured into a **Next.js-based interactive analytics platform**.

The new architecture introduced:

- Validated data preparation
- Normalized analytical data
- Centralized filtering
- Server-side analytics
- Prepared production datasets
- Responsive React UI
- Vercel deployment support

The original Streamlit implementation remains in `app.py` as a reference and is not used by the production application.

---

## 👨‍💻 Author

**Parth**

B.Tech Information Technology

GitHub: [github.com/parthlamba-glitch](https://github.com/parthlamba-glitch)

---

## ⭐ Support

If you find this project interesting or useful, consider giving the repository a star.
