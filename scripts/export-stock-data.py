#!/opt/miniconda3/bin/python3
"""Export PUBLIC market data from the private Nifty100 pipeline to uptools.in.

Only market data is published: daily OHLCV, the growing F&O snapshot and the
daily model plan. No holdings, accounts, credentials or personal data.

Run daily by ~/.hermes/scripts/publish_stock_pages.sh:
    /opt/miniconda3/bin/python3 scripts/export-stock-data.py
"""
import csv
import glob
import json
import os
import sqlite3
import datetime as dt

import pandas as pd

RADAR = os.path.expanduser("~/stock-radar/data")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "data", "stocks")
os.makedirs(OUT, exist_ok=True)
os.makedirs(os.path.join(OUT, "recommendations"), exist_ok=True)

# ---------------------------------------------------------------- price history
con = sqlite3.connect(os.path.join(RADAR, "radar.db"))
px = pd.read_sql("SELECT symbol,date,open,high,low,close,volume FROM candles", con,
                 parse_dates=["date"])
names = {}
try:
    for s, n in con.execute("SELECT symbol,name FROM universe"):
        names[s] = n
except Exception:
    pass
con.close()

px = px[px.symbol != "NIFTY50"]
dates = sorted(px.date.unique())[-504:]
px = px[px.date.isin(dates)]
syms = sorted(px.symbol.unique())


def matrix(col, scale=1):
    p = px.pivot(index="date", columns="symbol", values=col).reindex(index=dates, columns=syms)
    return [[None if pd.isna(v) else int(round(v * scale)) for v in row]
            for row in p.values]


recent = {}
for s in syms:
    g = px[px.symbol == s].sort_values("date").tail(30)
    recent[s] = [[d.strftime("%Y-%m-%d"), round(float(o), 2), round(float(h), 2),
                  round(float(l), 2), round(float(c), 2), int(v or 0)]
                 for d, o, h, l, c, v in zip(g.date, g.open, g.high, g.low, g.close, g.volume)]

history = dict(as_of=dates[-1].strftime("%Y-%m-%d"),
               dates=[d.strftime("%Y-%m-%d") for d in dates],
               symbols=syms, names=names,
               closes=matrix("close", 100), volumes=matrix("volume"),
               recent=recent)
json.dump(history, open(os.path.join(OUT, "history.json"), "w"), separators=(",", ":"))

# ---------------------------------------------------------------- F&O history
fno_path = os.path.join(RADAR, "fno_history.csv")
rows = []
if os.path.exists(fno_path):
    with open(fno_path, newline="") as f:
        for r in csv.DictReader(f):
            rows.append(dict(date=r["date"], symbol=r["symbol"],
                             expiry=r.get("expiry", ""),
                             pcr=float(r["pcr"]) if r.get("pcr") else None,
                             call_oi=float(r["call_oi"] or 0),
                             put_oi=float(r["put_oi"] or 0),
                             atm=float(r["atm"] or 0),
                             lot_size=float(r["lot_size"] or 0),
                             spot=float(r["spot"] or 0),
                             top_traded=r.get("top_traded") == "True",
                             gainer=r.get("gainer") == "True",
                             loser=r.get("loser") == "True",
                             in_fno=r.get("in_fno") == "True"))
days = sorted({r["date"] for r in rows})
json.dump(dict(started=days[0] if days else None, days=days, rows=rows),
          open(os.path.join(OUT, "fno-history.json"), "w"), separators=(",", ":"))

# ---------------------------------------------------------------- recommendations
plans = sorted(glob.glob(os.path.join(RADAR, "plan_*.json")))
index = []
for p in plans:
    date = os.path.basename(p)[5:-5]
    d = json.load(open(p))
    index.append(date)
    json.dump(d, open(os.path.join(OUT, "recommendations", date + ".json"), "w"), separators=(",", ":"))
index.sort(reverse=True)
json.dump(dict(dates=index), open(os.path.join(OUT, "recommendations", "index.json"), "w"))
if plans:
    latest = json.load(open(plans[-1]))
else:
    latest = dict(date=None, error="no plan published yet")
json.dump(latest, open(os.path.join(OUT, "recommendation.json"), "w"), separators=(",", ":"))

print("exported", len(syms), "symbols,", len(dates), "sessions,", len(rows),
      "F&O rows,", len(index), "plans ->", OUT)
for f in ("history.json", "fno-history.json", "recommendation.json"):
    print("  ", f, os.path.getsize(os.path.join(OUT, f)) // 1024, "KB")
