from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from .models import CustomUser

# Create your views here.

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
