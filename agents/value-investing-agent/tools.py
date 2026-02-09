"""Data tools for the Value Investing Agent.

Provides market data fetching and financial metric computation.
Uses synthetic data for MVP - designed to be replaced with real
data sources (yfinance, Alpha Vantage, etc.) later.
"""

import hashlib
import math
from datetime import datetime, timedelta


def _seeded_random(seed: int) -> float:
    seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF
    return (seed % 10000) / 10000.0, seed


def _generate_price_series(ticker: str, days: int = 252) -> list[float]:
    h = int(hashlib.md5(ticker.upper().encode()).hexdigest()[:8], 16)
    base_price = 50 + (h % 400)
    prices = [float(base_price)]
    seed = h
    for _ in range(days - 1):
        val, seed = _seeded_random(seed)
        val2, seed = _seeded_random(seed)
        z = math.sqrt(-2 * math.log(max(val, 0.0001))) * math.cos(2 * math.pi * val2)
        ret = z * 0.015
        prices.append(prices[-1] * (1 + ret))
    return prices


def _generate_financials(ticker: str) -> dict:
    h = int(hashlib.md5(ticker.upper().encode()).hexdigest()[:8], 16)
    seed = h

    val, seed = _seeded_random(seed)
    revenue = 10_000 + (h % 490_000)

    val, seed = _seeded_random(seed)
    gross_margin = 0.25 + val * 0.50

    val, seed = _seeded_random(seed)
    operating_margin = gross_margin * (0.3 + val * 0.5)

    val, seed = _seeded_random(seed)
    net_margin = operating_margin * (0.6 + val * 0.3)

    val, seed = _seeded_random(seed)
    revenue_growth = -0.05 + val * 0.40

    val, seed = _seeded_random(seed)
    shares_outstanding = 500 + (h % 9500)

    val, seed = _seeded_random(seed)
    debt_to_equity = val * 2.5

    val, seed = _seeded_random(seed)
    roic = 0.03 + val * 0.25

    val, seed = _seeded_random(seed)
    fcf_margin = net_margin * (0.5 + val * 0.8)

    net_income = revenue * net_margin
    operating_income = revenue * operating_margin
    gross_profit = revenue * gross_margin
    fcf = revenue * fcf_margin
    total_equity = revenue * (0.3 + (h % 100) / 100.0)
    total_debt = total_equity * debt_to_equity
    cash = total_equity * (0.1 + (h % 30) / 100.0)
    ebitda = operating_income * 1.15

    return {
        "revenue_ttm": round(revenue, 2),
        "revenue_growth_yoy": round(revenue_growth, 4),
        "gross_profit": round(gross_profit, 2),
        "gross_margin": round(gross_margin, 4),
        "operating_income": round(operating_income, 2),
        "operating_margin": round(operating_margin, 4),
        "net_income": round(net_income, 2),
        "net_margin": round(net_margin, 4),
        "ebitda": round(ebitda, 2),
        "free_cash_flow": round(fcf, 2),
        "fcf_margin": round(fcf_margin, 4),
        "total_equity": round(total_equity, 2),
        "total_debt": round(total_debt, 2),
        "cash_and_equivalents": round(cash, 2),
        "shares_outstanding": round(shares_outstanding, 2),
        "debt_to_equity": round(debt_to_equity, 4),
        "roic": round(roic, 4),
    }


def get_company_profile(ticker: str) -> dict:
    """Get basic company profile information."""
    h = int(hashlib.md5(ticker.upper().encode()).hexdigest()[:8], 16)
    sectors = [
        "Technology", "Healthcare", "Financials", "Consumer Discretionary",
        "Industrials", "Energy", "Materials", "Utilities",
        "Communication Services", "Consumer Staples", "Real Estate",
    ]
    return {
        "ticker": ticker.upper(),
        "name": f"{ticker.upper()} Inc.",
        "sector": sectors[h % len(sectors)],
        "industry": f"{sectors[h % len(sectors)]} - Diversified",
        "market_cap_millions": round(50 + (h % 2_000_000), 2),
        "currency": "USD",
        "exchange": "NYSE" if h % 2 == 0 else "NASDAQ",
        "data_source": "synthetic",
    }


def get_financial_statements(ticker: str) -> dict:
    """Get financial statement data for a company."""
    return _generate_financials(ticker)


def get_price_history(ticker: str, window: int = 252) -> dict:
    """Get price history and basic statistics."""
    prices = _generate_price_series(ticker, window)
    current = prices[-1]
    high_52w = max(prices[-252:]) if len(prices) >= 252 else max(prices)
    low_52w = min(prices[-252:]) if len(prices) >= 252 else min(prices)

    returns = [(prices[i] / prices[i - 1]) - 1 for i in range(1, len(prices))]
    avg_return = sum(returns) / len(returns) if returns else 0
    vol = (
        sum((r - avg_return) ** 2 for r in returns) / len(returns)
    ) ** 0.5 if returns else 0

    sma_20 = sum(prices[-20:]) / min(20, len(prices))
    sma_50 = sum(prices[-50:]) / min(50, len(prices))
    sma_200 = sum(prices[-200:]) / min(200, len(prices))

    return {
        "ticker": ticker.upper(),
        "current_price": round(current, 2),
        "high_52w": round(high_52w, 2),
        "low_52w": round(low_52w, 2),
        "sma_20": round(sma_20, 2),
        "sma_50": round(sma_50, 2),
        "sma_200": round(sma_200, 2),
        "daily_volatility": round(vol, 6),
        "annualized_volatility": round(vol * math.sqrt(252), 4),
        "ytd_return": round((current / prices[0]) - 1, 4),
        "data_points": len(prices),
        "data_source": "synthetic",
    }


