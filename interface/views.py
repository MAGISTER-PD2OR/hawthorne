import datetime
import json
import lib.int
import random

from automated_logging.models import Model as LogModel
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group, Permission
from django.db import connection
from django.db.models import DateTimeField, ExpressionWrapper, F
from django.http import Http404, JsonResponse
from django.shortcuts import render
from django.utils import timezone

from core.models import Punishment, Role, Server, User


def login(request):
  if request.method == "GET":
    return render(request, 'skeleton/login.pug', {})
  else:
    payload = json.loads(request.body)
    if authenticate(request, payload["username"], payload["password"]):
      return JsonResponse({"success": True})

    return JsonResponse({"success": False, "reason": "credentials incorrect or unkown"})


@login_required
def home(request):
  # there seems to be no way to derive a django query from another one
  with connection.cursor() as cursor:
    cursor.execute('''
      SELECT COUNT(*), `subquery`.`mo`, `subquery`.`da`, `subquery`.`ye`
      FROM (SELECT `log_userconnection`.`user_id` AS `Col1`,
                   EXTRACT(YEAR FROM CONVERT_TZ(`log_userconnection`.`disconnected`, 'UTC', 'UTC'))  AS `ye`,
                   EXTRACT(MONTH FROM CONVERT_TZ(`log_userconnection`.`disconnected`, 'UTC', 'UTC')) AS `mo`,
                   EXTRACT(DAY FROM CONVERT_TZ(`log_userconnection`.`disconnected`, 'UTC', 'UTC'))   AS `da`,
                   COUNT(DISTINCT `log_userconnection`.`user_id`) AS `active`
            FROM `log_userconnection`
            GROUP BY `log_userconnection`.`user_id`, `mo`, `da`, `ye`
            ORDER BY NULL) `subquery`
      WHERE `da` IS NOT NULL
      GROUP BY `subquery`.`mo`, `subquery`.`da`, `subquery`.`ye`
      ORDER BY `ye` DESC, `mo` DESC, `da` DESC
      LIMIT 365;
    ''')

    query = cursor.fetchall()

  population = {}
  for i in query:
    key = datetime.datetime(year=i[3], month=i[1], day=i[2])
    key = str(int(key.timestamp()))
    population[key] = i[0]

  payload = {'population': population,
             'punishments': Punishment.objects.count(),
             'users': lib.int.shorten(User.objects.count()),
             'servers': lib.int.shorten(Server.objects.count()),
             'actions': lib.int.shorten(LogModel.objects.count())}
  return render(request, 'pages/home.pug', payload)


@login_required
def player(request):
  return render(request, 'pages/players/list.pug', {})


@login_required
def player_detailed(request, u):
  try:
    user = User.objects.get(id=u)
  except User.DoesNotExist:
    raise Http404('This user is nowhere to be found!')

  return render(request, 'pages/players/detailed.pug', {'data': user})


@login_required
def server(request):
  return render(request, 'pages/servers/list.pug')


@login_required
def server_detailed(request, s):
  server = Server.objects.filter(id=s)

  if not server:
    return render(request, 'skeleton/404.pug')

  server = server[0]

  return render(request, 'pages/servers/detailed.pug', {'data': server})


@login_required
def admins_servers(request):
  roles = Role.objects.all()
  return render(request, 'pages/admins/servers.pug', {'roles': roles})


@login_required
def admins_web(request):
  permissions = Permission.objects.order_by('content_type__model')
  excluded = ['core', 'log', 'auth']
  groups = Group.objects.all()
  return render(request, 'pages/admins/web.pug', {'permissions': permissions,
                                                  'excluded': excluded,
                                                  'groups': groups})


@login_required
def punishments(request):
  name = request.resolver_match.url_name

  if "ban" in name:
    mode = "ban"
  elif "mute" in name:
    mode = "mute"
  elif "gag" in name:
    mode = "gag"

  Punishment.objects.annotate(completion=ExpressionWrapper(F('created_at') + F('length'),
                                                           output_field=DateTimeField()))\
                    .filter(completion__lte=timezone.now(),
                            resolved=False,
                            length__isnull=False).update(resolved=True)
  servers = Server.objects.all()

  return render(request, 'pages/punishments/general.pug', {'mode': mode,
                                                           'servers': servers})


@login_required
def settings(request):
  permissions = Permission.objects.order_by('content_type__model')
  excluded = ['core', 'log', 'auth']

  return render(request, 'pages/settings.pug', {'permissions': permissions,
                                                'excluded': excluded})


def page_not_found(request, exception=None, template_name='404.pug'):
  creatures = ['retarded', 'hot', 'crazed', 'embarrassed', 'worried', 'annoyed']
  return render(request, 'skeleton/errors/404.pug',
                {'creature': random.choice(creatures)}, status=404)


def internal_server_error(request, template_name='500.pug '):
  creatures = ['retarded', 'hot', 'crazed', 'embarrassed', 'worried', 'annoyed']
  return render(request, 'skeleton/errors/500.pug',
                {'creature': random.choice(creatures)}, status=500)
