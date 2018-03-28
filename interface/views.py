from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from core.models import Server, ServerGroup, User
from log.models import UserOnlineTime, ServerChat
from automated_logging.models import Model as LogModel
from django.db.models.functions import Cast
import datetime
from django.db.models import DateField, Count, Q
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType


def login(request):
  return render(request, 'skeleton/login.pug', {})


@login_required(login_url='/login')
def home(request):
  query = UserOnlineTime.objects.annotate(date=Cast('disconnected', DateField()))\
                                .values('user')\
                                .annotate(active=Count('user', distinct=True))

  last30 = query.filter(date__gte=datetime.date.today() - datetime.timedelta(days=30))
  prev30 = query.filter(date__gte=datetime.date.today() - datetime.timedelta(days=60))\
                .filter(date__lte=datetime.date.today() - datetime.timedelta(days=30))

  recent = last30.count()
  alltime = query.count()

  try:
    change = int((recent / prev30.count()) - 1) * 100
  except ZeroDivisionError:
    change = 100

  payload = {'instances': Server.objects.all().count(),
             'counts': {'all': alltime,
                        'month': recent,
                        'change': change},
             'roles': ServerGroup.objects.all().count(),
             'mem_roles': User.objects.filter(Q(roles__isnull=False) | Q(is_superuser=True)).count(),
             'messages': ServerChat.objects.filter(command=False)
                                           .annotate(date=Cast('created_at', DateField()))
                                           .filter(date__gte=datetime.date.today() - datetime.timedelta(days=30))
                                           .count(),
             'actions': LogModel.objects.filter(user__isnull=False)
                                      .annotate(date=Cast('created_at', DateField()))
                                      .filter(date__gte=datetime.date.today() - datetime.timedelta(days=30))
                                      .count()
             }
  return render(request, 'components/home.pug', payload)


@login_required(login_url='/login')
def player(request):
  return render(request, 'components/player.pug', {})


@login_required(login_url='/login')
def admin(request):
  return render(request, 'components/admin.pug', {})


@login_required(login_url='/login')
def server(request):
  return render(request, 'components/server.pug', {'supported': [{'label': x[1], 'value': x[0]} for x in Server.SUPPORTED]})


@login_required(login_url='/login')
def ban(request):
  return render(request, 'components/ban.pug', {})


@login_required(login_url='/login')
def mutegag(request):
  return render(request, 'components/mutegag.pug')


@login_required(login_url='/login')
def announcement(request):
  return render(request, 'components/home.pug', {})


@login_required(login_url='/login')
def chat(request):
  return render(request, 'components/chat.pug', {})


@login_required(login_url='/login')
def settings(request):
  modules = [c for c in ContentType.objects.filter(app_label__in=['core', 'log']) if Permission.objects.filter(content_type=c).count() > 0]
  perms = Permission.objects.all().order_by('content_type__model')

  return render(request, 'components/settings.pug', {'simple': modules, 'advanced': perms})


def dummy(request):
  return render(request, 'skeleton/main.pug', {})
