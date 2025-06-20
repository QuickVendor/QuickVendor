#!/bin/bash

echo "🚀 Setting up QuickVendor Development Environment"

# Start Docker containers
echo "📦 Starting Docker containers..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Install Python dependencies
echo "📋 Installing Python dependencies..."
pip install -r requirements.txt

# Run migrations
echo "🔄 Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser if it doesn't exist
echo "👤 Creating superuser..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@quickvendor.com', 'admin123')
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
"

echo "✅ Development environment setup complete!"
echo "🌐 Django Admin: http://localhost:8000/admin/"
echo "🔍 Database Admin: http://localhost:8080/"
echo "📊 API Health: http://localhost:8000/api/health/"