# Generated by Django 3.0.7 on 2022-08-09 15:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20220616_1331'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='userProfile',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL),
        ),
    ]
