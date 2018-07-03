// Generated by CoffeeScript 2.1.1
(function() {
  var init;

  $(function() {
    return init();
  });

  init = function() {
    $('[data-trigger=\'[dropdown/toggle]\']').on('click', function() {
      $('.expand').not($('.expand', this.parentElement)).slideUp();
      $('.menu > ul > li > a').not($(this)).removeClass('navActive');
      $(this).toggleClass('navActive');
      $('.expand', this.parentElement).slideToggle();
    });
    $('[data-trigger=\'[modal/open]\']').on('click', function() {
      $('.overlay').fadeIn('fast');
      $('[data-component=\'' + this.getAttribute('data-trigger-target') + '\']').fadeIn('fast');
    });
    $('[data-trigger=\'[server/item]\']').on('click', function() {
      $(this).toggleClass('toggableListActive');
      $(this).find('.content').fadeToggle('fast');
    });
    $('[data-trigger=\'[modal/close]\']').on('click', function() {
      $('.overlay').fadeOut('fast');
      $(this.parentElement).fadeOut('fast');
    });
    $('.overlay').on('click', function() {
      $('.overlay').fadeOut('fast');
      $('.modal').fadeOut('fast');
    });
    $('[data-trigger=\'[system/messages/open]\']').on('click', function() {
      $('.notificationsArea', this).fadeToggle('fast');
      $($('a', this)[0]).toggleClass('userMenuActive');
    });
    $('.searchOverlay').on('click', function() {
      $('.searchOverlay').fadeOut('fast');
      $('.searchArea').fadeOut('fast');
      $('.search').animate({
        width: '20%'
      }, 250);
    });
    $('[data-trigger=\'[announcement/expand]\']').on('click', function() {
      $(this).find('.announcement-expand').slideToggle();
    });
    $('[data-trigger=\'[user/toggle]\']').on('click', function() {
      $(this).find('.dropdown').fadeToggle('fast');
    });
    $('.search input').on('click', function() {
      $('.modal').fadeOut('fast');
      $('.searchOverlay').fadeIn('fast');
      $('.searchArea').fadeToggle('fast');
      $('.search').animate({
        width: '30%'
      }, 250);
    });
    $('.timeTable tbody tr td .checkmarkContainer').on('mousedown', function() {
      $(this).closest('tr').toggleClass('logSelected');
      $('.checkboxDialogue').not($(this).parent().find('.checkboxDialogue')).fadeOut('fast');
      if (!$(this).find('input').prop('checked')) {
        $(this).parent().find('.checkboxDialogue').fadeIn('fast');
      } else {
        $(this).parent().find('.checkboxDialogue').fadeOut('fast');
      }
    });
    $('[data-trigger=\'[modal/system/log/import/input/add]\']').on('click', function() {
      $(this).parent().find('.appendInput').append('<input type=\'text\' placeholder=\'/home/server/addons/sourcemod/logs/error.log\' class=\'mbotSmall\'>');
    });
    $('[data-trigger=\'[composer/select/open]\']').on('click', function() {
      $(this).parent('._Dynamic_Select').toggleClass('_Dynamic_Select_Activated');
      $(this).parent('._Dynamic_Select').find('._Select').toggle();
      $(this).parent('._Dynamic_Select').find('._Select').find('._Select_Search').find('input').focus();
    });
    $('[data-trigger=\'[composer/select/choose]\']').on('click', function() {
      $(this).closest('._Dynamic_Select').find('._Title').text($(this).find('b').text());
      $(this).closest('._Dynamic_Select').toggleClass('_Dynamic_Select_Activated');
      $(this).closest('._Select').hide();
    });
    new ClipboardJS('[data-trigger="[clip/copy]"]');
  };

  window._ = {
    init: init
  };

}).call(this);
