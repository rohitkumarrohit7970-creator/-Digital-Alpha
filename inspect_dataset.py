import json
from collections import Counter
import math

with open('transactions.json', 'r') as f:
    data = json.load(f)

print(f"Total Transactions: {len(data)}")

fields = set()
categories = Counter()
statuses = Counter()
payment_methods = Counter()
timestamp_formats = Counter()

min_amount = float('inf')
max_amount = float('-inf')
negative_count = 0

null_counts = Counter()

for row in data:
    for k, v in row.items():
        fields.add(k)
        if v is None:
            null_counts[k] += 1
            
    cat = row.get('category')
    if cat is not None:
        categories[cat] += 1
    
    stat = row.get('status')
    if stat is not None:
        statuses[stat] += 1
        
    pm = row.get('payment_method')
    if pm is not None:
        payment_methods[pm] += 1
        
    amt = row.get('amount')
    if amt is not None:
        try:
            amt = float(amt)
            if amt < min_amount: min_amount = amt
            if amt > max_amount: max_amount = amt
            if amt < 0: negative_count += 1
        except ValueError:
            print(f"Cannot parse amount: {amt}")
        
    ts = row.get('timestamp')
    if ts is not None:
        if isinstance(ts, int) or isinstance(ts, float):
            timestamp_formats["Unix Epoch (ms/s)"] += 1
        elif isinstance(ts, str):
            if "T" in ts and "Z" in ts:
                timestamp_formats["ISO 8601 (T...Z)"] += 1
            elif "T" in ts:
                timestamp_formats["ISO 8601 (T no Z)"] += 1
            elif "-" in ts and len(ts) == 10:
                timestamp_formats["YYYY-MM-DD"] += 1
            elif "/" in ts:
                timestamp_formats["MM/DD/YYYY or DD/MM/YYYY"] += 1
            else:
                timestamp_formats["Other String: " + ts[:10]] += 1

print("\n--- Available Fields ---")
print(list(fields))

print("\n--- Categories ---")
for k, v in categories.most_common(): print(f"  {k}: {v}")

print("\n--- Statuses ---")
for k, v in statuses.items(): print(f"  {k}: {v}")

print("\n--- Payment Methods ---")
for k, v in payment_methods.items(): print(f"  {k}: {v}")

print("\n--- Amount Range ---")
print(f"  Min: {min_amount}, Max: {max_amount}")
print(f"  Negative Transactions: {negative_count}")

print("\n--- Timestamp Formats ---")
for k, v in timestamp_formats.items(): print(f"  {k}: {v}")

print("\n--- Null/Missing Values ---")
for k, v in null_counts.items(): print(f"  {k}: {v}")
if not null_counts:
    print("  None detected directly via `null` in json. Checking for missing keys...")
    for row in data:
        for f in fields:
            if f not in row:
                print(f"  Row missing field {f}: {row.get('id')}")

