import graphene
from graphene import relay
from graphene_django import DjangoConnectionField, DjangoObjectType
from backend.graphene import CountedConnection
from django.contrib.auth import get_user_model


class User(DjangoObjectType):
    is_authenticated = graphene.Boolean()

    #  actions = DjangoConnectionField(get_revision_type)

    #  my_perms = graphene.List(graphene.String)

    class Meta:
        model = get_user_model()
        exclude_fields = ('is_superuser', 'password', 'is_staff')
        interfaces = (relay.Node, )
        connection_class = CountedConnection

    #  @classmethod
    #  def get_node(cls, info, id):
    #      return cls._meta.model.objects.get(document_id=id)

    def resolve_is_authenticated(self, info):
        return info.context.user.is_authenticated

    def resolve_email(self, info):
        if info.context.user.is_authenticated and\
            (self.document == info.context.user.document or
                info.context.user.is_superuser):
            return self.email
        return _("You don't have permission")

    #  def resolve_actions(self, info, **kwargs):
    #      Revision = get_revision_type()
    #      return Revision._meta.model.objects.filter(
    #          author_id=self.document.pk).order_by('-created_at')
