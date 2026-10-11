# 📈 Cuboic Demand & Revenue Forecasting Model

> Machine learning forecasting and predictive analytics package for Onomex restaurant operations. Predicts daily revenue, identifies hourly rush peaks, forecasts raw ingredient restock requirements, and supports cold-start demand estimation for new menu items.

---

## 📋 Table of Contents

- [Overview & Model Architecture](#-overview--model-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Virtual Environment](#-installation--virtual-environment)
- [Running the Pipeline](#-running-the-pipeline)
- [Outputs & Visualizations](#-outputs--visualizations)
- [Package Structure](#-package-structure)

---

## 💡 Overview & Model Architecture

This analytics module powers predictive insights for restaurant managers and POS inventory:

1. **Daily Revenue Forecasting (`models/revenue_forecast.py`)**:
   - Trains a `GradientBoostingRegressor` using historical daily revenue data.
   - Features engineered include day index, cyclical day-of-week sine/cosine encodings, weekend indicators, 1-day lag, 7-day lag, and 7-day rolling averages.
   - Produces backtested Mean Absolute Error (MAE) and Mean Absolute Percentage Error (MAPE).
   - Generates multi-day forward revenue forecasts.

2. **Hourly Demand & Peak Hours (`models/peak_hours.py`)**:
   - Aggregates orders by hour of day and day-of-week.
   - Classifies weekday and weekend hours into **Peak**, **Normal**, and **Slow** demand phases to assist in staff scheduling and robot battery recharging planning.

3. **Ingredient Restock Prediction (`models/ingredient_restock.py`)**:
   - Maps menu items to their constituent ingredient consumption rates.
   - Projects raw inventory depletion rates to generate scheduled restock purchase recommendations before stockouts occur.

4. **Cold-Start Menu Extrapolation (`models/extrapolation.py`)**:
   - Estimates demand trajectory for newly introduced dishes based on similar category items and customer purchase affinity.

---

## 📦 Prerequisites

- **Python**: `3.9` to `3.12`
- **pip** and Python `venv` package

---

## 🚀 Installation & Virtual Environment

1. **Navigate to the Directory**:
   ```bash
   cd onomex_desktop/cuboic_demand_model
   ```

2. **Create and Activate Virtual Environment**:
   ```bash
   python -m venv venv

   # On Linux/macOS:
   source venv/bin/activate
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

---

## ⚡ Running the Pipeline

To run the complete data generation, model training, and forecasting pipeline:

```bash
cd cuboic_demand_model
python main.py
```

### Sample Terminal Output:
```text
1. Loading order data
2. Building daily features + training revenue model...
   Backtest MAE: Rs 420 | MAPE: 4.8%
   Next 7 days forecast:
         date      revenue
   2026-05-01  18450.00
   2026-05-02  21300.00
   ...

3. Estimating hourly demand curve...
   Weekday peak hours: [12, 13, 19, 20, 21]
   Weekday slow hours: [15, 16, 17]
   Weekend peak hours: [13, 14, 19, 20, 21, 22]

4. Predicting ingredient restock...
   Generated restock schedule in outputs/restock_plan.csv
```

---

## 📊 Outputs & Visualizations

Running `main.py` writes generated CSVs and Matplotlib plots into the `outputs/` directory:
- `outputs/forecast_next_7_days.csv`: Forward revenue predictions
- `outputs/hourly_demand.png`: Visual plot of hourly customer demand curves
- `outputs/restock_plan.csv`: Suggested purchase quantities per ingredient

---

## 📁 Package Structure

```
cuboic_demand_model/
├── cuboic_demand_model/
│   ├── data/                 # Synthetic generator and historical order ingestion
│   ├── models/
│   │   ├── revenue_forecast.py  # GradientBoosting daily revenue regressor
│   │   ├── peak_hours.py        # Hourly clustering and peak classification
│   │   ├── ingredient_restock.py# Recipe ingredient consumption projector
│   │   └── extrapolation.py     # Cold-start new dish demand estimator
│   ├── features.py           # Cyclical and lag feature transformers
│   ├── main.py               # Main execution and pipeline orchestration
│   └── outputs/              # Generated plots, metrics, and forecast CSVs
├── requirements.txt          # Python dependencies (numpy, pandas, scikit-learn, matplotlib)
└── README.md                 # Setup guide and usage instructions
```
