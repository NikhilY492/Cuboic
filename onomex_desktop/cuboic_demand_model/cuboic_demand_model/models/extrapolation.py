

import numpy as np
import pandas as pd


def item_feature_vector(price: float, ingredients: dict, all_ingredient_names: list) -> np.ndarray:

    ing_vec = np.array([1.0 if ing in ingredients else 0.0 for ing in all_ingredient_names])
    return price, ing_vec


def similarity(new_price, new_ing_vec, known_price, known_ing_vec,
               new_category=None, known_category=None,
               price_weight=0.25, ingredient_weight=0.35, category_weight=0.40) -> float:

    price_sim = np.exp(-abs(new_price - known_price) / max(known_price, 1e-6))
    denom = (np.linalg.norm(new_ing_vec) * np.linalg.norm(known_ing_vec))
    ing_sim = float(np.dot(new_ing_vec, known_ing_vec) / denom) if denom > 0 else 0.0
    cat_sim = 1.0 if (new_category is not None and new_category == known_category) else 0.0
    return price_weight * price_sim + ingredient_weight * ing_sim + category_weight * cat_sim


def known_item_hourly_shapes(orders: pd.DataFrame) -> pd.DataFrame:

    orders = orders.copy()
    orders["hour"] = orders["timestamp"].dt.hour
    counts = orders.groupby(["item", "hour"]).size().reset_index(name="n")
    all_hours = pd.DataFrame({"hour": range(24)})
    out = []
    for item, g in counts.groupby("item"):
        g = all_hours.merge(g[["hour", "n"]], on="hour", how="left").fillna(0)
        g["item"] = item
        total = g["n"].sum()
        g["shape"] = g["n"] / total if total > 0 else 0
        out.append(g[["item", "hour", "shape"]])
    return pd.concat(out, ignore_index=True)


def item_popularity_share(orders: pd.DataFrame) -> pd.Series:
    counts = orders.groupby("item").size()
    return counts / counts.sum()


def cold_start_prediction(new_name: str, new_price: float, new_ingredients: dict,
                           menu: dict, orders: pd.DataFrame, new_category: str = None) -> pd.DataFrame:
    all_ingredients = sorted({ing for spec in menu.values() for ing in spec["ingredients"]}
                              | set(new_ingredients))
    new_price_f, new_vec = item_feature_vector(new_price, new_ingredients, all_ingredients)

    shapes = known_item_hourly_shapes(orders)
    shares = item_popularity_share(orders)

    weights = {}
    for item, spec in menu.items():
        _, known_vec = item_feature_vector(spec["price"], spec["ingredients"], all_ingredients)
        weights[item] = similarity(new_price_f, new_vec, spec["price"], known_vec,
                                    new_category, spec.get("category"))

    total_w = sum(weights.values())
    weights = {k: v / total_w for k, v in weights.items()}  # normalise to sum to 1

    pred_shape = shapes.pivot(index="hour", columns="item", values="shape").fillna(0)
    pred_shape = pred_shape[list(weights.keys())]
    blended_shape = (pred_shape * pd.Series(weights)).sum(axis=1)
    blended_shape = blended_shape / blended_shape.sum()


    pred_share = sum(weights[item] * shares.get(item, 0) for item in weights)

    result = blended_shape.reset_index()
    result.columns = ["hour", "predicted_shape"]
    result["predicted_share"] = pred_share
    result["contributing_weights"] = str({k: round(v, 2) for k, v in
                                           sorted(weights.items(), key=lambda x: -x[1])})
    return result


def validate_cold_start(prediction: pd.DataFrame, hidden_orders: pd.DataFrame) -> dict:
    """The actual test: we generated the hidden item ourselves, so we know
    its true shape/share. Score the cold-start estimate against it -- this
    is the manufactured-solution check, the same logic as testing a PINN
    outside its training distribution."""
    hidden = hidden_orders.copy()
    hidden["hour"] = hidden["timestamp"].dt.hour
    true_counts = hidden.groupby("hour").size().reindex(range(24), fill_value=0)
    true_shape = true_counts / true_counts.sum()

    pred = prediction.set_index("hour")["predicted_shape"].reindex(range(24), fill_value=0)

    mae = float(np.abs(pred.values - true_shape.values).mean())
    corr = float(np.corrcoef(pred.values, true_shape.values)[0, 1])

    naive = np.ones(24) / 24
    naive_mae = float(np.abs(naive - true_shape.values).mean())

    return {"cold_start_mae": mae, "cold_start_corr": corr,
            "naive_uniform_mae": naive_mae,
            "true_shape": true_shape, "predicted_shape": pred}
