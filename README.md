# Restaurant App Setup Guide

This guide provides step-by-step instructions for setting up the React and Django applications on a local development environment.

---

## Prerequisites

Ensure that you have the following installed on your system:


Python 3.x (Download)

Node.js & npm (Download)

PostgreSQL (Download)

pgAdmin (Download)

Code IDE of your choice

---

## Cloning the Repository

Open a terminal and navigate to your preferred directory.

Clone the repository:
```bash
git clone https://github.com/LemeinCode/RestaurantApp.git
```

Navigate into the project directory:
```bash
cd RestaurantApp
```
---

## Setting up the Django Backend

Navigate to the backend directory:
```bash
cd backend
```
Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```
Install dependencies:
```bash
pip install -r requirements.txt
```
Set up the PostgreSQL database:

Open pgAdmin and create a new database called cozycorner.

Update the DATABASES setting in backend/settings.py with your PostgreSQL credentials.
```bash
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'cozycorner',  # Your PostgreSQL database name
        'USER': 'enther the postgres user name',      # Your PostgreSQL user
        'PASSWORD': 'enter your password',  # Use the actual password
        'HOST': 'localhost', 
        'PORT': '5432',       
    }
}
```
Apply migrations:
```bash
python manage.py migrate
```
Create a superuser:
```bash
python manage.py createsuperuser
```

Start the Django development server:
```bash
python manage.py runserver
```
---
## Setting up the React Frontend


Navigate to the frontend directory:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Start the React development server:
```bash
npm start
```
Running the Full Application

The Django backend runs at http://127.0.0.1:8000/

The React frontend runs at http://localhost:3000/


