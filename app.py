import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# ----------------------------
# Page Configuration
# ----------------------------
st.set_page_config(
    page_title="IPL Data Analysis Dashboard",
    page_icon="🏏",
    layout="wide"
)

sns.set_theme(style="whitegrid")

# ----------------------------
# Load Data
# ----------------------------
@st.cache_data
def load_data():
    matches = pd.read_csv("Resources/corrected_data.csv")
    deliveries = pd.read_csv("Resources/deliveries.csv")
    merged = pd.read_csv("Resources/merged_data.csv")

    # Standardize season format
    matches["season"] = (
        matches["season"]
        .astype(str)
        .str[:4]
        .astype(int)
    )

    merged["season"] = (
        merged["season"]
        .astype(str)
        .str[:4]
        .astype(int)
    )

    return matches, deliveries, merged


matches, deliveries, merged = load_data()


# Matches with a valid result
valid_matches = matches[matches["winner"].notna()].copy()

# Whether the toss winner also won the match
valid_matches["toss_won_match"] = (
    valid_matches["toss_winner"] == valid_matches["winner"]
)

#Block 2
# ----------------------------
# Sidebar
# ----------------------------
st.sidebar.title("🏏 IPL Dashboard")
st.sidebar.markdown("Explore IPL data from **2008–2024**")

page = st.sidebar.radio(
    "Navigation",
    [
        "🏠 Overview",
        "🏟️ Match Analysis",
        "🏏 Batting Analysis",
        "🎯 Bowling Analysis",
        "📈 Season Trends"
    ]
)
#Season Filter
st.sidebar.markdown("---")
st.sidebar.subheader("Filters")

season_options = ["All"] + sorted(matches["season"].unique().tolist())

selected_season = st.sidebar.selectbox(
    "Season",
    season_options
)

#Team Filter
teams = sorted(matches["winner"].dropna().unique())

team_options = ["All"] + teams

selected_team = st.sidebar.selectbox(
    "Team",
    team_options
)

#Creating filtered datsets
filtered_matches = matches.copy()
filtered_deliveries = deliveries.copy()
filtered_merged = merged.copy()

#Applying season filter
if selected_season != "All":

    filtered_matches = filtered_matches[
        filtered_matches["season"] == selected_season
    ]

    match_ids = filtered_matches["id"]

    filtered_deliveries = filtered_deliveries[
        filtered_deliveries["match_id"].isin(match_ids)
    ]

    filtered_merged = filtered_merged[
        filtered_merged["season"] == selected_season
    ]

#Applying team filter
if selected_team != "All":

    filtered_matches = filtered_matches[
        (filtered_matches["team1"] == selected_team) |
        (filtered_matches["team2"] == selected_team)
    ]

    match_ids = filtered_matches["id"]

    filtered_deliveries = filtered_deliveries[
        filtered_deliveries["match_id"].isin(match_ids)
    ]

    filtered_merged = filtered_merged[
        (filtered_merged["batting_team"] == selected_team) |
        (filtered_merged["bowling_team"] == selected_team)
    ]
DEBUG = False
if DEBUG:
    with st.expander("🔧 Debug: View Filtered Data"):
        st.write("Filtered Matches")
        st.dataframe(filtered_matches)

        st.write("Filtered Deliveries")
        st.dataframe(filtered_deliveries)

        st.write("Filtered Merged Data")
        st.dataframe(filtered_merged)

#Block 3
# =====================================================
# OVERVIEW PAGE
# =====================================================

if page == "🏠 Overview":

    st.title("🏏 IPL Data Analysis Dashboard")

    st.markdown("""
    Explore the evolution of the Indian Premier League through
    **match**, **batting**, **bowling**, and **seasonal trend**
    analysis using ball-by-ball data from **2008–2024**.
    """)

    st.divider()
    st.caption(
        "🏏 IPL Data Analysis Dashboard | Built with Python, Pandas, Matplotlib, Seaborn & Streamlit"
    )

