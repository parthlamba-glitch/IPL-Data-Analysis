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

