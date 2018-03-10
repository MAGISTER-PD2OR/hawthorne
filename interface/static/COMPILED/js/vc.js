// Generated by CoffeeScript 2.1.1
(function() {
  // view controller
  var ajax, change;

  change = function(destination = 'home') {
    var header, method, url;
    method = 'POST';
    switch (destination) {
      case 'home':
        url = '';
        break;
      case 'player':
        url = 'players';
        break;
      case 'admin':
        url = 'admins';
        break;
      case 'server':
        url = 'servers';
        break;
      case 'ban':
        url = 'bans';
        break;
      case 'mutegag':
        url = 'mutegags';
        break;
      case 'announcements':
        url = 'announcements';
        break;
      case 'chat':
        url = 'chat';
        break;
      case 'settings':
        url = 'settings';
        break;
      default:
        return false;
    }
    header = {
      'X-CSRFTOKEN': window.csrftoken
    };
    window.endpoint.bare[url].post(header, {}, function(dummy, response) {
      var data, status;
      status = response.status;
      data = response.data;
      if (status === 200) {
        $("#content").css('opacity', '0');
        setTimeout(function() {
          $("#content")[0].innerHTML = data;
          $("#content script.execution").forEach(function(scr) {
            return eval(scr.innerHTML);
          });
          feather.replace();
          return $("#content").css('opacity', '');
        }, 300);
      } else {
        return false;
      }
      window.history.pushState("", "", url);
      return true;
    });
    return true;
  };

  ajax = function(destination, module) {
    return true;
  };

  window.vc = {
    change: change
  };

}).call(this);