#KPI Cards
    col1, col2, col3, col4 = st.columns(4)

    col1.metric(
        "Matches",
        f"{len(filtered_matches):,}"
    )

    col2.metric(
        "Runs",
        f"{filtered_deliveries['total_runs'].sum():,}"
    )

    col3.metric(
        "Wickets",
        f"{int(filtered_deliveries['is_wicket'].sum()):,}"
    )

    col4.metric(
        "Seasons",
        filtered_matches["season"].nunique()
    )

        #Two column layout
    left, right = st.columns(2)

    #Left chart
    with left:
        st.subheader("Top Teams by Wins")

        wins = (
            filtered_matches["winner"]
            .value_counts()
            .head(10)
        )

        fig, ax = plt.subplots(figsize=(7, 5))

        ax = sns.barplot(
            x=wins.values,
            y=wins.index,
            palette="viridis",
            ax=ax
        )
        for container in ax.containers:
            ax.bar_label(container, fontsize=10, padding=2)


        ax.set_xlabel("Wins")
        ax.set_ylabel("")

        st.pyplot(fig)

    #Right Chart
        with right:

            st.subheader("Toss Decisions")

            toss = (
                filtered_matches["toss_decision"]
                .value_counts()
            )

            fig, ax = plt.subplots(figsize=(6,6))

            ax.pie(
                toss.values,
                labels=toss.index,
                autopct="%1.1f%%",
                startangle=90
            )

            ax.axis("equal")

            st.pyplot(fig)

    #About section
        st.divider()

        st.subheader("About the Dataset")

        st.markdown("""
        - **Dataset:** IPL Ball-by-Ball Dataset (2008–2024)
        - **Source:** Kaggle
        - **Matches:** Match-level and ball-by-ball records
        - **Analyses Included:**
          - Match Analysis
          - Batting Analysis
          - Bowling Analysis
          - Season Trends
            """)

#BLOCK 4
# =====================================================
# MATCH ANALYSIS
# =====================================================

elif page == "🏟️ Match Analysis":
    valid = filtered_matches[filtered_matches['winner'].notna()].copy()
    st.title("🏟️ Match Analysis")
    st.markdown("""
        Analyze team performances across IPL history through win distributions,
        toss impact, venue-based trends, and victory margins.
        Discover how match outcomes vary across different conditions.
        """)

    analysis = st.selectbox(
        "Select Analysis",
        [
            "Team Wins",
            "Toss by Venue",
            "Win Margin Distribution",
            "Player of the Match"
        ]
    )

    st.divider()
    st.caption(
        "🏏 IPL Data Analysis Dashboard | Built with Python, Pandas, Matplotlib, Seaborn & Streamlit"
    )
#Option 1
    if analysis == "Team Wins":

        st.subheader("Total Wins by Team")

        wins = (
            filtered_matches["winner"]
            .value_counts()
            .sort_values(ascending=False)
        )

        fig, ax = plt.subplots(figsize=(10,6))

        sns.barplot(
            x=wins.values,
            y=wins.index,
            palette="viridis",
            ax=ax
        )

        ax.set_xlabel("Wins")
        ax.set_ylabel("")

        st.pyplot(fig)

#Option 2
    elif analysis == "Toss by Venue":
        valid = filtered_matches[filtered_matches['winner'].notna()].copy()
        valid['toss_won_match'] = valid['toss_winner'] == valid['winner']
        venue_counts = valid['venue'].value_counts()
        top_venues = venue_counts[venue_counts >= 20].index

        venue_toss = (valid[valid['venue'].isin(top_venues)]
        .groupby(['venue', 'toss_decision'])['toss_won_match']
        .mean()
        .mul(100)
        .round(1)
        .unstack()
        .loc[top_venues]
        )

        fig, ax = plt.subplots(figsize=(10, 8))
        sns.heatmap(venue_toss, annot=True, fmt='.1f',
                    cmap='RdYlGn', center=50, vmin=30, vmax=70,
                    linewidths=0.5, annot_kws={"fontsize": 10})
        ax.set_title("Match Win Percentage After Winning the Toss\nby Venue and Toss Decision")
        ax.set_xlabel("Toss Decision")
        ax.set_ylabel("Venue")
        st.pyplot(fig)

