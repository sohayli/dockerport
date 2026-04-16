# Docker Port - Portfoy AI Studio

Portfolio management application with Docker support.

## Project Structure

- `portfoy-ai-studio/` - Main application with Docker configuration

## Quick Start

```bash
cd portfoy-ai-studio
docker-compose up -d --build
```

## Services

- **App** - Node.js backend + React frontend (Port 3000)
- **PostgreSQL** - Database (Port 5432)

## TEFAS Scraper

Scrapes all Turkish investment funds daily with USD conversion:

```bash
docker exec portfoy_ai_studio-app-1 python3 scripts/scrape_tefas_historical.py
```

## Features

- 📊 Portfolio tracking
- 💰 TEFAS fund prices (TRY + USD)
- 🤖 Automated daily scraping
- 📈 Passive income projections
- 🇹🇷 BES (Turkish pension) calculations
