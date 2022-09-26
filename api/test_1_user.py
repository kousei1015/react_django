import json
from django.test import TestCase
from rest_framework.test import APITestCase
from .models import User
from rest_framework.test import APIClient
from rest_framework import status

REGISTER_USER_URL = '/api/register/'
PROFILE_URL = '/api/profile/'

class  UnauthorizedUserApiTests(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_new_registration(self):
        data = {"email": "test@gmail.com",
                "password": "dummypass"}
        res = self.client.post(REGISTER_USER_URL, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email=data['email'])
        self.assertTrue(
            user.check_password(data['password'])
        )


    def test_by_same_credentials(self):
        data = {"email": "dummy@gmail.com", "password": "dummypassword"}
        User.objects.create_user(**data)
        res = self.client.post(REGISTER_USER_URL, data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_JWT(self):
        data = {"email": "dummy@gmail.com", "password": "dummypassword"}
        User.objects.create_user(**data)
        res = self.client.post("/authen/jwt/create/", data)

        self.assertIn("access", res.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_wrong_password_credentials(self):
        User.objects.create_user(email='dummy@gmail.com', password='dummy_pw')
        data = {'email': 'dummy@gmail.com', 'password': 'wrong'}
        res = self.client.post("/authen/jwt/create/", data)

        self.assertNotIn('access', res.data)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_exist_credentials(self):
        payload = {'email': 'dummy', 'password': 'dummypassword'}
        res = self.client.post("/authen/jwt/create", payload)

        self.assertNotIn("refresh", "access", res.data)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_empty_field(self):
        data = {'email': 'dummy', 'password': ''}
        res = self.client.post("/authen/jwt/create", data)
        self.assertNotIn("refresh", "access", res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthorized_get_user_profile(self):
        res = self.client.get(PROFILE_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    




