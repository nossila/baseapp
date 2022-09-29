from graphene import relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

#  from db.types_revision import DocumentNode, DocumentBase
#  from db.graphene import CountedConnection

from .models import Page as PageModel
from backend.graphene import CountedConnection
#  from commenting.models_graphql import CommentsNode
#  from images.models_graphql import ImagesNode


class Page(DjangoObjectType):
    class Meta:
        model = PageModel
        interfaces = (relay.Node,)
        filter_fields = []
        connection_class = CountedConnection

        #  @classmethod
        #  def get_node(cls, info, id):
        #      return cls._meta.model.objects.get(document_id=id)


class Query:
    page = relay.Node.Field(Page)
    all_pages = DjangoFilterConnectionField(Page)
