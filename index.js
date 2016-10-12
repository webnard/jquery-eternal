(function ( $ ) {
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
      var $tpl = $trs.last();
			$focus = $(FOCUS_INPUT);
			$table.after($focus);
      $table.data('eternal-focus-hack', $focus);
      $table.data('eternal-template', $tpl);
    });

    return this;

  };
}( jQuery ));
