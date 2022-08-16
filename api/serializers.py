from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Profile, Post, Comment, User



class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=Profile
        fields = ['id','userProfile', 'nickName', 'created_on','img']
        extra_kwargs = {'userProfile': {'read_only': True}}

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(many=False, read_only=True)
    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user
    class Meta:
        model = get_user_model()
        fields = ('id','email','password', 'profile')
        extra_kwargs= {'password': {'write_only': True}, 'email': {'write_only': True}}


class PostSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Post
        fields = ['id', 'userPost', 'placeName', 'description', 'accessStars', 'congestionDegree', 'img']
        extra_kwargs = {'userPost': {'read_only': True}}

class PostDetailSerializer(serializers.ModelSerializer):
    userPost = UserSerializer(many=False, read_only=True)
    class Meta:
        model = Post
        fields = ('id', 'placeName', 'description', 'accessStars', 'congestionDegree', 'img', 'userPost', )


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'text', 'userComment','post')
        extra_kwargs = {'userComment': {'read_only': True}}




