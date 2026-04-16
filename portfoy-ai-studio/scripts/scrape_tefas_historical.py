#!/usr/bin/env python3
"""
TEFAS Historical Fund Price Scraper
Uses official tefas-crawler library to fetch all fund prices
Saves TRY and USD prices to database with historical tracking
"""

import os
import sys
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import execute_values
import requests
from tefas import Crawler
import pandas as pd

# Database configuration from environment variables
DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "port": int(os.environ.get("DB_PORT", 5432)),
    "database": os.environ.get("DB_NAME", "portfoy_ai"),
    "user": os.environ.get("DB_USER", "postgres"),
    "password": os.environ.get("DB_PASSWORD", "postgres"),
}


def get_usdtry_rate():
    """Fetch current USDTRY exchange rate from Yahoo Finance"""
    try:
        url = "https://query1.finance.yahoo.com/v8/finance/chart/USDTRY=X"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }

        response = requests.get(url, headers=headers, timeout=10)
        data = response.json()

        rate = data["chart"]["result"][0]["meta"]["regularMarketPrice"]

        print(f"[USDTRY] ✅ Current rate: {rate}")
        return rate

    except Exception as e:
        print(f"[USDTRY] ❌ Failed to fetch rate: {e}")
        print("[USDTRY] Using fallback rate: 44.5")
        return 44.5


def fetch_tefas_data(date_str=None):
    """Fetch all TEFAS fund data for a specific date"""

    if not date_str:
        # Default to yesterday's data
        date_str = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

    print(f"\n[TEFAS] 📅 Fetching fund data for: {date_str}")
    print("=" * 60)

    # Initialize TEFAS crawler
    print("[TEFAS] 🔄 Initializing crawler...")
    tefas = Crawler()

    # Fetch all funds for the date
    all_data = []

    # Fetch YAT funds (Yatırım Fonları)
    print(f"[TEFAS] Fetching YAT funds...")
    try:
        yat_data = tefas.fetch(start=date_str, kind="YAT")
        if yat_data is not None and not yat_data.empty:
            print(f"[TEFAS] ✅ {len(yat_data)} YAT funds fetched")
            all_data.append(yat_data)
        else:
            print(f"[TEFAS] ⚠️ No YAT data available")
    except Exception as e:
        print(f"[TEFAS] ❌ YAT fetch error: {str(e)[:100]}")

    # Fetch EMK funds (Emeklilik Fonları)
    print(f"[TEFAS] Fetching EMK funds...")
    try:
        emk_data = tefas.fetch(start=date_str, kind="EMK")
        if emk_data is not None and not emk_data.empty:
            print(f"[TEFAS] ✅ {len(emk_data)} EMK funds fetched")
            all_data.append(emk_data)
        else:
            print(f"[TEFAS] ⚠️ No EMK data available")
    except Exception as e:
        print(f"[TEFAS] ❌ EMK fetch error: {str(e)[:100]}")

    # Fetch BYF funds (Borsa Yatırım Fonları)
    print(f"[TEFAS] Fetching BYF funds...")
    try:
        byf_data = tefas.fetch(start=date_str, kind="BYF")
        if byf_data is not None and not byf_data.empty:
            print(f"[TEFAS] ✅ {len(byf_data)} BYF funds fetched")
            all_data.append(byf_data)
        else:
            print(f"[TEFAS] ⚠️ No BYF data available")
    except Exception as e:
        print(f"[TEFAS] ❌ BYF fetch error: {str(e)[:100]}")

    # Combine all data
    if all_data:
        combined = pd.concat(all_data, ignore_index=True)
        print(f"\n[TEFAS] ✅ Total funds fetched: {len(combined)}")
        return combined
    else:
        print(f"\n[TEFAS] ❌ No data fetched")
        return None


def save_to_database(data, usdtry_rate):
    """Save fund data to PostgreSQL database with historical tracking"""

    print("\n[DB] 💾 Saving to database...")
    print("=" * 60)

    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()

        print(f"[DB] ✅ Connected to PostgreSQL")

        # Prepare data for insertion
        records = []
        for _, row in data.iterrows():
            try:
                price_try = float(row.get("price", 0))
                if price_try <= 0:
                    continue

                price_usd = price_try / usdtry_rate

                symbol = str(row.get("code", ""))
                date = str(row.get("date", ""))
                name = str(row.get("title", ""))
                fund_type = str(row.get("kind", "YAT"))

                # Create record
                record = (
                    symbol,  # symbol
                    date,  # date
                    price_try,  # price (TRY)
                    price_usd,  # price_usd
                    name,  # name
                    fund_type,  # fund_type
                    "tefas-crawler",  # source
                )
                records.append(record)

            except Exception as e:
                print(f"[DB] ⚠️ Skipping invalid row: {str(e)[:50]}")
                continue

        if not records:
            print("[DB] ❌ No valid records to insert")
            conn.close()
            return 0

        # Insert with ON CONFLICT DO NOTHING to preserve historical data
        # Primary key is (symbol, date), so duplicates won't be inserted
        insert_sql = """
            INSERT INTO fund_prices 
            (symbol, date, price, price_usd, name, fund_type, source, updated_at)
            VALUES %s
            ON CONFLICT (symbol, date) DO NOTHING
        """

        # Add timestamp to each record
        records_with_timestamp = [(*r, datetime.now()) for r in records]

        execute_values(
            cur, insert_sql, records_with_timestamp, template=None, page_size=100
        )

        inserted_count = cur.rowcount
        conn.commit()

        print(f"[DB] ✅ Successfully saved {len(records)} fund prices")
        print(f"[DB] ✅ Inserted {inserted_count} new records")
        print(f"[DB] ℹ️ Historical data preserved (no overwrites)")

        cur.close()
        conn.close()

        return len(records)

    except Exception as e:
        print(f"[DB] ❌ Database error: {e}")
        if "conn" in locals() and conn:
            conn.close()
        return 0


def main():
    """Main execution function"""

    print("\n" + "=" * 60)
    print("TEFAS Historical Fund Price Scraper")
    print("=" * 60)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    start_time = datetime.now()

    # Get USDTRY exchange rate
    usdtry_rate = get_usdtry_rate()

    # Fetch TEFAS data
    data = fetch_tefas_data()

    if data is None or data.empty:
        print("\n[RESULT] ❌ No data fetched. Exiting.")
        sys.exit(1)

    # Save to database
    saved_count = save_to_database(data, usdtry_rate)

    # Summary
    duration = (datetime.now() - start_time).total_seconds()

    print("\n" + "=" * 60)
    print("SCRAPER SUMMARY")
    print("=" * 60)
    print(f"✅ Duration: {duration:.2f} seconds")
    print(f"✅ Funds processed: {len(data)}")
    print(f"✅ Funds saved: {saved_count}")
    print(f"✅ USDTRY rate: {usdtry_rate}")
    print(f"✅ Date: {data['date'].iloc[0] if not data.empty else 'N/A'}")
    print("=" * 60)
    print(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)


if __name__ == "__main__":
    main()
