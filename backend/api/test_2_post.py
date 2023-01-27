from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from .models import User, Post, Tag
from .serializers import PostSerializer, PostDetailSerializer
from django.urls import reverse

POST_URL = "/api/post/"


def create_user(userPost):
  return Post.objects.create(userPost=userPost)

def create_post(userPost, **params):
    defaults = {
        'placeName': 'test',
        'description': 'test',
        'accessStars': 3,
        'congestionDegree': 3,
    }
    defaults.update(params)
    return Post.objects.create(userPost=userPost, **defaults)


def detail_post_url(post_id):
    return reverse('api:post_detail', args=[post_id])



class AuthorizedPostApiTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(email='dummy@gmail.com', password='dummypassword')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        
        

    def test_get_all_posts(self):
        create_post(userPost=self.user)
        res = self.client.get(POST_URL)
        posts = Post.objects.all().order_by('id')
        serializer = PostSerializer(posts, many=True)
        res_result = res.json().get('results')
        ''' "res.data" にはページネーションを追加したことで、"count", "next" といった要素が追加されている。
        そうなると serializer.data と一致せず、48行目の箇所でエラーが起こるので results の要素のみを取得している '''
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res_result, serializer.data)

    def test_create_new_post(self):
        data = {
          'placeName': 'sample',
          'description': 'sample',
          'accessStars': 3,
          'congestionDegree': 3,
          'tags': [{'name': 'tag'}, {'name': 'tag2'}]
        }
        res = self.client.post(POST_URL, data, format='json')
        post = Post.objects.get(id=res.data['id'])
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(data['placeName'], post.placeName)
        self.assertEqual(data['description'], post.description)
        self.assertEqual(data['accessStars'], post.accessStars)
        self.assertEqual(data['congestionDegree'], post.congestionDegree)

    def test_get_single_post_detail(self):
        post = create_post(userPost=self.user)
        url = detail_post_url(post.id)
        res = self.client.get(url)
        serializer = PostDetailSerializer(post)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_post_with_empty_field(self):
        data = {
            'placeName': 'sample',
            'description': '',
            'accessStars': 3,
            'congestionDegree': 3,
            'tags': [{'name': 'tag'}]
        }
        res = self.client.post(POST_URL, data, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_post_with_over_number(self):
        data = {
            'placeName': 'sample',
            'description': 'sample',
            'accessStars': 10,
            'congestionDegree': 10,
            'tags': [{'name': 'tag'}]
        }
        res = self.client.post(POST_URL, data, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_put(self):
        post = create_post(userPost=self.user)
        data = {
            'placeName': 'sample',
            'description': 'sample',
            'accessStars': 5,
            'congestionDegree': 5,
        }
        url = detail_post_url(post.id)
        self.assertEqual(post.placeName, 'test')
        self.client.put(url, data, format='json')
        post.refresh_from_db()
        self.assertEqual(post.placeName, data['placeName'])

    def test_post_tag_update(self):
        post = create_post(userPost=self.user)
        payload = {'tags': [{'name': 'tag'}]}

        url = detail_post_url(post.id)
        res = self.client.patch(url, payload, format='json')

    def test_delete_post(self):
        post = create_post(userPost=self.user)
        self.assertEqual(1, Post.objects.count())
        url = detail_post_url(post.id)
        self.client.delete(url)
        self.assertEqual(0, Post.objects.count())

class UnAuthorizedPostApiTests(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_create_post_when_unatuhorized(self):
        res = self.client.get(POST_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        
    

      
