# Generated by Django 2.0.3 on 2018-03-20 21:28

from django.db import migrations


class Migration(migrations.Migration):
  dependencies = [
    ('log', '0007_auto_20180319_2150'),
  ]

  operations = [
    migrations.AlterModelOptions(
      name='serveraction',
      options={'permissions': [('view_log', 'Can view server log')]},
    ),
    migrations.AlterModelOptions(
      name='serverchat',
      options={'permissions': [('view_chat', 'Can view chat log'), ('view_chat_ip', 'Can view ip in chat log'),
                               ('view_chat_server', 'Can view server in chat log'),
                               ('view_chat_time', 'Can view time in chat log')]},
    ),
  ]
