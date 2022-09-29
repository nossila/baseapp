from django.db import models
from versioning.models import Revision, RevisionedModel, REVISION_TYPES
from ipware import get_client_ip
from django.contrib.contenttypes.models import ContentType

class Page(RevisionedModel):
    title = models.CharField(max_length=255)
    url = models.URLField(max_length=255, unique=True)
    body = models.TextField()

    published_at = models.DateTimeField(null=True)

    def save(self, *args, **kwargs):
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
        elif self.is_deleted:
            revision_type = REVISION_TYPES.delete
        else:
            revision_type = REVISION_TYPES.change

        revision = Revision.objects.create(
            type=revision_type,
            content_type=ContentType.objects.get_for_model(self),
            parent_id=parent_id,
            author=author,
            author_ip=ip,
            author_useragent=useragent,
            message=message,
        )

        self.revision = revision

        super().save(*args, **kwargs)

        revision.object_id = self.pk
        revision.save(update_fields=["object_id"])


# we can make this model magically, or by using VersionedModel or with a function that enables versioning for a model
class PageRevision(models.Model):
    revision = models.ForeignKey(Revision, on_delete=models.PROTECT)
    content_object = models.ForeignKey(Page, related_name='revisions', on_delete=models.PROTECT)

    # copy of all documents models (or the ones we want to track)
    title = models.CharField(max_length=255)
    url = models.URLField(max_length=255)
    body = models.TextField()

    published_at = models.DateTimeField(null=True)

