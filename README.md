# 🏏 IPL Data Analysis Dashboard

An interactive data analysis dashboard exploring the evolution of the Indian Premier League (IPL) from **2008 to 2024** using ball-by-ball match data. The project combines exploratory data analysis with an interactive Streamlit dashboard to uncover insights into team performance, batting, bowling, and season-wise trends.

🔗 **Live Dashboard:** *Coming Soon*  
> 

---

## 📌 Project Overview

This project analyzes over 16 seasons of IPL cricket using match-level and ball-by-ball datasets. The objective is to transform raw cricket data into meaningful insights through statistical analysis and interactive visualizations.

The project consists of:

- 📓 Five Jupyter notebooks documenting the complete analysis
- 📊 An interactive Streamlit dashboard
- 📈 Professional visualizations using Matplotlib and Seaborn

---

## ✨ Dashboard Features

### 🏠 Overview
- Key tournament statistics
- Team wins overview
- Toss decision distribution

### 🏆 Match Analysis
- Team-wise win distribution
- Toss impact on match results
- Venue-wise toss decisions
- Win margin distributions
- Player of the Match analysis

### 🏏 Batting Analysis
- Top run scorers
- Strike rate leaders
- Death-over specialists
- Batting consistency analysis

### 🎯 Bowling Analysis
- Top wicket takers
- Economy rate leaders
- Bowling average
- Bowling strike rate
- Dot ball specialists
- Dismissal type analysis
- Powerplay vs Death-over economy comparison

### 📈 Season Trends
- Powerplay scoring evolution
- Average first innings score
- Boundary percentage over seasons
- Toss impact across seasons
- Batting first vs chasing success

---

## 📊 Dataset

**Source:** Kaggle IPL Dataset (2008–2024)

The project uses three datasets:

| File | Description |
|------|-------------|
| `matches.csv` | Match-level information |
| `deliveries.csv` | Ball-by-ball data |
| `merged_data.csv` | Combined dataset used for analysis |

---

## 🛠️ Tech Stack

- Python
- Pandas
- NumPy
- Matplotlib
- Seaborn
- Streamlit

---

## 📁 Project Structure

```text
IPL-Data-Analysis/
│
├── Resources/
│   ├── matches.csv
│   ├── deliveries.csv
│   ├── merged_data.csv
│   └── corrected_data.csv
│
├── notebooks/
│   ├── 1_data_cleaning.ipynb
│   ├── 2_match_analysis.ipynb
│   ├── 3_batting_analysis.ipynb
│   ├── 4_bowling_analysis.ipynb
│   └── 5_season_trends.ipynb
│
├── charts/
│
├── app.py
├── requirements.txt
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/IPL-Data-Analysis.git
```

### 2. Navigate to the project directory

```bash
cd IPL-Data-Analysis
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Streamlit dashboard

```bash
streamlit run app.py
```

---

## 📷 Dashboard Preview

### 🏠 Overview

> <img width="1916" height="944" alt="image" src="https://github.com/user-attachments/assets/35622527-385b-44cf-9a57-51f059b10294" />


---

### 🏆 Match Analysis

> <img width="1919" height="930" alt="image" src="https://github.com/user-attachments/assets/62e8476e-c3fa-46ed-8a3d-dfb698bc10ec" />


---

### 🏏 Batting Analysis

> <img width="1919" height="933" alt="image" src="https://github.com/user-attachments/assets/a8201507-7fb0-47bd-a8b4-4f09b6249dc5" />


---

### 🎯 Bowling Analysis

> <img width="1919" height="929" alt="image" src="https://github.com/user-attachments/assets/cd72dc3a-08ea-48ad-aeac-33579a3ef056" />


---

### 📈 Season Trends

> <img width="1919" height="927" alt="image" src="https://github.com/user-attachments/assets/fff88a39-40e8-46fe-8ec3-0b8322f6904d" />


---

## 🔍 Key Insights

- Batting aggression has steadily increased across IPL seasons.
- Average first innings scores have risen significantly over time.
- Toss decisions vary considerably across venues.
- Modern IPL cricket relies more heavily on boundary scoring than earlier seasons.
- Bowling performance varies noticeably across different phases of an innings.

---

## 📌 Future Improvements

- Player vs Player comparison
- Venue-wise dashboards
- Predictive analytics using Machine Learning
- Win probability visualizations
- Advanced filtering and search options

---

## 👨‍💻 Author

**Parth**

GitHub: https://github.com/parthlamba-glitch

---

## ⭐ If you found this project interesting, consider giving it a star!
