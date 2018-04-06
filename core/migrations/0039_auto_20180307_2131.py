# Generated by Django 2.0.2 on 2018-03-07 21:31

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
  dependencies = [
    ('core', '0038_auto_20180306_2254'),
  ]

  operations = [
    migrations.AlterField(
      model_name='ban',
      name='updated_by',
      field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                              related_name='ban_updated_by', to=settings.AUTH_USER_MODEL),
    ),
  ]