def compute_value_metrics(financials: dict, price_data: dict) -> dict:
    """Compute key value investing metrics."""
    price = price_data["current_price"]
    shares = financials["shares_outstanding"]
    market_cap = price * shares

    eps = financials["net_income"] / shares if shares > 0 else 0
    bvps = financials["total_equity"] / shares if shares > 0 else 0
    fcf_per_share = financials["free_cash_flow"] / shares if shares > 0 else 0

    pe = price / eps if eps > 0 else None
    pb = price / bvps if bvps > 0 else None
    ev = market_cap + financials["total_debt"] - financials["cash_and_equivalents"]
    ev_ebitda = ev / financials["ebitda"] if financials["ebitda"] > 0 else None
    fcf_yield = (fcf_per_share / price * 100) if price > 0 else None

    return {
        "market_cap": round(market_cap, 2),
        "enterprise_value": round(ev, 2),
        "eps": round(eps, 4),
        "book_value_per_share": round(bvps, 4),
        "fcf_per_share": round(fcf_per_share, 4),
        "pe_ratio": round(pe, 2) if pe else None,
        "pb_ratio": round(pb, 2) if pb else None,
        "ev_ebitda": round(ev_ebitda, 2) if ev_ebitda else None,
        "fcf_yield_pct": round(fcf_yield, 2) if fcf_yield else None,
        "roic_pct": round(financials["roic"] * 100, 2),
        "gross_margin_pct": round(financials["gross_margin"] * 100, 2),
        "operating_margin_pct": round(financials["operating_margin"] * 100, 2),
        "net_margin_pct": round(financials["net_margin"] * 100, 2),
        "debt_to_equity": round(financials["debt_to_equity"], 2),
        "revenue_growth_pct": round(financials["revenue_growth_yoy"] * 100, 2),
    }


def intrinsic_value_estimate(
    metrics: dict,
    financials: dict,
    assumptions: dict | None = None,
) -> dict:
    """Estimate intrinsic value using simple DCF-lite and multiples."""
    assumptions = assumptions or {}
    discount_rate = assumptions.get("discount_rate", 0.10)
    terminal_growth = assumptions.get("terminal_growth", 0.03)
    safety_margin = assumptions.get("safety_margin", 0.25)
    projection_years = assumptions.get("projection_years", 10)

    fcf = financials["free_cash_flow"]
    growth = min(financials["revenue_growth_yoy"], 0.20)
    growth = max(growth, 0.0)

    dcf_sum = 0.0
    projected_fcf = fcf
    for year in range(1, projection_years + 1):
        projected_fcf *= 1 + growth
        dcf_sum += projected_fcf / ((1 + discount_rate) ** year)

    terminal_value = (
        projected_fcf * (1 + terminal_growth) / (discount_rate - terminal_growth)
    )
    terminal_pv = terminal_value / ((1 + discount_rate) ** projection_years)
    dcf_value = dcf_sum + terminal_pv

    shares = financials["shares_outstanding"]
    dcf_per_share = dcf_value / shares if shares > 0 else 0

    pe_based = None
    if metrics["eps"] and metrics["eps"] > 0:
        fair_pe = min(max(15, financials["revenue_growth_yoy"] * 100 + 10), 30)
        pe_based = metrics["eps"] * fair_pe

    multiples_estimate = pe_based if pe_based else dcf_per_share

    iv_low = min(dcf_per_share, multiples_estimate) * (1 - safety_margin * 0.5)
    iv_high = max(dcf_per_share, multiples_estimate) * (1 + safety_margin * 0.3)
    iv_mid = (iv_low + iv_high) / 2

    current_price = metrics.get("market_cap", 0) / shares if shares > 0 else 0
    mos = (iv_mid - current_price) / iv_mid if iv_mid > 0 else 0

    return {
        "dcf_per_share": round(dcf_per_share, 2),
        "multiples_per_share": round(multiples_estimate, 2) if multiples_estimate else None,
        "intrinsic_value_low": round(iv_low, 2),
        "intrinsic_value_mid": round(iv_mid, 2),
        "intrinsic_value_high": round(iv_high, 2),
        "current_price": round(current_price, 2),
        "margin_of_safety_pct": round(mos * 100, 2),
        "assumptions": {
            "discount_rate": discount_rate,
            "terminal_growth": terminal_growth,
            "safety_margin": safety_margin,
            "projection_years": projection_years,
            "growth_rate_used": round(growth, 4),
        },
    }
