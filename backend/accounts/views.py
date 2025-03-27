from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser, Order

@api_view(['POST'])
def register_user(request):
    data = request.data

    # Validate input
    if not data.get("name") or not data.get("email") or not data.get("password"):
        return Response({"error": "All fields are required"}, status=400)

    # Create user
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

    # Find user by email
    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    # Authenticate user
    if not user.check_password(password):
        return Response({"error": "Invalid credentials"}, status=400)

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        "token": str(refresh.access_token),
        "refresh": str(refresh),
        "message": "Login successful"
    }, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_logged_in_user(request):
    user = request.user
    return Response({
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }, status=200)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def place_order(request):
    user = request.user  # Authenticated user
    orders = request.data.get("orders", [])  # List of orders

    if not orders:
        return Response({"error": "No orders provided"}, status=400)

    total_order_price = 0

    for order in orders:
        # Validate order fields
        if "meal_name" not in order or "price" not in order or "quantity" not in order:
            return Response({"error": "Each order must have 'meal_name', 'price', and 'quantity'"}, status=400)
        
        price = order["price"]
        quantity = order["quantity"]
        total_price = price * quantity

        # Save order to DB
        Order.objects.create(
            user=user,
            meal_name=order["meal_name"],
            price=price,
            quantity=quantity,
            total_price=total_price,
        )

        total_order_price += total_price

    return Response({"message": "Order placed successfully!", "total": total_order_price}, status=201)
