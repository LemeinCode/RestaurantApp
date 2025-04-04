from rest_framework import serializers
from .models import Order, CustomUser, MenuItem, CustomerFeedback

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'email', 'role']

class OrderSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)  # Include user's name

    class Meta:
        model = Order
        fields = ['id', 'user_name', 'meal_name', 'price', 'quantity', 'total_price', 'created_at']


class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'

class CustomerFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerFeedback
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
