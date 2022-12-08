from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Profile, Post, Comment, User, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']
        read_only_fields = ['id']

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
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = Post
        fields = ('id', 'userPost', 'placeName', 'description', 'accessStars', 'congestionDegree', 'img', 'tags')
        extra_kwargs = {'userPost': {'read_only': True}}
        read_only_fields = ['id']


    def _get_or_create_tags(self, tags, post):
        auth_user = self.context['request'].user
        for tag in tags:
            tag_obj, created = Tag.objects.get_or_create(
                userTag=auth_user,
                **tag
            )
            post.tags.add(tag_obj)

    def create(self, validated_data):

        tags = validated_data.pop('tags', [])
        post = Post.objects.create(**validated_data)
        self._get_or_create_tags(tags, post)
        
        

        return post

    def update(self, instance, validated_data):

        tags = validated_data.pop('tags', None)
        #タグが存在する場合
        if tags is not None:
            instance.tags.clear()
            self._get_or_create_tags(tags, instance)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class PostDetailSerializer(PostSerializer):
    userPost = UserSerializer(many=False, read_only=True)

    class Meta(PostSerializer.Meta):
        fields = PostSerializer.Meta.fields

#class PostDetailSerializer(serializers.ModelSerializer):
#    userPost = UserSerializer(many=False, read_only=True)
#    class Meta:
#        model = Post
#        fields = ('id', 'placeName', 'description', 'accessStars', 'congestionDegree', 'img', 'userPost', 'tags')
        


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'text', 'userComment','post')
        extra_kwargs = {'userComment': {'read_only': True}}

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name')




