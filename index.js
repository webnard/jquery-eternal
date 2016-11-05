(function ( $ ) {
  "use strict";
  var FOCUS_INPUT = '<input class="hack-fix-focus" type=text style="position:absolute; left:-10000px;">';

  /**
   * Fast UUID generator, RFC4122 version 4 compliant.
   * @author Jeff Ward (jcward.com).
   * @license MIT license
   * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
   **/
  var UUID = (function() {
    var self = {};
    var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }
    self.generate = function() {
      var d0 = Math.random()*0xffffffff|0;
      var d1 = Math.random()*0xffffffff|0;
      var d2 = Math.random()*0xffffffff|0;
      var d3 = Math.random()*0xffffffff|0;
      return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
        lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
        lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
        lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
    }
    return self;
  })();

  $.fn.eternal = function(action) {
    var $tables = this.filter('table');

    if(action && action.assignId) {
      $tables.data('eternal-id-field', action.assignId);
    }

    if(action === 'destroy') {
      $($tables.data('eternal-focus-hack')).destroy();
      $tables.removeData('eternal-focus-hack');
      $tables.removeData('eternal-template');
      $tables.removeData('eternal-rows');
      $tables.removeData('eternal-id-field');
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
      var idField = $owner.data('eternal-id-field');
      if(idField && !$(this).find('[name=' + idField + ']')) {
        $(this).find('td').first().prepend('<input type=hidden name="' + idField + '">');
      }
      $(this).find('[name]').each(function() {
        if(idField && $(this).attr('name') === idField && !$(this).val()) {
          $(this).val(UUID.generate());
        }
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
