

import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error


FEATURES = ["day_idx", "dow_sin", "dow_cos", "is_weekend",
            "revenue_lag1", "revenue_lag7", "revenue_roll7"]


def train_revenue_model(daily: pd.DataFrame):
    df = daily.dropna(subset=FEATURES + ["revenue"]).copy()
    split = int(len(df) * 0.85)
    train, test = df.iloc[:split], df.iloc[split:]

    model = GradientBoostingRegressor(
        n_estimators=300, max_depth=3, learning_rate=0.05,
        subsample=0.8, random_state=42,
    )
    model.fit(train[FEATURES], train["revenue"])

    preds = model.predict(test[FEATURES])
    mae = mean_absolute_error(test["revenue"], preds)
    mape = float(np.mean(np.abs((test["revenue"] - preds) / test["revenue"])) * 100)

    return model, {"mae": mae, "mape_pct": mape,
                    "test_dates": test["date"].tolist(),
                    "test_actual": test["revenue"].tolist(),
                    "test_pred": preds.tolist()}


def forecast_next_days(model, daily: pd.DataFrame, n_days: int = 7) -> pd.DataFrame:

    history = daily.copy()
    future_rows = []
    last_date = history["date"].max()

    for step in range(1, n_days + 1):
        date = last_date + pd.Timedelta(days=step)
        dow = date.dayofweek
        row = {
            "date": date,
            "day_idx": history["day_idx"].max() + step,
            "dow": dow,
            "is_weekend": int(dow >= 5),
            "dow_sin": np.sin(2 * np.pi * dow / 7),
            "dow_cos": np.cos(2 * np.pi * dow / 7),
            "revenue_lag1": history["revenue"].iloc[-1],
            "revenue_lag7": history["revenue"].iloc[-7] if len(history) >= 7 else history["revenue"].mean(),
            "revenue_roll7": history["revenue"].iloc[-7:].mean(),
        }
        pred = model.predict(pd.DataFrame([row])[FEATURES])[0]
        row["revenue"] = pred
        future_rows.append(row)
        history = pd.concat([history, pd.DataFrame([row])], ignore_index=True)

    return pd.DataFrame(future_rows)
