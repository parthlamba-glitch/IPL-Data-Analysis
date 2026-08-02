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

filtered_matches

filtered_deliveries

filtered_merged

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