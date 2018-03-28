// Generated by CoffeeScript 2.1.1
(function() {
  var admin__admin, admin__group, admin__log, ban__user, chat__log, home__instance, mutegag__user, player__user, server__server;

  admin__admin = function(page = 1) {
    var header;
    header = {
      "X-CSRFToken": window.csrftoken
    };
    return window.endpoint.ajax.admin.user[page].post(header, {}, function(dummy, response) {
      var data, status;
      status = response.status;
      data = response.data;
      if (status === 200) {
        if (page === 1) {
          $("#admin__admin").html('');
        }
        $("#admin__admin").htmlAppend(data);
        feather.replace();
        return window.ajax.admin.admins(page + 1);
      } else {
        return false;
      }
    });
  };

  admin__log = function(page = 1) {
    var header;
    header = {
      "X-CSRFToken": window.csrftoken
    };
    return window.endpoint.ajax.admin.log[page].post(header, {}, function(dummy, response) {
      var data, status;
      status = response.status;
      data = response.data;
      if (status === 200) {
        $("#admin__log").htmlAppend(data);
        feather.replace();
        return window.ajax.admin.logs(page + 1);
      } else {
        return false;
      }
    });
  };

  admin__group = function(page = 1) {
    var header;
    header = {
      "X-CSRFToken": window.csrftoken
    };
    return window.endpoint.ajax.admin.group[page].post(header, {}, function(dummy, response) {
      var data, i, item, j, len, ref, status;
      status = response.status;
      data = response.data;
      if (status === 200) {
        if (page === 1) {
          i = 0;
          ref = $("#admin__group .row");
          for (j = 0, len = ref.length; j < len; j++) {
            item = ref[j];
            if (i !== 0) {
              $(item).remove();
            }
            i++;
          }
        }
        $("#admin__group").htmlAppend(data);
        feather.replace();
        return window.ajax.admin.groups(page + 1);
      } else {
        return false;
      }
    });
  };

  ban__user = function(page = 1) {
    var header;
    header = {
      "X-CSRFToken": window.csrftoken
    };
    return window.endpoint.ajax.ban.user[page].post(header, {}, function(dummy, response) {
      var data, status;
      status = response.status;
      data = response.data;
      if (status === 200) {
        if (page === 1) {
          $("#ban__user").html('');
        }
        $("#ban__user").htmlAppend(data);
        feather.replace();
        return window.ajax.ban.user(page + 1);
      } else {
        return false;
      }
    });
  };

  chat__log = function(page = 1) {
    var header;
    header = {
      "X-CSRFToken": window.csrftoken
    };
    return window.endpoint.ajax.chat.log[page].post(header, {}, function(dummy, response) {
      var data, status;
      status = response.status;
      data = response.data;
      if (status === 200) {
        $("#chat__log").htmlAppend(data);
        feather.replace();
        return window.ajax.chat.logs(page + 1);
      } else {
        return false;
      }
    });
  };

  mutegag__user = function(page = 1) {
    var header;
    header = {
      "X-CSRFToken": window.csrftoken
    };
    return window.endpoint.ajax.mutegag.user[page].post(header, {}, function(dummy, response) {
      var data, status;
      status = response.status;
      data = response.data;
      if (status === 200) {
        if (page === 1) {
          $("#mutegag__user").html('');
        }
        $("#mutegag__user").htmlAppend(data);
        feather.replace();
        return window.ajax.mutegag.user(page + 1);
      } else {
        return false;
      }
    });
  };

  player__user = function(page = 1) {
    var header;
    header = {
      "X-CSRFToken": window.csrftoken
    };
    return window.endpoint.ajax.player.user[page].post(header, {}, function(dummy, response) {
      var data, status;
      status = response.status;
      data = response.data;
      if (status === 200) {
        $("#player__user").htmlAppend(data);
        feather.replace();
        return window.ajax.mutegag.user(page + 1);
      } else {
        return false;
      }
    });
  };

  server__server = function(page = 1) {
    var header;
    header = {
      "X-CSRFToken": window.csrftoken
    };
    return window.endpoint.ajax.server.server[page].post(header, {}, function(dummy, response) {
      var data, i, item, j, len, ref, status;
      status = response.status;
      data = response.data;
      if (status === 200) {
        if (page === 1) {
          i = 0;
          ref = $("#server__server .row");
          for (j = 0, len = ref.length; j < len; j++) {
            item = ref[j];
            if (i !== 0) {
              $(item).remove();
            }
            i++;
          }
        }
        $("#server__server").htmlAfter(data);
        $("script.server.execution").forEach(function(src) {
          return eval(src.innerHTML);
        });
        feather.replace();
        return window.ajax.server.server(page + 1);
      } else {
        return false;
      }
    });
  };

  home__instance = function(page = 1) {
    var header;
    header = {
      "X-CSRFToken": window.csrftoken
    };
    return window.endpoint.ajax.home.server[page].post(header, {}, function(dummy, response) {
      var data, status;
      status = response.status;
      data = response.data;
      if (status === 200) {
        $("#home__instance").htmlAppend(data);
        feather.replace();
        return window.ajax.home.instance(page + 1);
      } else {
        return false;
      }
    });
  };

  window.ajax = {
    admin: {
      admins: admin__admin,
      logs: admin__log,
      groups: admin__group
    },
    ban: {
      user: ban__user
    },
    chat: {
      logs: chat__log
    },
    mutegag: {
      user: mutegag__user
    },
    player: {
      user: player__user
    },
    server: {
      server: server__server
    },
    home: {
      instance: home__instance
    }
  };

}).call(this);
