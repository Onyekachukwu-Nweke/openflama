# @openflama/sdk-ts

TypeScript SDK for the OpenFlama API.

## Installation

```bash
npm install @openflama/sdk-ts
```

## Usage

```typescript
import { OpenFlama } from "@openflama/sdk-ts";

const client = new OpenFlama({ baseUrl: "https://your-instance.com" });

const prediction = await client.predict({
  ticker: "AAPL",
  horizon: "5d",
  target: "return",
});

console.log(prediction.forecast);
```

## Status

Under development. Core types and client are being built.
