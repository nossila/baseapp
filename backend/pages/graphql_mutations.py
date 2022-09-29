import graphene
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
        print(input)
        print('whatt')
        try:
            page = PageModel(**input["page"])
            page.save(request=info.context)
        except Exception as e:
            print(e)
            raise e
        print(page)
        #  ship_name = input.ship_name
        #  faction_id = input.faction_id
        #  ship = create_ship(ship_name, faction_id)
        #  faction = get_faction(faction_id)
        return PageCreate(page=page)


class Mutation:
    page_create = PageCreate.Field()
