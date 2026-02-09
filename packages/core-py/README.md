# openflama-core

Python core library for OpenFlama forecasting models.

## Installation

```bash
pip install openflama-core
```

## Usage

```python
from openflama import predict, list_models

models = list_models()
result = predict(ticker="AAPL", horizon="5d", target="return")
print(result.forecast)
```

## Status

Under development. The Python core will contain model implementations and utilities that can be used independently or with the API.
