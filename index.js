(function ( $ ) {
  "use strict";
  var FOCUS_INPUT = '<input class="hack-fix-focus" type=text style="position:absolute; left:-10000px;">';

  $.fn.eternal = function(action) {
    var $tables = this.filter('table');

    if(action === 'destroy') {
      $($tables.data('eternal-focus-hack')).destroy();
      $tables.removeData('eternal-focus-hack');
      $tables.removeData('eternal-template');
    }

    if(action === 'serialize') {
      if(!$.fn.serializeObject) {
        var url = 'https://github.com/macek/jquery-serialize-object';
        throw new Error("Missing jQuery.serializeObject (" + url + ")");
      }
      return this;
    }

    if($tables.data('eternal')) {
      return this;
    }

    $tables.data('eternal', true);

    $tables.each(function() {
      var $table = $(this);
      var $trs = $table.find('tbody tr');
      var $final = $trs.last();

      var $focus = $(FOCUS_INPUT);
      $table.after($focus);
      $table.data('eternal-focus-hack', $focus);

      addListeners($final);

      var $tpl = $final.clone();
      $table.data('eternal-template', $tpl);

      function addListeners($last) {
        var $required = $last.find('[required]');

        function rowFilled() {
          var empty = 0;

          $required.each(function() {
            if($(this).is('input[type=radio], input[type=checkbox]')) {
              // TODO
              return;
            }

            if(!$(this).val()) {
              empty++;
            }

          });

          if(empty !== 0) {
            return false;
          }
          if($(this).is('input[type=radio], input[type=checkbox]')) {
            // TODO
            return false
          }
          else if(!$(this).val()) {
            return false;
          }

          return true;
        }

        $last.find('input, textarea, select').on('change', addRowIfNeeded);
        $focus.on('focusin', setFocus);
        var $tr = $last;

        function setFocus() {
          setTimeout(function() {
            $table
              .find('tr').last()
              .find('input, textarea, select').first()
              .focus();
          });
        };

        function addRowIfNeeded() {
          if($tr.is(':last-of-type') && rowFilled.call(this)) {
            var $added = $tpl.clone();
            $table.append($added);
            addListeners($added);
          }
        }

      }


    });

    return this;

  };
}( jQuery ));
