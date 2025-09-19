---
title: Pattern Queue-Checkpoint
created: 2025-09-10
tags:
  - completed
publish: true
---
This "resumable" or "checkpoint and continue" pattern is industry standard in batch/ETL jobs, ensuring that any failure is localized and reruns are idempotent and efficient.

## Recommended Patterns

### 1. Error Handling with Retries

Wrap each API call in a try/except block to handle network/API issues and apply retry logic (using libraries like Tenacity) with exponential backoff to gracefully handle transient errors instead of causing the whole job to fail.

### 2. Checkpointing/Incremental Save

After each successful inference (or even each batch), save the results to disk or back into a persistent store (such as a CSV, Parquet, or separate database table), so that if the process fails, progress is preserved and only the missing/failed records need to be retried.

### 3. Batch Processing & Resume Logic

If using larger datasets, process in mini-batches, and after each batch, update the persistent results. On job restart, reload the checkpointed results and only process the unprocessed subset. 

## Implementation Example

```python
import openai
import pandas as pd
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)


# function to save checkpoint
def save_checkpoint(df: pd.DataFrame, path: str = "checkpoint.parquet"):
    df.to_parquet(path, index=False)


# function to make the LLM calls with retry logic
@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(min=2, max=20),
    # retry=retry_if_exception_type(openai.error.OpenAIError),
)
def call_llm(text: str):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": text}],
        temperature=0.3,
        timeout=30,
    )
    return response.choices[0].message["content"]


# sample input data
df = pd.read_parquet("input_data.parquet")

# add a results column if not present
if "llm_output" not in df.columns:
    df["llm_output"] = None

# main loop — only process unprocessed entries
for idx, row in df[df["llm_output"].isna()].iterrows():
    try:
        output = call_llm(row["summary"])
        df.at[idx, "llm_output"] = output
        save_checkpoint(df)
    except Exception as e:
        print(f"Processing failed for idx={idx}, error: {e}")
        save_checkpoint(df)
        continue

# save the final result at the end
df.to_parquet("final_results.parquet", index=False)
```