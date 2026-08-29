
import numpy as np
import pandas as pd


def add_cyclical(df: pd.DataFrame, col: str, period: int) -> pd.DataFrame:
    df[f"{col}_sin"] = np.sin(2 * np.pi * df[col] / period)
    df[f"{col}_cos"] = np.cos(2 * np.pi * df[col] / period)
    return df


def build_daily_table(orders: pd.DataFrame) -> pd.DataFrame:
    orders = orders.copy()
    orders["revenue"] = orders["quantity"] * orders["unit_price"]
    orders["date"] = orders["timestamp"].dt.date

    daily = orders.groupby("date").agg(
        revenue=("revenue", "sum"),
        n_orders=("revenue", "size"),
    ).reset_index()
    daily["date"] = pd.to_datetime(daily["date"])
    daily = daily.sort_values("date").reset_index(drop=True)

    daily["dow"] = daily["date"].dt.dayofweek
    daily["is_weekend"] = (daily["dow"] >= 5).astype(int)
    daily["day_idx"] = np.arange(len(daily))  

    daily = add_cyclical(daily, "dow", 7)

    
    daily["revenue_lag1"] = daily["revenue"].shift(1)
    daily["revenue_lag7"] = daily["revenue"].shift(7)
    daily["revenue_roll7"] = daily["revenue"].shift(1).rolling(7).mean()

    return daily


def build_hourly_table(orders: pd.DataFrame) -> pd.DataFrame:
    orders = orders.copy()
    orders["revenue"] = orders["quantity"] * orders["unit_price"]
    orders["hour"] = orders["timestamp"].dt.hour
    orders["dow"] = orders["timestamp"].dt.dayofweek
    orders["date"] = orders["timestamp"].dt.date

    hourly = orders.groupby(["date", "hour"]).agg(
        revenue=("revenue", "sum"),
        n_orders=("revenue", "size"),
    ).reset_index()
    hourly["dow"] = pd.to_datetime(hourly["date"]).dt.dayofweek
    hourly["is_weekend"] = (hourly["dow"] >= 5).astype(int)
    return hourly
