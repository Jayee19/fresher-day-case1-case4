# Five-slide outline for the CMO (paste into Google Slides / Keynote)

## Slide 1 — Why churn hurts now
- Elevated churn vs benchmark; retention budget next quarter needs a **defensible target list**.
- Today: who is leaving, **why patterns cluster**, and what we do differently per cluster.

## Slide 2 — What is actually driving churn (with evidence)
- Show **2–3 partial dependence** charts (tenure, monthly charges, support calls) + **permutation importance** top features.
- Plain language: “flexible contracts + early tenure”, “billing friction”, “service stress” — each backed by a chart, not only bars.

## Slide 3 — Not all churners are the same (segments)
- Three churner micro-segments from clustering on value + behavior features.
- For each: **one sentence persona** + “what they need to hear” (price vs reassurance vs fix).

## Slide 4 — Who to call first + what to offer
- Ranked list policy: start with **highest expected loss** (simple proxy: `monthly_charges × remaining life assumption`) within precision@k from the model.
- Map segments → **Play 1 / Play 2 / Play 3** from the exec summary.

## Slide 5 — Measurement, risks, and next step
- 60-day experiment: **holdout control**, primary metric churn, secondary payment/support metrics.
- Risks: false positives waste offers; model blind to competitor pricing; next step **uplift pilot** on one segment only.
