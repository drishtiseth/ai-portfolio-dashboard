# 📊 AI Portfolio Dashboard

An **AI-powered portfolio analysis dashboard** built with **FastAPI (Python backend)** and **React + Vite (frontend)**.  
It lets you input stock tickers, quantities, and buy prices, then computes key metrics, sector exposure, and insights — all in real-time.

---

## 🚀 Features
- 🔎 **Portfolio analysis API** (FastAPI + PyPortfolioOpt + yfinance)
- 📈 **Key metrics**: Annualized return, volatility, Sharpe ratio, max drawdown
- 🥧 **Sector exposure chart** (Recharts pie chart)
- 📊 **Per-ticker statistics** (Data table with value, weight, return contribution)
- ⚡ Modern stack: **Python 3.11**, **FastAPI**, **React 18 + Vite + TypeScript**, **Axios**, **Recharts**
- 🎯 Ready for extension: add portfolio rebalancing, backtests, ML-based insights

---

## 🛠️ Tech Stack
- **Backend**: FastAPI, Uvicorn, Pydantic, yfinance, PyPortfolioOpt  
- **Frontend**: React 18, Vite, TypeScript, Axios, Recharts  
- **Infra**: GitHub, virtualenv, npm, CORS enabled for frontend ↔ backend calls  

---

## ⚙️ Setup Instructions

### 1. Clone repo
```bash
git clone https://github.com/drishtiseth/ai-portfolio-dashboard.git
cd ai-portfolio-dashboard