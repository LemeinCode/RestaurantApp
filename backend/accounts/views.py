from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser, Order
from .serializers import UserSerializer, OrderSerializer
import json
from decimal import Decimal
from collections import defaultdict
from datetime import datetime, timedelta

@api_view(['POST'])
def register_user(request):
    data = request.data

    if not data.get("name") or not data.get("email") or not data.get("password"):
        return Response({"error": "All fields are required"}, status=400)

    user = CustomUser.objects.create(
        name=data['name'],
        email=data['email'],
        password=make_password(data['password']),
        role='customer'
    )
    return Response({"message": "User registered successfully"}, status=201)

# @api_view(['POST'])
# def login_user(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    if not user.check_password(password):
        return Response({"error": "Invalid credentials"}, status=400)

    refresh = RefreshToken.for_user(user)
    
    return Response({
        "token": str(refresh.access_token),
        "refresh": str(refresh),
        "message": "Login successful"
    }, status=200)

@api_view(['POST'])
def login_user(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    if not user.check_password(password):
        return Response({"error": "Invalid credentials"}, status=400)

    refresh = RefreshToken.for_user(user)
    
    return Response({
        "token": str(refresh.access_token),
        "refresh": str(refresh),
        "role": user.role,  
        "message": "Login successful"
    }, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_logged_in_user(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response({"user": serializer.data}, status=200)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def place_order(request):
    user = request.user
    orders = request.data.get("orders", [])

    if not orders:
        return Response({"error": "No orders provided"}, status=400)

    total_order_price = 0
    order_list = []

    for order in orders:
        if "meal_name" not in order or "price" not in order or "quantity" not in order:
            return Response({"error": "Each order must have 'meal_name', 'price', and 'quantity'"}, status=400)

        price = order["price"]
        quantity = order["quantity"]
        total_price = price * quantity

        new_order = Order.objects.create(
            user=user,
            meal_name=order["meal_name"],
            price=price,
            quantity=quantity,
            total_price=total_price,
        )

        order_list.append(new_order)
        total_order_price += total_price

    return Response({
        "message": "Order placed successfully!",
        "total": total_order_price,
        "orders": OrderSerializer(order_list, many=True).data
    }, status=201)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_orders(request):
    orders = Order.objects.all()

    if not orders.exists():
        print("❌ No orders found in the database.")  # Debugging log
        return Response([], status=200)  

    serializer = OrderSerializer(orders, many=True)
    print("✅ Orders found:", serializer.data)  # Debugging log

    return Response(serializer.data, status=200)

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_dashboard_stats(request):
    # Check if user is admin or manager (optional)
    user = request.user
    if user.role not in ['admin', 'manager']:
        # For development/testing, we'll allow access, but in production you might want to restrict
        pass
        # return Response({"error": "You don't have permission to access this data"}, status=403)
    
    # Get all orders for statistics
    orders = Order.objects.all()
    
    # Calculate total sales
    total_sales = orders.aggregate(total=Sum('total_price'))['total'] or 0
    
    # Count unique users who placed orders
    unique_users = orders.values('user').distinct().count()
    
    # Count total orders
    total_orders = orders.count()
    
    # Get daily sales data for the graph
    # First, get orders grouped by date with sum of total_price
    daily_sales_query = orders.annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(
        amount=Sum('total_price')
    ).order_by('date')
    
    # Convert to the format needed for the frontend chart
    daily_sales = []
    for entry in daily_sales_query:
        daily_sales.append({
            'date': entry['date'].strftime('%Y-%m-%d'),
            'amount': float(entry['amount'])
        })
    
    # If there's no data, generate sample data for the last 7 days
    if not daily_sales:
        today = datetime.now().date()
        for i in range(7):
            day = today - timedelta(days=i)
            daily_sales.append({
                'date': day.strftime('%Y-%m-%d'),
                'amount': 0
            })
        daily_sales.reverse()  # Put in ascending order
    
    # Build response
    response_data = {
        'totalSales': float(total_sales),
        'activeUsers': unique_users,
        'totalOrders': total_orders,
        'dailySales': daily_sales
    }
    
    return Response(response_data)