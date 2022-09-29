import graphene
from graphene_django import DjangoConnectionField, DjangoObjectType

#  from .models_graphql import Revision
#  from .types import DocumentBase
from .models import Revision as RevisionModel, REVISION_TYPES
from django.contrib.contenttypes.models import ContentType

class RevisionType(graphene.Enum):
    CREATE = REVISION_TYPES.create
    UPDATE = REVISION_TYPES.change
    DELETE = REVISION_TYPES.delete

    @property
    def description(self):
        return dict(REVISION_TYPES)[self._value_]


def get_versioned_type():
    from pages.graphql_schema import Page
    class VersionedType(graphene.Union):
        class Meta:
            pass
            # pegar types atraves de um register?
            types = (Page,)
    return VersionedType


class Revision(DjangoObjectType):
    #  id_int = graphene.Int()
    #  author = graphene.Field(User)
    after = DjangoConnectionField(lambda: Revision)
    before = graphene.Field(lambda: Revision)
    #  document = graphene.Field(get_document_type)
    content_object = graphene.Field(get_versioned_type)
    type = graphene.Field(RevisionType)
    type_display = graphene.String()
    is_tip = graphene.Boolean()

    class Meta:
        model = RevisionModel
        interfaces = (graphene.relay.Node, )

    def resolve_id_int(self, info):
        return self.id

    def resolve_author(self, info):
        if self.author_id:
            return User._meta.model.objects.get(document_id=self.author_id)

    def resolve_after(self, info, **kwargs):
        return Revision._meta.model.objects.filter(
            parent_id=self.id
        ).order_by('-created_at')

    def resolve_before(self, info):
        return self.parent

    def resolve_content_object(self, info):
        return None
        #  Model = self.document.content_type.model_class()
        #  return Model.objects_revisions.get(pk=self.pk)

    def resolve_typeDisplay(self, info):
        return self.get_type_display()

    def resolve_is_tip(self, info):
        return self.id == self.document.revision_tip_id



class RevisionedType(graphene.Interface):
    #  document = graphene.Field(Document)
    #  revision_current = graphene.Field(Revision)
    #  revision_created = graphene.Field(Revision)
    revision = graphene.Field(Revision)
    revisions = DjangoConnectionField(Revision)

    #  def resolve_document(self, info):
    #      if self.document_id:
    #          return Document._meta.model.objects.get(pk=self.document_id)

    #  def resolve_revision_current(self, info):
    #      if self.document.revision_tip_id:
    #          return Revision._meta.model.objects.get(
    #              pk=self.document.revision_tip_id)

    #  def resolve_revision_created(self, info):
    #      if self.document.revision_created_id:
    #          return Revision._meta.model.objects.get(
    #              pk=self.document.revision_created_id)

    def resolve_revisions(self, info, **kwargs):
        breakpoint()
        return Revision._meta.model.objects.filter(
            content_type=ContentType.objects.get_for_model(self),
            object_id=self.pk,
        ).order_by('-created_at')