#Option 3
    elif analysis == "Win Margin Distribution":

        st.subheader("Win Margin Distribution")

        runs_wins = filtered_matches[
            filtered_matches['result'] == 'runs'
            ]['result_margin']

        wicket_wins = filtered_matches[
            filtered_matches['result'] == 'wickets'
            ]['result_margin']

        fig, axes = plt.subplots(1, 2, figsize=(14, 5))

        axes[0].hist(runs_wins, bins=20, color='steelblue', edgecolor='white')
        axes[0].set_title('Wins by Runs')
        axes[0].set_xlabel('Runs')

        axes[1].hist(wicket_wins, bins=10, color='coral', edgecolor='white')
        axes[1].set_title('Wins by Wickets')
        axes[1].set_xlabel('Wickets')

        plt.tight_layout()

        st.pyplot(fig)

        top5 = (
            filtered_matches
            .nlargest(5, 'result_margin')[
                ['season', 'team1', 'team2', 'winner', 'result', 'result_margin']
            ]
        )

        st.subheader("Top 5 Largest Victory Margins")
        st.dataframe(top5, use_container_width=True)

    #Option 4
    elif analysis == "Player of the Match":
        potm = valid['player_of_match'].value_counts().head(20)
        fig, ax = plt.subplots(figsize=(10, 8))
        ax = sns.barplot(x=potm.values, y=potm.index, palette='magma', hue=potm.index, legend=False)
        for container in ax.containers:
            ax.bar_label(container, fontsize=10, padding = 2)
        ax.set_title('Most Player of the Match Awards (All Time)')
        ax.set_xlabel('Awards')
        plt.tight_layout()
        st.pyplot(fig)

#Block 5
# =====================================================
# BATTING ANALYSIS
# =====================================================

