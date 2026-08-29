
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

sys.path.append(".")
from data.generate_synthetic_data import generate, MENU
from features import build_daily_table, build_hourly_table
from models.revenue_forecast import train_revenue_model, forecast_next_days
from models.peak_hours import hourly_demand_curve, classify_hours, summarize
from models.ingredient_restock import daily_ingredient_consumption, restock_prediction
from models.extrapolation import cold_start_prediction, validate_cold_start
from data.generate_synthetic_data import HIDDEN_ITEM, generate_hidden_ground_truth

OUT = "outputs"


def main():
    print("1. Loading order data")
    orders = generate()  
    
    print("2. Building daily features + training revenue model...")
    daily = build_daily_table(orders)
    model, metrics = train_revenue_model(daily)
    print(f"   Backtest MAE: Rs {metrics['mae']:.0f} | MAPE: {metrics['mape_pct']:.1f}%")

    forecast = forecast_next_days(model, daily, n_days=7)
    print("   Next 7 days forecast:")
    print(forecast[["date", "revenue"]].to_string(index=False))

    
    print("\n3. Estimating hourly demand curve...")
    hourly = build_hourly_table(orders)
    curve = classify_hours(hourly_demand_curve(hourly))
    hour_summary = summarize(curve)
    print("   Weekday peak hours:", hour_summary["weekday"]["peak_hours"])
    print("   Weekday slow hours:", hour_summary["weekday"]["slow_hours"])
    print("   Weekend peak hours:", hour_summary["weekend"]["peak_hours"])

    
    print("\n4. Predicting ingredient depletion / restock timing...")
    ing_daily = daily_ingredient_consumption(orders, MENU)

   
    current_stock = {
        "rice": 40, "veg_mix": 25, "spice_pack": 4, "chicken": 15,
        "flour_wrap": 60, "sauce": 6, "rice_batter": 30, "potato": 20,
        "sambar": 25, "milk": 35, "coffee_powder": 3, "ice": 18, "oil": 5,
    }
    lead_time_days = {
        "rice": 2, "veg_mix": 1, "spice_pack": 5, "chicken": 1,
        "flour_wrap": 3, "sauce": 4, "rice_batter": 1, "potato": 1,
        "sambar": 1, "milk": 1, "coffee_powder": 5, "ice": 1, "oil": 3,
    }
    restock = restock_prediction(ing_daily, current_stock, lead_time_days)
    print(restock.to_string(index=False))

    
    print("\n5. Testing extrapolation to an unseen item category...")
    print(f"   Held-out item: '{HIDDEN_ITEM['name']}' (zero training history,")
    print(f"   category='{HIDDEN_ITEM['category']}', price={HIDDEN_ITEM['price']})")

    prediction = cold_start_prediction(
        HIDDEN_ITEM["name"], HIDDEN_ITEM["price"], HIDDEN_ITEM["ingredients"],
        MENU, orders, new_category=HIDDEN_ITEM["category"],
    )
    print("   Borrowed structure from (similarity weights):")
    print(f"   {prediction['contributing_weights'].iloc[0]}")

    hidden_truth = generate_hidden_ground_truth()
    val = validate_cold_start(prediction, hidden_truth)
    print(f"   Cold-start MAE:  {val['cold_start_mae']:.4f}  (corr={val['cold_start_corr']:.2f})")
    print(f"   Naive-uniform MAE: {val['naive_uniform_mae']:.4f}")
    print("   -> cold-start beats naive baseline"
          if val["cold_start_mae"] < val["naive_uniform_mae"]
          else "   -> cold-start did NOT beat naive baseline -- investigate")

    
    print("\n6. Rendering visualizations...")
    make_plots(daily, forecast, curve, restock, ing_daily, val)

    daily.to_csv(f"{OUT}/daily_revenue.csv", index=False)
    forecast.to_csv(f"{OUT}/revenue_forecast_7d.csv", index=False)
    curve.to_csv(f"{OUT}/hourly_demand_curve.csv", index=False)
    restock.to_csv(f"{OUT}/restock_predictions.csv", index=False)
    print(f"\nDone. CSVs + plots saved in ./{OUT}/")


