from rest_framework import generics
from rest_framework import viewsets, permissions
from rest_framework.permissions import AllowAny
from . import serializers
from .models import Profile, Post, Comment, User, Tag
from rest_framework.views import APIView
from . import custompermissions

class CreateUserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = (AllowAny,)

    

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer
 

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

    def perform_create(self, serializer):
        serializer.save(userPost=self.request.user)



class PostDetailViewSet(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = serializers.PostDetailSerializer
    permission_classes = (permissions.IsAuthenticated, custompermissions.OwnerPermission,)
    
  

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    
    def perform_create(self, serializer):
        serializer.save(userComment=self.request.user)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = serializers.TagSerializer

    def perform_create(self, serializer):
        serializer.save(userTag=self.request.user)

    

    



       