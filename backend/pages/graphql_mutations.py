import graphene
from graphql_relay.node.node import from_global_id

from .graphql_schema import Page
from .models import Page as PageModel

class PageInput(graphene.InputObjectType):
    title = graphene.String(required=True)
    url = graphene.String(required=True)
    body = graphene.String(required=True)

class PageCreate(graphene.relay.ClientIDMutation):
    class Input:
        page = PageInput(required=True)

    page = graphene.Field(Page)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        try:
            page = PageModel(**input["page"])
            page.save(request=info.context)
        except Exception as e:
            print(e)
            raise e
        return PageCreate(page=page)


class PageUpdate(graphene.relay.ClientIDMutation):
    class Input:
        id = graphene.ID(required=True)
        page = PageInput(required=True)

    page = graphene.Field(Page)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        gid_type, gid = from_global_id(input.get('id'))
        page = PageModel.objects.get(pk=gid)

        #  error = has_permission(cls, info.context, page, 'edit')
        #  if error:
        #      return error

        try:
            page.update(payload=input.get('page'), request=info.context)
        except Exception as e:
            print(e)
            raise e
        return PageUpdate(page=page)


class PageDelete(graphene.relay.ClientIDMutation):
    class Input:
        id = graphene.ID(required=True)

    deletedID = graphene.ID(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        gid_type, gid = from_global_id(input.get('id'))
        page = PageModel.objects.get(pk=gid)

        #  error = has_permission(cls, info.context, page, 'delete')
        #  if error:
        #      return error

        try:
            page.delete(request=info.context)
        except Exception as e:
            print(e)
            raise e

        return PageDelete(deletedID=input.get('id'))


class Mutation:
    page_create = PageCreate.Field()
    page_update = PageUpdate.Field()
    page_delete = PageDelete.Field()

