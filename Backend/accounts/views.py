from django.shortcuts import render
from rest_framework import viewsets,permissions
from .serializers import * 
from .models import * 
from rest_framework.response import Response    
from django.contrib.auth import get_user_model,authenticate
from knox.models import AuthToken

User = get_user_model()


class LoginViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)
            if user:
                _, token = AuthToken.objects.create(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'token': token
                })
            else:
                return Response({'error': 'Invalid credentials'}, status=400)
        else:
            return Response(serializer.errors, status=400)




class RegisterViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny] #oloi mporoyn na kanoun register
    queryset = User.objects.all()
    serializer_class = RegisterSerializer   

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else: 
            return Response(serializer.errors, status=400)
        
