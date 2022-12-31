from django.db import models
from django.contrib.contenttypes.models import ContentType
import pghistory


@pghistory.track(pghistory.Snapshot())
class Page(models.Model):
    parent = models.ForeignKey('self', null=True, on_delete=models.CASCADE, blank=True)

    title = models.CharField(max_length=255)
    url = models.CharField(max_length=255, unique=True)
    body = models.TextField()

    published_at = models.DateTimeField(null=True)

    is_active = models.BooleanField(default=True)
