# Contributing to OpenFlama

Thank you for your interest in contributing to OpenFlama! This document provides
guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch: `git checkout -b feature/my-feature`
4. Make your changes
5. Run tests to ensure everything passes
6. Commit with a clear message
7. Push to your fork and open a Pull Request

## Development Setup

### Prerequisites

- Node.js 20+
- Python 3.10+
- PostgreSQL 15+

### Install Dependencies

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```
DATABASE_URL=postgresql://...
```

### Running Locally

```bash
npm run dev
```

## Project Structure

```
openflama/
  apps/
    api/          Express.js API server
    web/          React frontend
  packages/
    sdk-ts/       TypeScript SDK
    core-py/      Python core library
  agents/         Pluggable financial agents
  docs/           Documentation
```

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use explicit return types on exported functions
- Follow existing patterns in the codebase

### Python

- Follow PEP 8
- Use type hints
- Run `ruff` for linting

## Commit Messages

Use clear, descriptive commit messages:

- `feat: add ARIMA model to forecasting engine`
- `fix: correct interval calculation in mean reversion`
- `docs: update API endpoint documentation`
- `test: add backtest validation tests`

## Pull Requests

- Keep PRs focused on a single change
- Include tests for new features
- Update documentation if needed
- Reference any related issues

## Reporting Bugs

Open an issue using the Bug Report template. Include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details

## Suggesting Features

Open an issue using the Feature Request template. Include:

- Problem description
- Proposed solution
- Alternatives considered

## License

By contributing, you agree that your contributions will be licensed under the
MIT License.
