# One-page executive summary — Churn & retention (Case 4)

## Situation
Postpaid churn is elevated versus a 1.5% monthly benchmark. Marketing needs a **prioritized call list** and **segment-specific offers**, not a model leaderboard.

## What the data suggests (pattern-level)
- **New + flexible contracts** (short tenure, month-to-month) concentrate churn risk.
- **Billing and payment rails** (for example electronic check with paperless) correlate with involuntary-style churn patterns.
- **Service stress** (recent support contacts, late payments) marks customers who may still be saved with proactive care.

## Three retention plays (tie to segments from the notebook)
1. **“Stability upgrade” for early-life month-to-month** — targeted loyalty credit or annual plan incentive with clear savings math. *Expected impact (illustrative):* if this slice is half of churners and conversion is modest, **net churn could fall on the order of tens of basis points**; validate with a holdout.
2. **“Friction removal” for payment-rail risk** — white-glove move to autopay on bank/card, fee waiver for first cycle, SMS confirmation. *Expected impact:* fewer accidental lapses; watch payment failure rates weekly.
3. **“Save desk” for high-touch frustration** — dedicated callback from a retention specialist, bill correction + service plan fix. *Expected impact:* higher save-rate among contacted high-callers; monitor average handle time.

## How we will know it worked (first 60 days)
- **Outcome:** churn rate in targeted cohort vs matched control (geo/plan/tenure matched).
- **Leading indicators:** payment failures, support repeats, NPS/contest survey on save calls.
- **Guardrails:** offer cost per saved account, incremental ARPU, and contact fatigue caps.

## Honest limitations
- Observational data cannot prove causality; correlations can reflect **mix effects** (for example fiber bundles with different support quality).
- Model scores are **not uplift**: some high-risk customers would never respond to an offer — next iteration should estimate incremental save probability.
- Campaign execution quality (script, timing, channel) will dominate any model lift.
