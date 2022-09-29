from graphene import ObjectType, Schema
from pages.graphql_schema import Query as PagesQuery
from pages.graphql_mutations import Mutation as PagesMutation


class Query(PagesQuery, ObjectType):
    pass

class Mutation(PagesMutation, ObjectType):
    pass

schema = Schema(query=Query, mutation=Mutation)

