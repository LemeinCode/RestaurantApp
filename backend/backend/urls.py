from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from accounts.views import (
    register_user, login_user, get_logged_in_user, 
    place_order, get_all_orders, get_dashboard_stats, menu_list, add_menu_item,
    update_menu_item, top_three_meals, user_purchase_stats, submit_feedback, get_all_feedback  
)

urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('login/', login_user, name='login_user'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/', get_logged_in_user, name='get_logged_in_user'),
    path("place-order/", place_order, name="place_order"),
    path("admin/orders/", get_all_orders, name="get_all_orders"), 
    path("admin/dashboard-stats/", get_dashboard_stats, name="get_dashboard_stats"),  
    path('menu/', menu_list, name='menu-list'), 
    path('menu/add/', add_menu_item, name='add-menu-item'),
    path('menu/edit/<int:item_id>/', update_menu_item, name='update-menu-item'),
    path('admin/top-three-meals/', top_three_meals, name='top-three-meals'),
    path('admin/user-purchase-stats/', user_purchase_stats, name='user-purchase-stats'),
    path('feedback/', submit_feedback, name='submit_feedback'),
     path('admin/feedback/', get_all_feedback, name='get_all_feedback'),
]