elif page == "🏏 Batting Analysis":

    st.title("🏏 Batting Analysis")

    analysis = st.selectbox(
        "Select Analysis",
        [
            "Top Run Scorers",
            "Strike Rate Leaders",
            "Death Over Specialists",
            "Batting Consistency"
        ]
    )
    st.markdown("""
    Explore the performances of IPL's leading batters.
    Compare career statistics, strike rates, scoring patterns,
    and performance across different phases of an innings.
    """)

    st.divider()
    st.caption(
        "🏏 IPL Data Analysis Dashboard | Built with Python, Pandas, Matplotlib, Seaborn & Streamlit"
    )

    runs = deliveries.groupby('batter')['batsman_runs'].sum().sort_values(ascending=False).head(10)
    #Top run scorers
    if analysis == "Top Run Scorers":
        fig, ax = plt.subplots(figsize=(10, 6))
        ax = sns.barplot(x=runs.values, y=runs.index, palette='viridis', hue=runs.index, legend=False)
        for container in ax.containers:
            ax.bar_label(container, fontsize=11, padding=4)
        ax.set_title(
            "Top 10 IPL Run Scorers (2008–2024)",
            fontsize=18,
            weight='bold',
            pad=15
        )
        sns.despine(left=True, bottom=True)
        ax.set_xlabel('Total Runs')
        plt.tight_layout()
        st.pyplot(fig)

    #Strike rate leaders
    elif analysis == "Strike Rate Leaders":
        legal_deliveries = deliveries[deliveries['extras_type'] != 'wides']
        balls_faced = legal_deliveries.groupby('batter')['ball'].count()
        total_runs = deliveries.groupby('batter')['batsman_runs'].sum()

        sr = (total_runs / balls_faced * 100).round(2)
        qualified = sr[balls_faced >= 500].sort_values(ascending=False).head(10)

        fig, ax = plt.subplots(figsize=(10, 6))
        ax = sns.barplot(x=qualified.values, y=qualified.index, palette='mako', hue=qualified.index, legend=False)
        for container in ax.containers:
            ax.bar_label(container, fontsize=11, padding=4)
        ax.set_title('Highest Strike Rate (Min 500 Balls Faced)')
        ax.set_xlabel('Strike Rate')
        plt.tight_layout()
        st.pyplot(fig)

    #Death over specialists
    elif analysis == "Death Over Specialists":
        death_overs = deliveries[
            (deliveries['over'] >= 16) & (deliveries['extras_type'] != 'wides')]  # overs 17-20 are index 16-19

        death_runs = death_overs.groupby('batter')['batsman_runs'].sum()
        death_balls = death_overs.groupby('batter')['ball'].count()
        dismissal_types = ['caught', 'bowled', 'lbw', 'stumped', 'caught and bowled', 'hit wicket']
        death_dismissals = (
            death_overs[death_overs['dismissal_kind'].isin(dismissal_types)].groupby('player_dismissed').size())

        death_avg = (death_runs / death_dismissals.replace(0, pd.NA)).round(2)
        death_sr = (death_runs / death_balls * 100).round(2)

        finishers = pd.DataFrame(
            {'runs': death_runs, 'average': death_avg, 'strike_rate': death_sr, "balls": death_balls})
        finishers = finishers[finishers["balls"] >= 100]
        finishers = finishers.sort_values(["strike_rate", "runs", "average"], ascending=[False, False, False]).head(10)

        fig, ax = plt.subplots(figsize=(10, 6))
        sns.scatterplot(
            data=finishers,
            x="runs",
            y="strike_rate",
            s=150
        )
        for batter in finishers.index:
            plt.text(finishers.loc[batter, "runs"] + 5, finishers.loc[batter, "strike_rate"], batter, fontsize=8)

        ax.set_title("Death-Over Runs vs Strike Rate")
        ax.set_xlabel("Runs")
        ax.set_ylabel("Strike Rate")

        plt.tight_layout()
        st.pyplot(fig)

    #Batting consistency
    elif analysis == "Batting Consistency":
        # Top 10 run scorers
        top10_batters = runs.index
        consistency = []
        for player in top10_batters:
            scores = (deliveries[deliveries['batter'] == player].groupby('match_id')['batsman_runs'].sum())
            mean = scores.mean()
            std = scores.std()
            consistency.append({
                "batter": player,
                "innings": scores.count(),
                "mean": round(mean, 2),
                "std_dev": round(std, 2),
                "cv": round(std / mean, 3)
            })
        consistency_df = (
            pd.DataFrame(consistency)
            .sort_values("cv")
            .reset_index(drop=True)
        )

        fig, ax = plt.subplots(figsize=(10, 6))

        sns.barplot(data=consistency_df, x="cv", y="batter", palette="flare", hue=consistency_df.index)
        # Annotate CV values
        for i, value in enumerate(consistency_df["cv"]):
            plt.text(value + 0.01, i, f"{value:.2f}", va="center")

        ax.set_xlabel("Coefficient of Variation (Lower = More Consistent)")
        ax.set_ylabel("")
        ax.set_title("Most Consistent IPL Batters (Top 10 Run Scorers)")
        plt.xlim(0, consistency_df["cv"].max() + 0.1)

        plt.tight_layout()
        st.pyplot(fig)

