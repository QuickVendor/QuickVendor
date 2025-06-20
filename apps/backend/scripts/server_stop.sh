#!/bin/bash

echo "🛑 Stopping QuickVendor Development Environment"

# Stop Django server (if running in background)
pkill -f "python manage.py runserver"

# Stop Docker containers
docker-compose down

echo "✅ Development environment stopped"