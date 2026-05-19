# Case 4 — README

## What is inside
- `data/case4_telecom_churn.csv` — generated locally if missing (see below), or replace with the official **`datasets/case4_telecom_churn.csv`** from the student pack.
- `notebooks/churn_detective.ipynb` — narrated EDA → model → interpretation → segmentation.
- `deliverables/exec_summary.md` — one-pager for the CMO.
- `deliverables/slides_cmo.md` — five-slide storyline.

## Run the notebook
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python scripts/generate_synthetic_churn.py   # optional if you do not have the CSV yet
cd notebooks && jupyter notebook churn_detective.ipynb
```

## Stretch ideas (if you have extra time)
- Uplift with a randomized training label (requires experiment design).
- Cost-aware thresholding: weight high ARPU saves higher in the objective.
