from rest_framework import generics, pagination, response
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from . import serializers
from .models import Profile, Post, Comment, User, Tag
from rest_framework.views import APIView
from . import custompermissions


class CustomPagination(pagination.PageNumberPagination):
    page_size = 9

    def get_paginated_response(self, data):
        return response.Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'current_papge': self.page.number,
            'total_pages': self.page.paginator.num_pages,
            'results': data,
        })



class CreateUserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = (AllowAny,)



class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)


    def perform_create(self, serializer):
        serializer.save(userProfile=self.request.user)


class MyProfileListView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer
    def get_queryset(self):
        return self.queryset.filter(userProfile=self.request.user)


class PostViewSet(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = serializers.PostSerializer
    pagination_class = CustomPagination
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(userPost=self.request.user)


class AccessSortViewSet(generics.ListAPIView):
    serializer_class = serializers.PostSerializer
    queryset = Post.objects.all().order_by('-accessStars')
    pagination_class = CustomPagination
    permission_classes = (IsAuthenticatedOrReadOnly,)


class CongestionSortViewSet(generics.ListAPIView):
    serializer_class = serializers.PostSerializer
    queryset = Post.objects.all().order_by('-congestionDegree')
    pagination_class = CustomPagination
    permission_classes = (IsAuthenticatedOrReadOnly,)


class PostDetailViewSet(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = serializers.PostDetailSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, custompermissions.PostOwnerPermission,)



class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, custompermissions.CommentOwnerPermission,)
    
    def perform_create(self, serializer):
        serializer.save(userComment=self.request.user)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = serializers.TagSerializer

    def perform_create(self, serializer):
        serializer.save(userTag=self.request.user)