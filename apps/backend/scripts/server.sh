#!/bin/bash

echo "🚀 Starting QuickVendor Development Server"

# Start Docker containers
docker-compose up -d

# Wait a moment for services to be ready
sleep 5

# Start Django development server
echo "🌐 Starting Django development server..."
python manage.py runserver 0.0.0.0:8000