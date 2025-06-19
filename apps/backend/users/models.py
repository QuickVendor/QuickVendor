from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    # Add any additional fields you want for your user model
    pass

    def __str__(self):
        return self.username