(function ( $ ) {
  "use strict";
  var FOCUS_INPUT = '<input class="hack-fix-focus" type=text style="position:absolute; left:-10000px;">';

  $.fn.eternal = function(action) {
    var $tables = this.filter('table');

    if(action === 'destroy') {
      $($tables.data('eternal-focus-hack')).destroy();
      $tables.removeData('eternal-focus-hack');
      $tables.removeData('eternal-template');
      $tables.removeData('eternal-rows');
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

      // must come after the template is created, otherwise the name attributes
      // get munged
      setNames($table);

      function addListeners($last) {
        var $required = $last.find('[required]');

        function rowFilled() {
          var empty = 0;

          // TODO: use Array.some rather than going through every single input
          $required.each(function() {
            if($(this).is('input[type=radio]')) {
              if(!$('[name="' + $(this).attr('name') + '"]').is(':checked')) {
                empty++;
                return;
              }
            }

            else if($(this).is('input[type=checkbox]')) {
              if($(this).is(':not(:checked)')) {
                empty++;
                return;
              }
            }

            else if(!$(this).val()) {
              empty++;
              return;
            }

          });

          if(empty !== 0) {
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
            setNames($table, $added);
            $table.append($added);
            addListeners($added);
          }
        }

      }


    });

    return this;

  };

  function setNames($owner, $trs) {
    var rows = $owner.data('eternal-rows') || 0;
    $trs = $trs || $owner.find('tr');
    $trs.each(function() {
      var found = false;
      $(this).find('[name]').each(function() {
        var name = 'data[' + rows + '][' + $(this).attr('name') + ']';
        $(this).attr('name', name);

        // necessary if a table comes in with prepopulated fields
        // of which radio button names in a row are repeated in a second row
        if($(this).attr('checked')) {
          this.checked = true;
        }
        found = true;
      });
      if(found) {
        rows++;
      }
    });
    $owner.data('eternal-rows', rows);
  }

}( jQuery ));
