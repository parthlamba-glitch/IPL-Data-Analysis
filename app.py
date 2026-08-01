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