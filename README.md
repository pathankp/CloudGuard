# DCIM Backend

This is the backend for the DCIM (Data Center Infrastructure Management) application, built with Django and Django Rest Framework.

## Local Setup

### Prerequisites

*   Python 3.8+
*   pip (Python package installer)
*   PostgreSQL (or SQLite for development if preferred)

### Steps

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd dcim-backend 
    ```

2.  **Create and activate a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Database Settings:**

    The project is configured to use PostgreSQL by default. You'll need to:
    *   Create a PostgreSQL database (e.g., `dcim_db`).
    *   Create a database user (e.g., `dcim_user`) with a password.
    *   Grant the user privileges to the database.

    Update the `DATABASES` setting in `dcim_backend/dcim_backend/settings.py` with your database credentials:

    ```python
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": "dcim_db",        # Your database name
            "USER": "dcim_user",      # Your database user
            "PASSWORD": "your_password", # Your database password
            "HOST": "localhost",      # Or your DB host
            "PORT": "5432",           # Or your DB port
        }
    }
    ```

    **Alternatively, for development with SQLite (as used during initial setup due to environment constraints):**
    Ensure the `DATABASES` setting in `dcim_backend/dcim_backend/settings.py` looks like this:
    ```python
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3', # BASE_DIR is defined in settings.py
        }
    }
    ```
    If you switch to SQLite, you might need to remove `psycopg2-binary` from `requirements.txt` if you don't have PostgreSQL development headers installed locally.

5.  **Run database migrations:**
    ```bash
    cd dcim_backend 
    python manage.py makemigrations api
    python manage.py migrate
    ```

6.  **Create a superuser (for accessing the Django admin):**
    ```bash
    python manage.py createsuperuser
    ```
    Follow the prompts to set a username, email, and password.

7.  **Run the development server:**
    ```bash
    python manage.py runserver
    ```
    The application will typically be available at `http://127.0.0.1:8000/`.

### API Endpoints

*   **Clients:**
    *   `GET, POST /api/clients/`
    *   `GET, PUT, DELETE /api/clients/<id>/`
*   **Servers:**
    *   `GET, POST /api/servers/`
    *   `GET, PUT, DELETE /api/servers/<unique_id>/`
*   **Authentication:**
    *   `POST /api/api-token-auth/` : Obtain an authentication token by sending `username` and `password`.

    Authenticated requests should include the token in the `Authorization` header:
    `Authorization: Token <your_token>`

## Project Structure
```
dcim_backend/
├── api/                  # Django app for the API
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py         # API data models
│   ├── serializers.py    # DRF serializers
│   ├── tests.py
│   ├── urls.py           # API specific URLs
│   └── views.py          # DRF ViewSets
├── dcim_backend/         # Django project configuration
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py       # Project settings
│   ├── urls.py           # Main project URLs
│   └── wsgi.py
├── manage.py             # Django's command-line utility
└── requirements.txt      # Project dependencies
└── README.md             # This file
```
