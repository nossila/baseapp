from graphene import ObjectType, Schema, Field, ID, relay
from graphene.relay.node import NodeField as RelayNodeField
from graphene_django.debug import DjangoDebug
from pages.graphql_schema import Query as PagesQuery
from pages.graphql_mutations import Mutation as PagesMutation


def get_default_viewer(*args, **kwargs):
    return Query(id='viewer')


class NodeField(RelayNodeField):
    def get_resolver(self, parent_resolver):
        resolver = super().get_resolver(parent_resolver)

        def get_node(instance, info, **kwargs):
            global_id = kwargs.get('id')
            if global_id == 'viewer':
                return get_default_viewer(instance, info, **kwargs)
            return resolver(instance, info, **kwargs)

        return get_node


class Query(PagesQuery, ObjectType):
    id = ID(required=True)
    viewer = Field(lambda: Query)

    node = NodeField(relay.Node)

    debug = Field(DjangoDebug, name='_debug')

    class Meta:
        interfaces = (relay.Node,)

    def resolve_viewer(self, *args, **kwargs):
        return get_default_viewer(*args, **kwargs)


class Mutation(PagesMutation, ObjectType):
    pass

schema = Schema(query=Query, mutation=Mutation)

