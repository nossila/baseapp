from django.db import models
from django.conf import settings
from model_utils import Choices
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from ipware import get_client_ip

REVISION_TYPES = Choices(
    ('create', _("Create")),
    ('update', _("Update")),
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

    def _start_revision(self, *args, **kwargs):
        request = kwargs.pop("request", None)
        message = kwargs.pop("message", None)
        parent = kwargs.pop("parent", None)

        parent_id = None
        if self.revision_id and not parent:
            parent_id = self.revision_id
        elif parent:
            parent_id = parent.pk

        author = None
        ip = None
        useragent = None
        if request:
            if request.user.is_authenticated:
                author = request.user
            ip, is_routable = get_client_ip(request)
            useragent = request.META.get('HTTP_USER_AGENT')
            if hasattr(request, 'revisionMessage') and not message:
                message = request.revisionMessage

        revision_type = None
        if not parent_id:
            revision_type = REVISION_TYPES.create
        elif self._is_deleted:
            revision_type = REVISION_TYPES.delete
        else:
            revision_type = REVISION_TYPES.update

        self.revision = Revision.objects.create(
            type=revision_type,
            content_type=ContentType.objects.get_for_model(self),
            parent_id=parent_id,
            author=author,
            author_ip=ip,
            author_useragent=useragent,
            message=message,
        )

    def save(self, *args, **kwargs):
        self._start_revision(*args, **kwargs)
        super().save(*args, **kwargs)
        self.save_revision()

        self.revision.object_id = self.pk
        self.revision.save(update_fields=["object_id"])

    def update(self, payload, request=None):
        for name, value in payload.items():
            setattr(self, name, value)
        self.save(request=request)

    def delete(self, *args, **kwargs):
        self._is_deleted = True
        self._start_revision(*args, **kwargs)
        self.save_revision()
        self.revision.object_id = self.pk
        self.revision.save(update_fields=["object_id"])
        super().delete()

