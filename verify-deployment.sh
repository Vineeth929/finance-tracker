#!/bin/bash

echo "🔍 Verifying Finance Tracker Deployment..."
echo ""

RAILWAY_URL="https://glistening-hope-production.up.railway.app/api"
LOCAL_URL="http://localhost:5000/api"

echo "Testing RAILWAY endpoints:"
echo "=========================="

endpoints=(
  "health"
  "markets/crypto"
  "markets/overview"
  "news"
  "insights/health-score"
  "insights/spending-insights"
)

for endpoint in "${endpoints[@]}"; do
  response=$(curl -s -w "\n%{http_code}" "$RAILWAY_URL/$endpoint")
  status=$(echo "$response" | tail -n1)
  echo "  $endpoint: $status"
done

echo ""
echo "Testing LOCAL endpoints (localhost:5000):"
echo "=========================================="

for endpoint in "${endpoints[@]}"; do
  response=$(curl -s -w "\n%{http_code}" "$LOCAL_URL/$endpoint" 2>/dev/null)
  status=$(echo "$response" | tail -n1)
  echo "  $endpoint: $status"
done

echo ""
echo "✅ Verification complete"
