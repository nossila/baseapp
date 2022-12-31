# Generated by Django 4.1.1 on 2022-10-27 01:50

from django.db import migrations, models
import pgtrigger.compiler
import pgtrigger.migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0003_remove_page_snapshot_delete_page_snapshot_delete'),
    ]

    operations = [
        pgtrigger.migrations.RemoveTrigger(
            model_name='page',
            name='snapshot_insert',
        ),
        pgtrigger.migrations.RemoveTrigger(
            model_name='page',
            name='snapshot_update',
        ),
        pgtrigger.migrations.RemoveTrigger(
            model_name='page',
            name='snapshot_delete',
        ),
        migrations.AddField(
            model_name='page',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='pageevent',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name='page',
            trigger=pgtrigger.compiler.Trigger(name='soft_delete', sql=pgtrigger.compiler.UpsertTriggerSql(func='UPDATE "pages_page" SET is_active = False WHERE "id" = OLD."id"; RETURN NULL;', hash='e7b69874ed11aeb5d9469ded0153fba480396416', operation='DELETE', pgid='pgtrigger_soft_delete_a8eb7', table='pages_page', when='BEFORE')),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name='page',
            trigger=pgtrigger.compiler.Trigger(name='snapshot_insert', sql=pgtrigger.compiler.UpsertTriggerSql(func='INSERT INTO "pages_pageevent" ("body", "id", "is_active", "parent_id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "pgh_operation", "published_at", "title", "url") VALUES (NEW."body", NEW."id", NEW."is_active", NEW."parent_id", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", 1, NEW."published_at", NEW."title", NEW."url"); RETURN NULL;', hash='89562d2d2d9a344b2d449f3b9c7515b886240db4', operation='INSERT', pgid='pgtrigger_snapshot_insert_b7ea6', table='pages_page', when='AFTER')),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name='page',
            trigger=pgtrigger.compiler.Trigger(name='snapshot_update', sql=pgtrigger.compiler.UpsertTriggerSql(condition='WHEN (OLD.* IS DISTINCT FROM NEW.*)', func='INSERT INTO "pages_pageevent" ("body", "id", "is_active", "parent_id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "pgh_operation", "published_at", "title", "url") VALUES (NEW."body", NEW."id", NEW."is_active", NEW."parent_id", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", 2, NEW."published_at", NEW."title", NEW."url"); RETURN NULL;', hash='598e253229f5b3a9dd7fd780702cda371a22268f', operation='UPDATE', pgid='pgtrigger_snapshot_update_8876e', table='pages_page', when='AFTER')),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name='page',
            trigger=pgtrigger.compiler.Trigger(name='snapshot_delete', sql=pgtrigger.compiler.UpsertTriggerSql(func='INSERT INTO "pages_pageevent" ("body", "id", "is_active", "parent_id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "pgh_operation", "published_at", "title", "url") VALUES (OLD."body", OLD."id", OLD."is_active", OLD."parent_id", _pgh_attach_context(), NOW(), \'snapshot\', OLD."id", 3, OLD."published_at", OLD."title", OLD."url"); RETURN NULL;', hash='70f0fa893ae3a02cbf762b979e91350da3dba505', operation='DELETE', pgid='pgtrigger_snapshot_delete_64104', table='pages_page', when='AFTER')),
        ),
    ]