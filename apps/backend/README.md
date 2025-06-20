# Quick Vendor

Quick Vendor is a multi-vendor shopping platform built with Django. This project provides a backend API for managing users and vendor-related functionalities.

## Project Structure

```
backend/
├── quickvendor/          # Django project directory
│   ├── __init__.py
│   ├── settings.py       # Project settings, including database configuration
│   ├── urls.py           # URL routing for the project
│   ├── wsgi.py           # WSGI entry point
│   └── asgi.py           # ASGI entry point
├── users/                # Users app directory
│   ├── __init__.py
│   ├── admin.py          # Admin site registration for models
│   ├── apps.py           # App configuration
│   ├── models.py         # User-related data models
│   ├── views.py          # View functions for handling requests
│   ├── serializers.py     # Serializers for data conversion
│   ├── urls.py           # URL routing for the users app
│   ├── migrations/       # Database migrations
│   │   └── __init__.py
│   └── tests.py          # Test cases for the users app
├── manage.py              # Command-line utility for Django
├── requirements.txt       # Project dependencies
├── .env                   # Environment variables
└── README.md              # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd backend
   ```

2. **Create a virtual environment:**
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the backend directory and add your PostgreSQL database connection details:
   ```
   DATABASE_NAME=your_database_name
   DATABASE_USER=your_database_user
   DATABASE_PASSWORD=your_database_password
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   SECRET_KEY=your_secret_key
   ```

5. **Run migrations:**
   ```
   python manage.py migrate
   ```

6. **Run the development server:**
   ```
   python manage.py runserver
   ```

## Usage

- Access the API at `http://localhost:8000/`.
- Use the Django admin interface at `http://localhost:8000/admin/` to manage users and other data.

## License

This project is licensed under the MIT License.