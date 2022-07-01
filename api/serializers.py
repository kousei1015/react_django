from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Profile, Post, Comment

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ('id','email','password')
        extra_kwargs= {'password': {'write_only': True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=Profile
        fields = ('id', 'nickName', 'userProfile', 'img')
        extra_kwargs = {'userProfile': {'read_only': True}}

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        
        extra_kwargs = {'userPost': {'read_only': True}}

class PostDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'text', 'userComment','post')
        extra_kwargs = {'userComment': {'read_only': True}}