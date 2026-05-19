"""
Synthetic stand-in for datasets/case4_telecom_churn.csv (~7k rows, ~36% churn).
Use the official pack CSV when available; this keeps the notebook runnable in CI or fresh clones.
"""
from pathlib import Path

import numpy as np
import pandas as pd

RNG = np.random.default_rng(42)
N = 7000

contract_type = RNG.choice(
    ["Month-to-month", "One year", "Two year"], size=N, p=[0.52, 0.28, 0.20]
)
internet_service = RNG.choice(["DSL", "Fiber optic", "No internet service"], size=N, p=[0.45, 0.44, 0.11])
payment_method = RNG.choice(
    [
        "Electronic check",
        "Mailed check",
        "Bank transfer (automatic)",
        "Credit card (automatic)",
    ],
    size=N,
    p=[0.34, 0.16, 0.28, 0.22],
)

yes_no = lambda p, n: RNG.choice(["Yes", "No"], size=n, p=[p, 1 - p])

online_security = yes_no(0.28, N)
tech_support = yes_no(0.29, N)
streaming_tv = yes_no(0.38, N)
paperless_billing = yes_no(0.59, N)
partner = yes_no(0.48, N)
dependents = yes_no(0.3, N)
phone_service = yes_no(0.9, N)
multiple_lines = np.where(
    phone_service == "Yes",
    RNG.choice(["Yes", "No", "No phone service"], size=N, p=[0.25, 0.72, 0.03]),
    "No phone service",
)

tenure_months = RNG.integers(1, 73, size=N)
monthly_charges = np.clip(
    RNG.normal(65, 22, size=N)
    + (contract_type == "Month-to-month") * 12
    + (internet_service == "Fiber optic") * 18
    + (internet_service == "DSL") * 4,
    20.01,
    120.0,
)
total_charges = np.clip(
    monthly_charges * tenure_months * RNG.uniform(0.75, 1.15, size=N),
    20.01,
    8000.0,
)

support_calls_3mo = RNG.poisson(1.2, size=N).clip(0, 15).astype(int)
avg_data_gb_3mo = np.where(
    internet_service == "No internet service",
    0.0,
    np.clip(RNG.normal(28, 18, size=N), 0, 120),
)
late_payments_6mo = RNG.poisson(0.35, size=N).clip(0, 6).astype(int)
plan_changes_6mo = RNG.poisson(0.25, size=N).clip(0, 6).astype(int)
senior_citizen = RNG.choice([0, 1], size=N, p=[0.84, 0.16])

# Latent churn propensity (interpretable drivers)
logit = (
    -1.25
    + 1.35 * (contract_type == "Month-to-month")
    + 0.55 * (internet_service == "Fiber optic")
    + 0.45 * (payment_method == "Electronic check")
    + 0.22 * (paperless_billing == "Yes")
    - 0.055 * tenure_months
    + 0.012 * monthly_charges
    + 0.18 * support_calls_3mo
    + 0.35 * late_payments_6mo
    + 0.12 * plan_changes_6mo
    - 0.35 * (online_security == "Yes")
    - 0.28 * (tech_support == "Yes")
    + 0.15 * senior_citizen
    + RNG.normal(0, 0.55, size=N)
)

p = 1 / (1 + np.exp(-logit))
churned = (RNG.uniform(size=N) < p).astype(int)

df = pd.DataFrame(
    {
        "customer_id": [f"CUST{50000 + i}" for i in range(N)],
        "tenure_months": tenure_months,
        "contract_type": contract_type,
        "monthly_charges": np.round(monthly_charges, 2),
        "total_charges": np.round(total_charges, 2),
        "internet_service": internet_service,
        "online_security": online_security,
        "tech_support": tech_support,
        "streaming_tv": streaming_tv,
        "payment_method": payment_method,
        "paperless_billing": paperless_billing,
        "senior_citizen": senior_citizen,
        "partner": partner,
        "dependents": dependents,
        "phone_service": phone_service,
        "multiple_lines": multiple_lines,
        "support_calls_3mo": support_calls_3mo,
        "avg_data_gb_3mo": np.round(avg_data_gb_3mo, 2),
        "late_payments_6mo": late_payments_6mo,
        "plan_changes_6mo": plan_changes_6mo,
        "churned": churned,
    }
)

out = Path(__file__).resolve().parent.parent / "data" / "case4_telecom_churn.csv"
out.parent.mkdir(parents=True, exist_ok=True)
df.to_csv(out, index=False)
print(f"Wrote {len(df)} rows to {out} churn rate={df.churned.mean():.1%}")
