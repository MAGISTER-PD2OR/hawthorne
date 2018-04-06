// Generated by CoffeeScript 2.1.1
(function() {
  var remove;

  remove = function(mode = '', that) {
    var endpoint, node, options, payload, role, server, trans, user;
    trans = $(that);
    if (!trans.hasClass('confirmation')) {
      trans.addClass('explicit red confirmation');
      return;
    }
    payload = {};
    node = that.parentElement.parentElement.parentElement;
    switch (mode) {
      case 'admin__administrator':
        user = $('input.uuid', node)[0].value;
        role = $('input.role', node)[0].value;
        payload = {
          reset: true,
          role: role
        };
        endpoint = window.endpoint.api.users[user];
        break;
      case 'admin__groups':
        role = $('input.uuid', node)[0].value;
        endpoint = window.endpoint.api.roles[role];
        break;
      case 'ban':
        user = $('input.user', node)[0].value;
        server = $('input.server', node)[0].value;
        console.log($('input.user', node)[0]);
        console.log(user);
        payload = {
          server: server
        };
        endpoint = window.endpoint.api.users[user].ban;
        break;
      case 'mutegag':
        user = $('input.user', node)[0].value;
        server = $('input.server', node)[0].value;
        if (server !== '') {
          payload = {
            server: server
          };
        }
        endpoint = window.endpoint.api.users[user].mutegag;
        break;
      case 'server':
        node = that.parentElement.parentElement.parentElement.parentElement;
        server = $('input.uuid', node)[0].value;
        endpoint = window.endpoint.api.servers[server];
        break;
      default:
        console.warning('mode not implemented');
        return;
    }
    options = {
      target: that,
      skip_animation: true
    };
    endpoint.delete(options, {}, payload, function(err, data) {
      if (data.success) {
        return $(node).remove();
      }
    });
  };

  window.api.remove = remove;

}).call(this);
// Generated by CoffeeScript 2.1.1
(function() {
  var edit, save;

  save = function(mode = '', that) {
    var data, j, len, node, now, o, password, payload, payloads, replacement, role, selector, server, success, target, time, user, uuid;
    o = {
      target: that,
      skip_animation: false
    };
    node = that.parentElement.parentElement.parentElement;
    switch (mode) {
      case 'admin__administrator':
        role = $('input.role', node)[0].value;
        uuid = $('input.uuid', node)[0].value;
        selector = window.api.storage[uuid + '#' + role];
        replacement = selector.getValue(true);
        payloads = [
          payload = {
            promotion: false,
            role: role
          },
          payload = {
            promotion: true,
            role: replacement
          }
        ];
        success = 0;
        for (j = 0, len = payloads.length; j < len; j++) {
          payload = payloads[j];
          window.endpoint.api.users[uuid].post(payload, function(err, data) {
            if (!data.success) {
              return;
            }
            return success += 1;
          });
        }
        target = $(that);
        if (success === 2) {
          target.addClass('explicit red');
        } else {
          target.addClass('explicit green');
        }
        setTimeout(function() {
          return target.removeClass('explicit green red');
        }, 1200);
        break;
      case 'admin__groups':
        uuid = $("input.uuid", node)[0].value;
        data = {
          name: $(".name span", node).html(),
          server: window.api.storage[uuid].getValue(true),
          immunity: parseInt($(".immunity span", node).html().match(/([0-9]|[1-8][0-9]|9[0-9]|100)(?:%)?$/)[1]),
          usetime: -1,
          flags: ''
        };
        $(".immunity span", node).html(`${data.immunity}%`);
        if (data.server === 'all') {
          data.server = null;
        }
        $(".actions input:checked", node).forEach(function(i) {
          return data.flags += i.value;
        });
        time = $(".usetime span", node).html();
        if (time === !null || time !== '') {
          data.usetime = window.style.duration.parse(time);
        }
        window.endpoint.api.roles[uuid].post(o, {}, data, function(err, data) {});
        break;
      case 'mutegag':
      case 'ban':
        user = $('input.user')[0].value;
        server = $('input.server')[0].value;
        now = new Date();
        now = now.getTime() / 1000;
        time = $(".icon.time input", node)[0].value;
        if (time !== '') {
          time = new Date(time);
          time = time.getTime() / 1000;
        } else {
          time = 0;
        }
        payload = {
          length: parseInt(time - now),
          reason: $(".icon.reason span", node).html()
        };
        if (server !== '') {
          payload.server = server;
        }
        if (mode === 'mutegag') {
          payload.type = '';
          $('.icon.modes .red', node).forEach(function(e) {
            payload.type += e.getAttribute('data-type');
            return console.log(payload.type);
          });
          if (payload.type.match(/mute/) && payload.type.match(/gag/)) {
            payload.type = 'both';
          }
          if (payload.type === '') {
            payload.type = 'both';
          }
        }
        window.endpoint.api.users[user][mode].post(o, {}, payload, function(err, data) {});
        break;
      case 'server':
        node = node.parentElement;
        uuid = $('input.uuid', node)[0].value;
        selector = window.api.storage[uuid];
        payload = {
          game: selector.getValue(true),
          gamemode: $(".icon.gamemode span", node).html(),
          ip: $(".icon.network span", node).html().split(':')[0],
          port: parseInt($(".icon.network span", node).html().split(':')[1])
        };
        password = $(".icon.password input", node)[0].value;
        if (password !== '') {
          payload.password = password;
        }
        window.endpoint.api.servers[uuid].post(o, {}, payload, function(err, data) {});
    }
  };

  edit = function(mode = '', that) {
    var date, games, group, node, now, selected, selector, server, target, timestamp, trigger, uuid;
    if (that.getAttribute('class').match(/save/)) {
      // this is for the actual process of saving
      save(mode, that);
      return;
    }
    node = that.parentElement.parentElement.parentElement;
    trigger = that.getAttribute('onclick');
    // this is for converting the style to be editable.
    switch (mode) {
      case 'admin__administrator':
        group = node.querySelector('.icon.group');
        uuid = $('input.uuid', node)[0].value;
        selected = $('input.role', node)[0].value;
        target = group.querySelector('span');
        $(target).remove();
        $(group).htmlAppend(`<select id='group-${uuid + '---' + selected}'></select>`);
        selector = new Choices(`#group-${uuid + '---' + selected}`, {
          searchEnabled: false,
          choices: [],
          classNames: {
            containerOuter: 'choices edit'
          }
        });
        selector.passedElement.addEventListener('change', function(e) {
          var server;
          target = $('.server span', node);
          server = selector.getValue().customProperties.server;
          if (server === null) {
            return target.html('all');
          } else {
            return window.endpoint.api.servers[server].get(function(err, data) {
              if (!data.success) {
                return;
              }
              return target.html(data.result.name);
            });
          }
        }, false);
        window.api.storage[uuid + '#' + selected] = selector;
        window.api.groups('', selector, selected);
        break;
      case 'admin__groups':
        server = node.querySelector('.icon.server');
        uuid = $('input.uuid', node)[0].value;
        selected = $('input.server', node)[0].value;
        if (selected === '') {
          selected = 'all';
        }
        target = server.querySelector('span');
        $(target).remove();
        $(server).htmlAppend(`<select id='server-${uuid}'></select>`);
        selector = new Choices(`#server-${uuid}`, {
          searchEnabled: false,
          choices: [],
          classNames: {
            containerOuter: 'choices edit small'
          }
        });
        $('.icon.group .actions', node).removeClass('disabled').addClass('enabled');
        $(".icon.usetime", node).addClass('input-wrapper');
        $(".icon.usetime span i", node).remove();
        $(".icon.usetime span", node).on('focusout', function(event, ui) {
          var field, sd, seconds;
          field = $(this);
          sd = field.html();
          seconds = window.style.duration.parse(sd);
          if (sd !== '' && seconds === 0) {
            return field.css('border-bottom-color', '#FF404B');
          } else {
            field.css('border-bottom-color', '');
            return field.html(window.style.duration.string(seconds));
          }
        });
        $(".icon.immunity", node).addClass('input-wrapper');
        $(".icon.name", node).addClass('input-wrapper');
        $(".icon span", node).addClass('input');
        $(".icon span", node).forEach(function(el) {
          return el.setAttribute('contenteditable', 'true');
        });
        window.api.storage[uuid] = selector;
        window.api.servers('', selector, selected);
        break;
      case 'ban':
      case 'mutegag':
        $(".icon.reason", node).addClass('input-wrapper');
        $(".icon.reason span", node).addClass('input');
        $(".icon.reason span", node)[0].setAttribute('contenteditable', 'true');
        $(".icon.time", node).addClass('input-wrapper');
        timestamp = parseInt($(".icon.time span", node)[0].getAttribute('data-timestamp')) * 1000;
        date = new Date(timestamp);
        date = window.style.utils.date.convert.to.iso(date);
        now = window.style.utils.date.convert.to.iso(new Date());
        $(".icon.time", node).htmlAppend(`<input type='datetime-local' min='${now}' value='${date}'>`);
        $(".icon.time span", node).remove();
        $(".icon.modes div", node).addClass('action').forEach(function(el) {
          return el.setAttribute('onclick', 'window.style.mutegag.toggle(this)');
        });
        $(".icon.modes div svg", node).forEach(function(el) {
          el = $(el);
          if (el.hasClass('gray')) {
            el.removeClass('gray').addClass('red');
          }
          if (el.hasClass('white')) {
            return el.removeClass('white').addClass('gray');
          }
        });
        break;
      case 'server':
        node = node.parentElement;
        uuid = $('input.uuid', node)[0].value;
        games = $(".icon.game", node);
        $('span', games[0]).remove();
        games.htmlAppend(`<select id='server-${uuid}'></select>`);
        selector = new Choices(`#server-${uuid}`, {
          searchEnabled: false,
          choices: [],
          classNames: {
            containerOuter: 'choices edit big'
          }
        });
        window.api.games(selector, games[0].getAttribute('data-value'));
        $(".icon.gamemode", node).addClass('input-wrapper big');
        $(".icon.gamemode span", node).addClass('input');
        $(".icon.gamemode span", node)[0].setAttribute('contenteditable', 'true');
        $(".icon.network", node).addClass('input-wrapper big');
        $(".icon.network span", node).addClass('input');
        $(".icon.network span", node)[0].setAttribute('contenteditable', 'true');
        $(".icon.password", node).addClass('input-wrapper big');
        $(".icon.password", node).htmlAppend('<input type="password", placeholder="Password"></input>');
        $(".icon.password span", node).remove();
        window.api.storage[uuid] = selector;
    }
    $(that).css('opacity', '0');
    setTimeout(function() {
      var transition;
      $(that).htmlAfter("<i class='save opacity animated' data-feather='save'></i>");
      feather.replace();
      transition = that.parentElement.querySelector('.save.opacity.animated');
      $(that).remove();
      // we need this timeout so that the transition can be applied properly
      // i know this is not the perfect way, but it is still better than twilight
      return setTimeout(function() {
        transition.setAttribute('onclick', trigger);
        return $(transition).css('opacity', '1');
      }, 300);
    }, 300);
  };

  window.api.edit = edit;

}).call(this);
// Generated by CoffeeScript 2.1.1
(function() {
  var submit;

  submit = function(mode = '', that) {
    var data, node, now, o, output, payload, perms, server, time, type, user, uuid, value;
    o = {
      target: that,
      skip_animation: false
    };
    switch (mode) {
      case 'admin__administrator':
        data = {
          role: window.groupinput.getValue(true),
          promotion: true,
          force: true
        };
        user = window.usernameinput.getValue(true);
        return window.endpoint.api.users[user].post(data, function(err, data) {
          window.ajax.admin.admins(1);
          return data;
        });
      case 'admin__groups':
        data = {
          name: $("#inputgroupname")[0].value,
          server: window.serverinput.getValue(true),
          immunity: parseInt($("#inputimmunityvalue")[0].value),
          usetime: null,
          flags: ''
        };
        if (data.server === 'all') {
          data.server = null;
        }
        $(".row.add .actions input:checked").forEach(function(i) {
          return data.flags += i.value;
        });
        time = $("#inputtimevalue")[0].value;
        if (time === !null || time !== '') {
          data.usetime = window.style.duration.parse(time);
        }
        return window.endpoint.api.roles.put(o, {}, data, function(err, data) {
          window.ajax.admin.groups(1);
          return data;
        });
      case 'ban':
        now = new Date();
        now = now.getTime() / 1000;
        time = $("#inputduration")[0].value;
        if (time !== '') {
          time = new Date($("#inputduration")[0].value);
          time = time.getTime() / 1000;
        } else {
          time = 0;
        }
        user = window.usernameinput.getValue(true);
        data = {
          reason: $("#inputdescription")[0].value,
          length: parseInt(time - now)
        };
        server = window.serverinput.getValue(true);
        if (server !== 'all') {
          data.server = server;
        }
        return window.endpoint.api.users[user].ban.put(o, {}, data, function(err, data) {
          return window.ajax.ban.user(1);
        });
      case 'mutegag':
        now = new Date();
        now = now.getTime() / 1000;
        time = $("#inputduration")[0].value;
        if (time !== '') {
          time = new Date(time);
          time = time.getTime() / 1000;
        } else {
          time = 0;
        }
        user = window.usernameinput.getValue(true);
        type = '';
        $('.row.add .action .selected').forEach(function(e) {
          return type += e.id;
        });
        if (type.match(/mute/) && type.match(/gag/)) {
          type = 'both';
        }
        if (type === '') {
          type = 'both';
        }
        data = {
          reason: $("#inputdescription")[0].value,
          length: parseInt(time - now),
          type: type
        };
        server = window.serverinput.getValue(true);
        if (server !== 'all') {
          data.server = server;
        }
        return window.endpoint.api.users[user].mutegag.put(o, {}, data, function(err, data) {
          window.ajax.mutegag.user(1);
          return data;
        });
      case 'kick':
        user = $('input.uuid', node)[0].value;
        data = {
          server: $('input.server', node)[0].value
        };
        return window.endpoint.api.users[user].kick.put(o, {}, data, function(err, data) {
          window.ajax.player.user(1);
          return data;
        });
      case 'server':
        node = that.parentElement.parentElement.parentElement;
        data = {
          name: $("#inputservername")[0].value,
          ip: $('#inputip')[0].value.split(':')[0],
          port: parseInt($('#inputip')[0].value.split(':')[1]),
          password: $('#inputpassword')[0].value,
          game: window.gameinput.getValue(true),
          mode: $('#inputmode')[0].value
        };
        return window.endpoint.api.servers.put(o, {}, data, function(err, data) {
          window.ajax.server.server(1);
          return data;
        });
      case 'server__execute':
        node = that.parentElement.parentElement.parentElement.parentElement;
        uuid = $('input.uuid', node)[0].value;
        value = $('pre.input', node)[0].textContent;
        payload = {
          command: value
        };
        $(that).addClass('orange');
        output = $('pre.ro', node);
        output.css('max-height', '');
        window.endpoint.api.servers[uuid].execute.put(payload, function(err, data) {
          if (data.success) {
            $(that).addClass('green');
            output.html(data.result.response);
            console.log(output[0].innerHTML);
            output[0].innerHTML = "<span class='line'>" + (output[0].textContent.split("\n").filter(Boolean).join("</span>\n<span class='line'>")) + "</span>";
            output.removeClass('none');
            $('pre.input', node).addClass('evaluated');
            output.css('max-height', output[0].scrollHeight + 'px');
          } else {
            $(that).addClass('red');
          }
          $(that).removeClass('orange');
          return data;
        });
        return setTimeout(function() {
          $(that).removeClass('red');
          $(that).removeClass('green');
          return $(that).addClass('white');
        }, 2500);
      case 'setting__user':
        node = that.parentElement.parentElement.parentElement;
        perms = [];
        $('.permission__child:checked', node).forEach(function(i) {
          var cl;
          cl = i.id;
          cl = cl.replace(/\s/g, '');
          cl = cl.split('__');
          cl = `${cl[0]}.${cl[1]}`;
          return perms.push(cl);
        });
        if ($(".scope__toggle", node).hasClass('activated')) {
          return console.log('Hi');
        }
        break;
      case 'setting__group':
        return console.log('placeholder');
      case 'setting__token':
        return console.log('placeholder');
      default:
        return console.warning('You little bastard! This is not implemented....');
    }
  };

  window.api.submit = submit;

}).call(this);
// Generated by CoffeeScript 2.1.1
(function() {
  //= require api.delete.coffee
  //= require api.edit.coffee
  //= require api.create.coffee
  var game, group, server;

  game = function(that = null, selected = '') {
    window.endpoint.api.capabilities.games.get(function(err, data) {
      var ele, fmt, formatted, i, len;
      data = data.result;
      if (that !== null) {
        formatted = [];
        for (i = 0, len = data.length; i < len; i++) {
          ele = data[i];
          fmt = {
            value: ele.value,
            label: ele.label
          };
          if (selected !== '' && fmt.value === selected) {
            fmt.selected = true;
          }
          formatted.push(fmt);
        }
        that.setChoices(formatted, 'value', 'label', true);
      }
      return data;
    });
  };

  server = function(query, that = null, selected = '') {
    window.endpoint.api.servers({
      'query': query
    }).get(function(err, data) {
      var ele, fmt, formatted, i, len;
      data = data.result;
      if (that !== null) {
        formatted = [
          {
            'value': 'all',
            'label': '<b>all</b>'
          }
        ];
        if (selected === 'all') {
          formatted[0].selected = true;
        }
        for (i = 0, len = data.length; i < len; i++) {
          ele = data[i];
          fmt = {
            value: ele.id,
            label: ele.name
          };
          if (selected !== '' && fmt.value === selected) {
            fmt.selected = true;
          }
          formatted.push(fmt);
        }
        that.setChoices(formatted, 'value', 'label', true);
      }
      return data;
    });
  };

  group = function(query, that = null, selected = '') {
    window.endpoint.api.roles({
      'query': query
    }).get(function(err, data) {
      var ele, fmt, formatted, i, len;
      data = data['result'];
      if (that !== null) {
        formatted = [];
        for (i = 0, len = data.length; i < len; i++) {
          ele = data[i];
          fmt = {
            value: ele.id,
            label: ele.name,
            customProperties: {
              server: ele.server
            }
          };
          if (selected !== '' && fmt.value === selected) {
            fmt.selected = true;
          }
          formatted.push(fmt);
        }
        that.setChoices(formatted, 'value', 'label', true);
      }
      return data;
    });
  };

  window.api.servers = server;

  window.api.groups = group;

  window.api.games = game;

}).call(this);