#Block 6
# =====================================================
# BOWLING ANALYSIS
# =====================================================
elif page == "🎯 Bowling Analysis":
    st.title("🎯 Bowling Analysis")

    analysis = st.selectbox(
        "Select Analysis",
        [
            "Top Wicket Takers",
            "Economy Leaders",
            "Dot Ball Specialists",
            "Best Bowling Average",
            "Dismissal Types",
            "Powerplay vs Death Economy"
        ]
    )
    st.markdown("""
    Analyze the league's top bowlers through wickets,
    economy rates, bowling averages, strike rates,
    and other key performance indicators.
    """)

    st.divider()
    legal_deliveries = deliveries[deliveries['extras_type'] != 'wides'] #Ignore
    balls_bowled = (legal_deliveries.groupby('bowler').size()) #Ignore
    non_bowler_dismissals = ['run out', 'retired hurt', 'obstructing the field', 'retired out'] #Ignore
    wickets_data = deliveries[
        (deliveries['is_wicket'] == 1) & (~deliveries['dismissal_kind'].isin(non_bowler_dismissals))] #Ignore
    deliveries['bowler_runs'] = deliveries['batsman_runs']

    deliveries.loc[deliveries['extras_type'].isin(['wides', 'noballs']), 'bowler_runs'] \
        += deliveries.loc[deliveries['extras_type'].isin(['wides', 'noballs']), 'extra_runs']

    #Top wicket takers
    if analysis == "Top Wicket Takers":
        # Dismissals that are not credited to the bowler
        non_bowler_dismissals = ['run out', 'retired hurt', 'obstructing the field', 'retired out']

        # Filter wickets credited to the bowler
        wickets_data = deliveries[(deliveries['is_wicket'] == 1) & (~deliveries['dismissal_kind'].isin(non_bowler_dismissals))]
        top_wickets = (wickets_data.groupby('bowler').size().sort_values(ascending=False).head(10))

        # Visualisation
        fig, ax = plt.subplots(figsize=(10, 6))

        ax = sns.barplot(x=top_wickets.values, y=top_wickets.index, palette="viridis", hue=top_wickets.index)
        for container in ax.containers:
            ax.bar_label(container, fontsize=10, padding=2)

        ax.set_title("Top 10 IPL Wicket-Takers (2008–2024)")
        ax.set_xlabel("Wickets")
        ax.set_ylabel("Bowler")

        plt.tight_layout()
        st.pyplot(fig)

    #Economy leaders
    elif analysis == "Economy Leaders":
        # Legal deliveries(excluding wides)
        legal_deliveries = deliveries[deliveries['extras_type'] != 'wides']

        # Legal balls bowled
        balls_bowled = (legal_deliveries.groupby('bowler').size())

        # Runs conceded by the bowler
        deliveries['bowler_runs'] = deliveries['batsman_runs']

        deliveries.loc[deliveries['extras_type'].isin(['wides', 'noballs']), 'bowler_runs'] \
            += deliveries.loc[deliveries['extras_type'].isin(['wides', 'noballs']), 'extra_runs']

        runs_conceded = deliveries.groupby('bowler')['bowler_runs'].sum()

        # Economy
        economy = (runs_conceded / balls_bowled * 6).round(2)
        MIN_BALLS = 1000
        qualified_economy = (economy[balls_bowled >= MIN_BALLS].sort_values().head(11))
        qualified_economy = qualified_economy.drop('R Sharma', errors='ignore')  # Dropping the name R Sharma
        # display(qualified_economy.to_frame(name="Economy"))

        # Visualisation
        fig, ax = plt.subplots(figsize=(10, 6))

        ax = sns.barplot(x=qualified_economy.values, y=qualified_economy.index, palette="rocket",
                         hue=qualified_economy.index)
        for container in ax.containers: \
                ax.bar_label(container, fontsize=10, padding=2)

        ax.set_title("Best Economy Rate (Minimum 1000 Legal Deliveries)")
        ax.set_xlabel("Economy Rate (Runs per Over)")
        ax.set_ylabel("Bowler")

        plt.tight_layout()
        st.pyplot(fig)

    #Dot ball specialists
    elif analysis == "Dot Ball Specialists":
        # Dot balls(legal deliveries with zero runs scored)
        dot_balls = legal_deliveries[legal_deliveries["total_runs"] == 0]

        # Dot ball count
        dot_ball_count = dot_balls.groupby("bowler").size()

        # Dot ball percentage
        dot_ball_percentage = (dot_ball_count / balls_bowled * 100).round(2)

        MIN_BALLS = 1000
        qualified_dot_pct = (dot_ball_percentage[balls_bowled >= MIN_BALLS]
                             .drop('R Sharma', errors='ignore').sort_values(ascending=False).head(10))
        # display(qualified_dot_pct.to_frame(name='Dot Ball %'))

        # Visualisation
        fig , ax = plt.subplots(figsize=(13, 7))
        sns.set_style("ticks")
        sns.barplot(x=qualified_dot_pct.values, y=qualified_dot_pct.index, palette='crest', hue=qualified_dot_pct.index)

        for i, value in enumerate(qualified_dot_pct.values):
            plt.text(
                value + 0.2,
                i,
                f'{value:.1f}%',
                va='center'
            )

        ax.set_title('Highest Dot Ball Percentage (Minimum 1000 Legal Deliveries)')
        ax.set_xlabel('Dot Ball Percentage (%)')
        ax.set_ylabel('Bowler')

        plt.tight_layout()
        st.pyplot(fig)

    #Best Bowling average
    elif analysis == "Best Bowling Average":
        # Wickets credited to the bowler
        bowler_wickets = (wickets_data.groupby('bowler').size())
        runs_conceded = deliveries.groupby('bowler')['bowler_runs'].sum()
        bowling_average = (runs_conceded / bowler_wickets).round(2)

        MIN_WICKETS = 30

        qualified_average = (
            bowling_average.loc[bowler_wickets[bowler_wickets >= MIN_WICKETS].index]
            .drop('R Sharma', errors='ignore').sort_values().head(10))

        # Visualisation
        fig, ax = plt.subplots(figsize=(13, 7))

        sns.barplot(x=qualified_average.values, y=qualified_average.index, palette='flare', hue=qualified_average.index)

        for i, value in enumerate(qualified_average.values): plt.text(value + 0.2, i, f'{value:.2f}', va='center')

        ax.set_title('Best Bowling Average (Minimum 20 Wickets)')
        ax.set_xlabel('Runs per Wicket')
        ax.set_ylabel('Bowler')

        plt.tight_layout()
        st.pyplot(fig)

    #Dismissal types
    elif analysis == "Dismissal Types":

        dismissal_counts = deliveries['dismissal_kind'].value_counts()
        dismissal_percentage = (dismissal_counts / dismissal_counts.sum() * 100).round(1)

        # Categories contributing less than 1%
        threshold = 1
        others = dismissal_percentage[dismissal_percentage < threshold].sum()
        dismissal_percentage = dismissal_percentage[dismissal_percentage >= threshold]
        dismissal_percentage['Others'] = others
        dismissal_percentage = dismissal_percentage.round(1)
        '''dismissal_percentage'''
        # Visualisation
        fig, ax = plt.subplots(figsize=(10, 6))
        colors = sns.color_palette('Spectral')[0:len(dismissal_percentage)]
        plt.pie(dismissal_percentage, autopct='%1.1f%%', startangle=90, wedgeprops={'edgecolor': 'black'},
                colors=colors)

        plt.legend(
            dismissal_percentage.index, title="Dismissal Type",
            loc="center left", bbox_to_anchor=(1, 0.5))

        ax.set_title('Distribution of Bowling Dismissal Types in IPL')

        plt.tight_layout()
        st.pyplot(fig)

    #Powerplay vs Death
    elif analysis == "Powerplay vs Death Economy":
        # Powerplay (Overs 1-6)
        powerplay = deliveries[(deliveries['over'] <= 5) & (deliveries['extras_type'] != 'wides')
                             & (deliveries['bowler'] != 'R Sharma')].copy()

        # Death Overs (Overs 17-20)
        death = deliveries[(deliveries['over'] >= 16) & (deliveries['extras_type'] != 'wides')
                         & (deliveries['bowler'] != 'R Sharma')].copy()

        # Runs conceded
        for df in [powerplay, death]:
            df['bowler_runs'] = df['batsman_runs']
            mask = df['extras_type'].isin(['wides', 'noballs'])
            df.loc[mask, 'bowler_runs'] += df.loc[mask, 'extra_runs']

        # Economy calculation
        # Powerplay
        pp_runs = powerplay.groupby('bowler')['bowler_runs'].sum()
        pp_balls = powerplay.groupby('bowler').size()
        pp_economy = (pp_runs / pp_balls * 6)

        # Death
        death_runs = death.groupby('bowler')['bowler_runs'].sum()
        death_balls = death.groupby('bowler').size()
        death_economy = (death_runs / death_balls * 6)

        # Qualification & Combine
        MIN_BALLS = 200

        pp_economy = pp_economy[pp_balls >= MIN_BALLS]
        death_economy = death_economy[death_balls >= MIN_BALLS]

        phase_comparison = pd.DataFrame({
            'Powerplay Economy': pp_economy,
            'Death Economy': death_economy
        }).dropna()
        # ----------------------------------------------------------------------------------------------------------------------------
        # Visualisation

        fig, ax = plt.subplots(figsize=(8, 7))
        sns.scatterplot(data=phase_comparison, x='Powerplay Economy', y='Death Economy', s=75)

        # Label each point
        for bowler, row in phase_comparison.iterrows():
            plt.text(row['Powerplay Economy'] + 0.03, row['Death Economy'] + 0.03, bowler, fontsize=8)

        ax.set_xlabel('Powerplay Economy')
        ax.set_ylabel('Death Overs Economy')
        ax.set_title('Powerplay vs Death Overs Economy')

        plt.grid(alpha=0.3)
        plt.tight_layout()

        st.pyplot(fig)

