from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.dispatch import receiver
from django.db.models.signals import post_save

def upload_avatar_path(instance, filename):
    ext = filename.split('.')[-1]
    return '/'.join(['avatars', str(instance.userProfile.id)+str(instance.nickName)+str(".")+str(ext)])

def upload_post_path(instance, filename):
    ext = filename.split('.')[-1]
    return '/'.join(['posts', str(instance.userPost.id)+str(instance.placeName)+str(".")+str(ext)])

class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('email is must')

        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using= self._db)

        return user

class User(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

class Profile(models.Model):
    nickName = models.CharField(max_length=20, default='User')
    userProfile = models.OneToOneField(
        settings.AUTH_USER_MODEL, related_name='profile',
        on_delete=models.CASCADE
    )
    created_on = models.DateTimeField(auto_now_add=True)
    img = models.ImageField(blank=True, null=True, upload_to=upload_avatar_path)

    def __str__(self):
        return self.nickName

    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(userProfile=instance)

    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()


class Post(models.Model):
    placeName = models.CharField(max_length=30, blank=False)
    description = models.TextField(max_length=200, blank=False)
    userPost = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='userPost',
        on_delete=models.CASCADE
    )
    accessStars = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    congestionDegree = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    img = models.ImageField(blank=True, null=True, upload_to=upload_post_path)
    tags = models.ManyToManyField('Tag', blank=True)

    def __str__(self):
        return self.placeName
    class Meta:
        ordering =  ['-id']



class Comment(models.Model):
    text = models.CharField(max_length=100)
    userComment = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='userComment',
        on_delete=models.CASCADE
    )
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return self.text


class Tag(models.Model):
    name = models.CharField(max_length=50)
    userTag = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.name