

import numpy as np
import pandas as pd


def daily_ingredient_consumption(orders: pd.DataFrame, menu: dict) -> pd.DataFrame:
    orders = orders.copy()
    orders["date"] = orders["timestamp"].dt.date

    records = []
    for _, row in orders.iterrows():
        recipe = menu[row["item"]]["ingredients"]
        for ing, per_unit in recipe.items():
            records.append((row["date"], ing, per_unit * row["quantity"]))

    df = pd.DataFrame(records, columns=["date", "ingredient", "used"])
    daily = df.groupby(["date", "ingredient"])["used"].sum().reset_index()
    daily["date"] = pd.to_datetime(daily["date"])
    return daily.sort_values(["ingredient", "date"])


def restock_prediction(daily_consumption: pd.DataFrame, current_stock: dict,
                        lead_time_days: dict, service_z: float = 1.65) -> pd.DataFrame:
    results = []
    for ing, stock0 in current_stock.items():
        hist = daily_consumption[daily_consumption["ingredient"] == ing]["used"]
        if len(hist) < 3:
            continue
        mu, sigma = hist.mean(), hist.std()
        L = lead_time_days.get(ing, 1)

        rop = mu * L + service_z * sigma * np.sqrt(L)
        days_to_stockout = stock0 / mu if mu > 0 else np.inf
        days_to_rop = (stock0 - rop) / mu if mu > 0 else np.inf

        results.append({
            "ingredient": ing,
            "current_stock": stock0,
            "avg_daily_use": round(mu, 3),
            "demand_std": round(sigma, 3),
            "lead_time_days": L,
            "reorder_point": round(rop, 2),
            "days_until_stockout": round(days_to_stockout, 1),
            "days_until_reorder_needed": round(max(days_to_rop, 0), 1),
            "restock_by_date_offset_days": round(max(days_to_rop, 0), 1),
        })

    return pd.DataFrame(results).sort_values("days_until_reorder_needed")
