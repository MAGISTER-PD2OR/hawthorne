# Generated by Django 2.0 on 2018-01-31 12:38

from django.db import migrations, models


class Migration(migrations.Migration):
  dependencies = [
    ('core', '0013_auto_20180131_1233'),
  ]

  operations = [
    migrations.AlterField(
      model_name='servergroup',
      name='immunity',
      field=models.PositiveSmallIntegerField(),
    ),
    migrations.AlterField(
      model_name='servergroup',
      name='usetime',
      field=models.DurationField(null=True),
    ),
  ]
