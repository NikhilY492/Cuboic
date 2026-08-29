

import numpy as np
import pandas as pd


def hourly_demand_curve(hourly: pd.DataFrame) -> pd.DataFrame:
    curve = hourly.groupby(["is_weekend", "hour"]).agg(
        avg_revenue=("revenue", "mean"),
        avg_orders=("n_orders", "mean"),
        std_orders=("n_orders", "std"),
    ).reset_index()

    curve["orders_z"] = curve.groupby("is_weekend")["avg_orders"].transform(
        lambda s: (s - s.mean()) / s.std()
    )
    return curve.sort_values(["is_weekend", "hour"]).reset_index(drop=True)


def classify_hours(curve: pd.DataFrame, peak_z: float = 0.75, slow_z: float = -0.75) -> pd.DataFrame:
    curve = curve.copy()
    curve["label"] = np.select(
        [curve["orders_z"] >= peak_z, curve["orders_z"] <= slow_z],
        ["peak", "slow"],
        default="normal",
    )
    return curve


def summarize(curve: pd.DataFrame) -> dict:
    out = {}
    for is_weekend, name in [(0, "weekday"), (1, "weekend")]:
        sub = curve[curve["is_weekend"] == is_weekend]
        out[name] = {
            "peak_hours": sub.loc[sub["label"] == "peak", "hour"].tolist(),
            "slow_hours": sub.loc[sub["label"] == "slow", "hour"].tolist(),
        }
    return out
