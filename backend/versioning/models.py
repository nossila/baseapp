from django.db import models
from django.conf import settings
from model_utils import Choices
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

REVISION_TYPES = Choices(
    ('create', _("Create")),
    ('change', _("Change")),
    ('delete', _("Delete")),
)


class Revision(models.Model):
    type = models.CharField(max_length=6, choices=REVISION_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey('self', null=True, on_delete=models.PROTECT)

    content_type = models.ForeignKey(ContentType, on_delete=models.PROTECT)
    object_id = models.PositiveIntegerField(null=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    author = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='revisions',
                               null=True, on_delete=models.PROTECT)
    author_ip = models.GenericIPAddressField(null=True)
    author_useragent = models.CharField(max_length=512, null=True)
    message = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)



class RevisionedModel(models.Model):
    revision = models.OneToOneField(Revision, on_delete=models.PROTECT)
    
    # objects_revisions returnar o queryset das versoes? 

    class Meta:
        abstract = True

