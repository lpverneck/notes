---
title: Datadog LLM Observability
created at: 2026-09-08
modified at: 2026-09-14
tags:
  - completed
  - tools
publish: true
---

Traditional [[apm|Application Performance Monitoring (APM)]] usually focuses on monitoring deterministic software operations. This kind of observability tool focuses on system health, latency, errors, and throughput. Whereas **LLM Observability** focuses on non-deterministic software, monitoring model behavior just like: prompt effectiveness, retrieval quality, token usage, and response accuracy.

## The 4 core capabilities

- **Tracing**: debug and optimize requests
- **Evaluation**: ensure quality, relevance, and accuracy
- **Experiments**: test and compare different models
- **Cost Monitoring**: track and optimize spend

## Concepts

- **Spans**: a unit of work representing an operation on the LLM application, and can be seen as the building block of a trace
	- *Attributes*: `name`, `start_time, duration`, `error_type, message, traceback`, `inputs, outputs`, `metadata`, `metrics`, and `tags`
	- *Span kinds*: `LLM`, `Workflow`, `Agent`, `Tool`, `Task`, `Embedding`, and `Retrieval`
- **Traces**: they represent the work involved in processing a request in the LLM application and consist of one or more nested spans
- **Evaluations**: a method for measuring the LLM application performance

## Instrumentation

Instrumentation can be done automatically using the [Datadog Agent Observability SDK](https://docs.datadoghq.com/llm_observability/instrument/auto_instrumentation/?tab=python) or manually using the custom instrumentation decorators feature.

Doesn't matter if it's an LLM Application, an agentic AI solution, or even a multi-agent one. The instrumentation method is the same.

### Example

```python title="Example of manual instrumentation"
from ddtrace.llmobs import LLMObs
from ddtrace.llmobs.decorators import llm


LLMObs.enable(
    ml_app="<YOUR_ML_APP_NAME>",
    api_key="<YOUR_DATADOG_API_KEY>",
    site="<YOUR_DATADOG_SITE>",
    agentless_enabled=True,
    # sample_rate=0.5,
)


@llm(model_name="gpt-4o-mini", name="invoke_llm", model_provider="openai")
def llm_call(prompt):
    completion = ...
    LLMObs.annotate(
        input_data=[{"role": "user", "content": prompt}],
        output_data=[{"role": "assistant", "content": completion}],
        metrics={"input_tokens": 4, "output_tokens": 6, "total_tokens": 10},
    )
    return completion
```

## Experiments

They have three main components:

- Datasets
- Tasks
- Evaluators

## Alternatives

There are some open-source alternative ways to enable observability in an AI solution.

- [OpenLLMetry](https://github.com/traceloop/openllmetry)
- [OpenTelemetry (OTEL)](https://opentelemetry.io/docs/)
