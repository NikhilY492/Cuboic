

import numpy as np
import pandas as pd

RNG = np.random.default_rng(42)

# item -> (price, category, ingredients-per-unit, TRUE popularity share)
MENU = {
    "veg_biryani":   {"price": 90, "category": "meal",
                       "ingredients": {"rice": 0.25, "veg_mix": 0.15, "spice_pack": 0.02},
                       "w_item": 0.28},
    "chicken_roll":  {"price": 70, "category": "meal",
                       "ingredients": {"chicken": 0.12, "flour_wrap": 1, "sauce": 0.03},
                       "w_item": 0.22},
    "masala_dosa":   {"price": 60, "category": "meal",
                       "ingredients": {"rice_batter": 0.2, "potato": 0.1, "sambar": 0.15},
                       "w_item": 0.20},
    "cold_coffee":   {"price": 50, "category": "beverage",
                       "ingredients": {"milk": 0.2, "coffee_powder": 0.015, "ice": 0.1},
                       "w_item": 0.15},
    "samosa":        {"price": 20, "category": "snack",
                       "ingredients": {"flour_wrap": 0.5, "potato": 0.05, "oil": 0.02},
                       "w_item": 0.15},
}

# I use this to check 
# prediction data.
HIDDEN_ITEM = {
    "name": "paneer_tikka_wrap",
    "price": 75, "category": "snack",
    "ingredients": {"paneer": 0.15, "flour_wrap": 1, "sauce": 0.03},
    "w_item": 0.10,
}


def universal_meal_curve(hour: np.ndarray) -> np.ndarray:
    """lambda_universal(t): breakfast/lunch/evening/dinner bumps. Same for
    every item, by construction -- this is the invariant."""
    def bump(center, width, height):
        return height * np.exp(-0.5 * ((hour - center) / width) ** 2)
    shape = (bump(8.5, 1.0, 0.6) + bump(13.0, 1.3, 1.0)
             + bump(17.0, 1.0, 0.5) + bump(20.5, 1.2, 0.85) + 0.03)
    return np.clip(shape, 0, None)


def category_modifier(category: str, hour: np.ndarray) -> np.ndarray:
    """The correction term. This is the part a cold-start model has to
    infer for a new item from category/ingredient similarity alone."""
    def bump(center, width, height):
        return height * np.exp(-0.5 * ((hour - center) / width) ** 2)
    if category == "beverage":
        return 1 + bump(16.0, 1.2, 0.9)       # afternoon chai/coffee break
    if category == "snack":
        return 1 + bump(17.5, 1.0, 0.7)       # evening snack window
    return np.ones_like(hour, dtype=float)     # meals: no extra correction


def _generate_for_menu(menu: dict, n_days: int, start_date: str) -> pd.DataFrame:
    dates = pd.date_range(start_date, periods=n_days, freq="D")
    rows = []
    items = list(menu.keys())

    for day_idx, date in enumerate(dates):
        dow = date.dayofweek
        is_weekend = dow >= 5
        trend = 1.0 + 0.0025 * day_idx
        weekend_mult = 1.35 if is_weekend else 1.0
        shock = 1.8 if day_idx % 37 == 0 else (0.5 if day_idx % 29 == 0 else 1.0)
        day_scale = trend * weekend_mult * shock

        for hour in range(7, 23):
            for minute_block in range(0, 60, 15):
                h_frac = np.array([hour + minute_block / 60])
                base = universal_meal_curve(h_frac)[0] * day_scale

                for item in items:
                    spec = menu[item]
                    mod = category_modifier(spec["category"], h_frac)[0]
                    rate_item = base * mod * spec["w_item"] * 3.5
                    n_orders = RNG.poisson(lam=max(rate_item, 0.0005))
                    for _ in range(n_orders):
                        qty = RNG.choice([1, 1, 1, 2], p=[0.6, 0.2, 0.1, 0.1])
                        price = spec["price"] * RNG.uniform(0.95, 1.05)
                        ts = date + pd.Timedelta(hours=hour, minutes=minute_block,
                                                  seconds=int(RNG.integers(0, 900)))
                        rows.append((ts, item, qty, round(price, 2)))

    df = pd.DataFrame(rows, columns=["timestamp", "item", "quantity", "unit_price"])
    return df.sort_values("timestamp").reset_index(drop=True)


def generate(n_days: int = 120, start_date: str = "2026-03-01") -> pd.DataFrame:
    """Training data: only the KNOWN menu. paneer_tikka_wrap never appears."""
    return _generate_for_menu(MENU, n_days, start_date)


def generate_hidden_ground_truth(n_days: int = 120, start_date: str = "2026-03-01") -> pd.DataFrame:
    """The truth we're NOT allowed to look at when building the cold-start
    estimate -- only used afterward to score it."""
    return _generate_for_menu({HIDDEN_ITEM["name"]: HIDDEN_ITEM}, n_days, start_date)


if __name__ == "__main__":
    orders = generate()
    orders.to_csv("/home/claude/cuboic_demand_model/data/orders.csv", index=False)
    print(f"Generated {len(orders)} orders across {orders.timestamp.dt.date.nunique()} days")
    print(orders.head())
