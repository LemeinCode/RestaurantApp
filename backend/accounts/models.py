# from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# from django.db import models

# class CustomUserManager(BaseUserManager):
#     def create_user(self, email, name, password=None, role='customer'):
#         if not email:
#             raise ValueError("Users must have an email address")
#         email = self.normalize_email(email)
#         user = self.model(email=email, name=name, role=role)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, name, password):
#         user = self.create_user(email, name, password, role='admin')
#         user.is_superuser = True
#         user.is_staff = True
#         user.save(using=self._db)
#         return user

# class CustomUser(AbstractBaseUser, PermissionsMixin):
#     ROLE_CHOICES = [
#         ('customer', 'Customer'),
#         ('manager', 'Manager'),
#         ('admin', 'Admin'),
#     ]

#     id = models.AutoField(primary_key=True)
#     name = models.CharField(max_length=255)
#     email = models.EmailField(unique=True)
#     password = models.CharField(max_length=255)
#     role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)

#     objects = CustomUserManager()

#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['name']

#     def __str__(self):
#         return self.email

# class Order(models.Model):
#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # ✅ Use CustomUser here
#     meal_name = models.CharField(max_length=255)
#     price = models.DecimalField(max_digits=10, decimal_places=2)
#     quantity = models.PositiveIntegerField()
#     total_price = models.DecimalField(max_digits=10, decimal_places=2)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Order {self.id} - {self.meal_name} by {self.user.name}"



from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
import uuid

class CustomUserManager(BaseUserManager):
    def create_user(self, email, name, password=None, role='customer'):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, role=role)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password):
        user = self.create_user(email, name, password, role='admin')
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('manager', 'Manager'),
        ('admin', 'Admin'),
    ]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

class Order(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    meal_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    order_id = models.CharField(default=uuid.uuid4, max_length=255)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.meal_name} by {self.user.name}"

class MenuItem(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100, default="main")
    available = models.BooleanField(default=True)
    inventory = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='menu_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class CustomerFeedback(models.Model):
    RATING_CHOICES = [
        (1, '1 - Poor'),
        (2, '2 - Fair'),
        (3, '3 - Good'),
        (4, '4 - Very Good'),
        (5, '5 - Excellent'),
    ]
    
    ENJOYMENT_CHOICES = [
        ('Taste', 'Taste'),
        ('Presentation', 'Presentation'),
        ('Service', 'Service'),
        ('Ambience', 'Ambience'),
        ('Other', 'Other'),
    ]
    
    RECOMMEND_CHOICES = [
        (True, 'Yes'),
        (False, 'No'),
    ]

    user = models.ForeignKey(
        CustomUser, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='feedbacks'
    )
    rating = models.PositiveSmallIntegerField(
        choices=RATING_CHOICES,
        help_text="1=Poor, 5=Excellent"
    )
    enjoyed_most = models.CharField(
        max_length=20,
        choices=ENJOYMENT_CHOICES,
        verbose_name="What did you enjoy most about your meal"
    )
    other_feedback = models.TextField(
        blank=True,
        null=True,
        verbose_name="Additional feedback"
    )
    would_recommend = models.BooleanField(
        choices=RECOMMEND_CHOICES,
        verbose_name="Would you recommend our restaurant?"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Customer Feedback"
        verbose_name_plural = "Customer Feedbacks"
        ordering = ['-created_at']

    def __str__(self):
        return f"Feedback #{self.id} - Rating: {self.rating}/5"    