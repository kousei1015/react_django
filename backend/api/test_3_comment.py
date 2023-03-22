from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from .models import Comment, Post, User
from .serializers import CommentSerializer
from django.urls import reverse

POST_URL = "/api/post/"
COMMENT_URL = "/api/comment/"

def create_user(userPost):
    return Post.objects.create(userPost=userPost)

def create_comment(userComment, post, **params):
    defaults = {
        'text': 'test comment'
    }
    defaults.update(params)
    return Comment.objects.create(userComment=userComment, post=post, **defaults)

def create_post(userPost, **params):
    defaults = {
        'placeName': 'test',
        'description': 'test',
        'accessStars': 3,
        'congestionDegree': 3,
    }
    defaults.update(params)
    return Post.objects.create(userPost=userPost, **defaults)

def detail_post_url(comment_id):
    return reverse('api:comment-detail', args=[comment_id])

class AuthorizedCommentApiTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='dummy@gmail.com', password='dummypassword')
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_comments_get(self):
        post = create_post(userPost=self.user)
        create_comment(userComment = self.user, post=post)
        res = self.client.get(COMMENT_URL)
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_comment_create(self):
        post = create_post(userPost=self.user)
        data = {
            'userComment': self.user.id,
            'text': 'test comment',
            'post': post.id,
        }
        res = self.client.post(COMMENT_URL, data)
        comment = Comment.objects.get(id=res.data['id'])
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(data['text'], comment.text)
        self.assertEqual(data['post'], comment.post.id)
        self.assertEqual(data['userComment'], comment.userComment.id)

    def test_comment_delete(self):
        post = create_post(userPost=self.user)
        comment = create_comment(userComment=self.user, post=post)
        self.assertEqual(1, Comment.objects.count())
        url = detail_post_url(comment.id)
        self.client.delete(url)
        self.assertEqual(0, Comment.objects.count())

    # 以下のテストは、投稿したユーザー以外がdeleteメソッドを送ったら、403ステータスコードを返すかどうかのテスト
    def test_delete_other_user_comment_forbidden(self):
        user = User.objects.create_user(email='aaaa@gmail.com', password='aaaa')
        post = create_post(userPost=user)
        comment = create_comment(userComment=user, post=post)
        url = detail_post_url(comment.id)
        self.assertEqual(comment.text, 'test comment')
        res = self.client.delete(url, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class UnAuthorizedCommentApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_comments_when_unatuhorized(self):
        user = User.objects.create_user(email='dummy@gmail.com', password='dummypassword')
        post = create_post(userPost=user)
        create_comment(userComment=user, post=post)
        res = self.client.get(COMMENT_URL)
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)