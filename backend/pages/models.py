from django.db import models
from versioning.models import Revision, RevisionedModel, REVISION_TYPES
from django.contrib.contenttypes.models import ContentType


class Page(RevisionedModel):
    title = models.CharField(max_length=255)
    url = models.URLField(max_length=255, unique=True)
    body = models.TextField()

    published_at = models.DateTimeField(null=True)

    def save_revision(self):
        PageRevision.objects.create(
            revision=self.revision,
            content_object=self,
            title=self.title,
            url=self.url,
            body=self.body,
            published_at=self.published_at,
        )

    @classmethod
    def get_revision_model(cls):
        return PageRevision


# we can make this model magically, or by using VersionedModel or with a function that enables versioning for a model
class PageRevision(models.Model):
    revision = models.ForeignKey(Revision, on_delete=models.PROTECT)
    content_object = models.ForeignKey(Page, related_name='revisions', on_delete=models.PROTECT)

    # copy of all documents models (or the ones we want to track)
    title = models.CharField(max_length=255)
    url = models.URLField(max_length=255)
    body = models.TextField()

    published_at = models.DateTimeField(null=True)

