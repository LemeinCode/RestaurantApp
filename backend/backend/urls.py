"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import check_password, make_password
from accounts.models import CustomUser  

@api_view(['POST'])
def register_user(request):
    data = request.data
    user = CustomUser.objects.create(
        name=data['name'],
        email=data['email'],
        password=make_password(data['password']),
        role='customer'
    )
    return Response({"message": "User registered successfully"}, status=201)

@api_view(['POST'])
def login_user(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    try:
        user = CustomUser.objects.get(email=email)
        if check_password(password, user.password):
            login(request, user)
            return Response({"message": "Login successful"}, status=200)
        else:
            return Response({"error": "Invalid credentials"}, status=400)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

# Define URL patterns
urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('login/', login_user, name='login_user'),
]
