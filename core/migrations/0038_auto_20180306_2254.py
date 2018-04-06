# Generated by Django 2.0.2 on 2018-03-06 22:54

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
  dependencies = [
    ('core', '0037_rename_issuer'),
  ]

  operations = [
    migrations.AddField(
      model_name='ban',
      name='updated_by',
      field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE,
                              related_name='ban_updated_by', to=settings.AUTH_USER_MODEL),
      preserve_default=False,
    ),
    migrations.AddField(
      model_name='mutegag',
      name='updated_by',
      field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                              related_name='mutegag_updated_by', to=settings.AUTH_USER_MODEL),
    ),
    # migrations.AlterField(
    #     model_name='ban',
    #     name='created_by',
    #     field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ban_created_by', to=settings.AUTH_USER_MODEL),
    # ),
    # migrations.AlterField(
    #     model_name='mutegag',
    #     name='created_by',
    #     field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mutegag_created_by', to=settings.AUTH_USER_MODEL),
    # ),
  ]
