#!/bin/bash
# Quick setup script for OTACORE

echo "🚀 OTACORE Setup Script"
echo "======================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "📋 Creating .env file from env.example..."
  cp env.example .env
  echo "✅ .env created. Please edit it with your database credentials."
  exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

echo ""
echo "✅ Setup complete! You can now run:"
echo "   npm start     - Start the server"
echo "   npm run dev   - Start with hot reload (nodemon)"
echo ""
echo "📖 Documentation:"
echo "   - SETUP.md              - Database setup guide"
echo "   - DATABASE_SCHEMA.md    - Schema and model mapping"
echo "   - database/example.sql  - SQL schema file"
