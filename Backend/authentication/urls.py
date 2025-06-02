from django.contrib import admin
from django.urls import path, include
import knox.views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('accounts.urls')),
    path('logout/', knox.views.LogoutView.as_view(),name='knox_logout'),
]
