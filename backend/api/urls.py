from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

app_name = 'api'

router = DefaultRouter()
router.register('profile',views.ProfileViewSet)
router.register('comment', views.CommentViewSet)
router.register('tags', views.TagViewSet)

urlpatterns = [
    path('register/', views.CreateUserView.as_view(), name='register'),
    path('myprofile/', views.MyProfileListView.as_view(), name='myprofile'),
    path('',include(router.urls)),
    path('post/', views.PostViewSet.as_view(), name='post'),
    path('post/<int:pk>', views.PostDetailViewSet.as_view(), name='post_detail'),
]