# =====================================================
# SEASON TRENDS
# =====================================================

elif page == "📈 Season Trends":

    st.title("📈 Season Trends")

    analysis = st.selectbox(
        "Select Analysis",
        [
            "Powerplay Scoring Evolution",
            "Average First Innings Score",
            "Boundary Percentage",
            "Toss Impact Over Time",
            "Batting First vs Chasing"
        ]
    )
    st.markdown("""
    Track how the IPL has evolved over time by exploring season-wise scoring trends,
    batting aggression, toss influence, and changes in match dynamics from 2008 to 2024.
    """)

    st.divider()
    st.caption(
        "🏏 IPL Data Analysis Dashboard | Built with Python, Pandas, Matplotlib, Seaborn & Streamlit"
    )
    merged_full = deliveries.merge(
        matches[['id', 'season']], left_on='match_id', right_on='id'
    )
    #Powerplay Scoring Evolution
    if analysis == "Powerplay Scoring Evolution":
        powerplay = merged_full[merged_full['over'] <= 5]
        pp_innings = (
            powerplay.groupby(['season', 'match_id', 'inning'])['total_runs'].sum().reset_index(name='powerplay_runs'))

        pp_by_season = (pp_innings.groupby('season')['powerplay_runs'].mean().round(2))
        pp_run_rate = (pp_by_season / 6).round(2)

        # Visualisation
        fig, ax = plt.subplots(figsize=(12, 6))
        sns.lineplot(x=pp_run_rate.index, y=pp_run_rate.values, marker='o', linewidth=2.5)

        ax.set_title('Average Powerplay Run Rate by Season')
        ax.set_xlabel('Season')
        ax.set_ylabel('Runs per Over')
        ax.set_xticks(pp_run_rate.index)

        plt.tight_layout()
        st.pyplot(fig)

    #Average First Innings Score
    elif analysis == "Average First Innings Score":
        first_innings = (deliveries[deliveries['inning'] == 1].groupby('match_id')['total_runs'].sum().reset_index(
            name='first_innings_score'))
        first_innings = first_innings.merge(matches[['id', 'season']], left_on='match_id', right_on='id')
        avg_score = (first_innings.groupby('season')['first_innings_score'].mean().round(1))

        # Visualisation
        fig, ax = plt.subplots(figsize=(12, 6))
        plt.plot(avg_score.index, avg_score.values, color='lightblue', linewidth=3)
        plt.scatter(avg_score.index[:-1], avg_score.values[:-1], s=60, color='blue')
        plt.scatter(avg_score.index[-1], avg_score.values[-1], s=180, color='red', zorder=5)
        ax.set_title('Average First Innings Score by Season')
        st.pyplot(fig)

    #Boundary Percentage
    elif analysis == "Boundary Percentage":
        # Exclude wides as they are not legal deliveries
        legal_deliveries = merged_full[merged_full['extras_type'] != 'wides']

        # Deliveries that resulted in a boundary
        boundary_balls = legal_deliveries[legal_deliveries['batsman_runs'].isin([4, 6])]

        # Percentage of legal deliveries that were boundaries
        boundary_pct = (
                boundary_balls.groupby('season').size()
                / legal_deliveries.groupby('season').size() * 100).round(2)
        # ---------------------------------------------------------------
        # Visualisation

        fig, ax = plt.subplots(figsize=(12, 6))

        plt.plot(boundary_pct.index, boundary_pct.values, linewidth=2.8, marker='D', markersize=7)
        plt.fill_between(boundary_pct.index, boundary_pct.values, alpha=0.15)

        ax.set_title('Boundary Percentage by Season', fontsize=16, weight='bold')
        ax.set_xlabel('Season')
        ax.set_ylabel('Boundary Balls (%)')

        ax.set_xticks(boundary_pct.index)

        plt.grid(axis='y', alpha=0.3)

        plt.tight_layout()
        st.pyplot(fig)

    #Toss Impact Over time
    elif analysis == "Toss Impact Over Time":
        # Exclude matches with no result
        valid_matches = matches[matches['winner'].notna()].copy()
        # Check if the toss winner also won the match
        valid_matches['toss_won_match'] = (valid_matches['toss_winner'] == valid_matches['winner'])

        # Calculate season-wise percentage
        toss_impact = (valid_matches.groupby('season')['toss_won_match'].mean().mul(100).round(1))
        # --------------------------------------------------------------------------------------
        # Visualisation
        fig, ax = plt.subplots(figsize=(12, 6))

        plt.plot(toss_impact.index, toss_impact.values, linewidth=2.5, marker='o', markersize=7)

        # Benchmark: 50% means toss provides no clear advantage
        plt.axhline(50, linestyle='--', linewidth=1.5, alpha=0.7, label='50% (No Clear Toss Advantage)')

        # Highlight the latest season
        plt.scatter(toss_impact.index[-1], toss_impact.values[-1], s=120, zorder=5, label='2024')

        ax.set_title('Toss Winner Also Won the Match (%) by Season', fontsize=16, weight='bold')
        ax.set_xlabel('Season')
        ax.set_ylabel('Percentage (%)')

        ax.set_xticks(toss_impact.index)
        plt.legend()

        plt.tight_layout()
        st.pyplot(fig)

    #Batting First vs Chasing
    elif analysis == "Batting First vs Chasing":
        # Exclude matches with no result
        valid_matches = matches[matches['winner'].notna()].copy()

        # Identify whether the winner batted first
        valid_matches['batting_first_won'] = (
                valid_matches['winner'] == valid_matches['team1']
        )
        batting_first = (valid_matches.groupby('season')['batting_first_won'].mean().mul(100).round(1))
        chasing = (100 - batting_first).round(1)
        # -----------------------------------------------------------------------------------
        # Visualisation
        fig, ax = plt.subplots(figsize=(12, 6))

        plt.plot(batting_first.index, batting_first.values, marker='o', linewidth=2.5, label='Batting First')
        plt.plot(chasing.index, chasing.values, marker='s', linewidth=2.5, label='Chasing')
        plt.axhline(50, linestyle='--', alpha=0.5)
        ax.set_title('Batting First vs Chasing Win Percentage by Season', fontsize=16, weight='bold')
        ax.set_xlabel('Season')
        ax.set_ylabel('Win Percentage (%)')

        plt.legend()

        plt.tight_layout()
        st.pyplot(fig)