# Generated by Django 2.0.3 on 2018-05-19 19:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0059_auto_20180519_1944'),
    ]

    operations = [
        migrations.AddField(
            model_name='servergroup',
            name='tag',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core.Tag'),
        ),
    ]