def make_plots(daily, forecast, curve, restock, ing_daily, cold_start_val=None):
    plt.style.use("seaborn-v0_8-darkgrid")

    
    fig, ax = plt.subplots(figsize=(11, 5))
    ax.plot(daily["date"], daily["revenue"], label="Actual", color="#2c7fb8")
    ax.plot(forecast["date"], forecast["revenue"], label="Forecast (7d)",
            color="#e34a33", linestyle="--", marker="o")
    ax.set_title("Daily Revenue: History + 7-Day Forecast")
    ax.set_ylabel("Revenue (Rs)")
    ax.legend()
    fig.tight_layout()
    fig.savefig(f"{OUT}/revenue_forecast.png", dpi=150)
    plt.close(fig)

   
    fig, axes = plt.subplots(1, 2, figsize=(13, 4.5), sharey=True)
    for ax, is_weekend, title in zip(axes, [0, 1], ["Weekday", "Weekend"]):
        sub = curve[curve["is_weekend"] == is_weekend].sort_values("hour")
        colors = sub["label"].map({"peak": "#e34a33", "slow": "#2c7fb8", "normal": "#999999"})
        ax.bar(sub["hour"], sub["avg_orders"], color=colors)
        ax.set_title(f"{title} — Orders by Hour")
        ax.set_xlabel("Hour of day")
    axes[0].set_ylabel("Avg orders")
    fig.suptitle("Peak (red) / Slow (blue) Hours")
    fig.tight_layout()
    fig.savefig(f"{OUT}/peak_slow_hours.png", dpi=150)
    plt.close(fig)

    
    fig, ax = plt.subplots(figsize=(9, 5))
    r = restock.sort_values("days_until_reorder_needed")
    colors = ["#e34a33" if d <= 2 else "#fdae61" if d <= 5 else "#2c7fb8"
              for d in r["days_until_reorder_needed"]]
    ax.barh(r["ingredient"], r["days_until_reorder_needed"], color=colors)
    ax.set_xlabel("Days until restock needed")
    ax.set_title("Ingredient Restock Urgency (red = order today/tomorrow)")
    fig.tight_layout()
    fig.savefig(f"{OUT}/restock_urgency.png", dpi=150)
    plt.close(fig)

    
    top = restock.iloc[0]["ingredient"]
    hist = ing_daily[ing_daily["ingredient"] == top].sort_values("date")
    mu = hist["used"].mean()
    stock0 = restock.iloc[0]["current_stock"]
    rop = restock.iloc[0]["reorder_point"]

    days_fwd = np.arange(0, 15)
    projected_stock = stock0 - mu * days_fwd

    fig, ax = plt.subplots(figsize=(9, 5))
    ax.plot(days_fwd, projected_stock, marker="o", color="#2c7fb8", label="Projected stock")
    ax.axhline(rop, color="#e34a33", linestyle="--", label="Reorder point")
    ax.axhline(0, color="black", linewidth=0.8)
    ax.set_title(f"Projected Depletion: {top}")
    ax.set_xlabel("Days from today")
    ax.set_ylabel("Stock (units)")
    ax.legend()
    fig.tight_layout()
    fig.savefig(f"{OUT}/depletion_example_{top}.png", dpi=150)
    plt.close(fig)


    
    if cold_start_val is not None:
        fig, ax = plt.subplots(figsize=(9, 5))
        hours = range(24)
        ax.plot(hours, cold_start_val["true_shape"].values, marker="o",
                color="#2c7fb8", label="True demand shape (hidden, known only for scoring)")
        ax.plot(hours, cold_start_val["predicted_shape"].values, marker="x",
                color="#e34a33", linestyle="--", label="Cold-start prediction (zero history)")
        ax.set_title("Extrapolation to an Unseen Item Category\n"
                      f"(MAE={cold_start_val['cold_start_mae']:.3f} vs naive-uniform "
                      f"MAE={cold_start_val['naive_uniform_mae']:.3f})")
        ax.set_xlabel("Hour of day")
        ax.set_ylabel("Demand share")
        ax.legend()
        fig.tight_layout()
        fig.savefig(f"{OUT}/cold_start_extrapolation.png", dpi=150)
        plt.close(fig)


if __name__ == "__main__":
    main()
