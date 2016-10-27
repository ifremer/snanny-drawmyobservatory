/**
 *
 * Enable Preferences storage
 *
 */
(function() {
	/**
	 * @namespace
	 */
	Preferences = {

	    _readonly:false,
        _prefs:[],

        /**
        * Add preference
        */
        add: function(preference){
            var name = preference + ".moe";
            if($.inArray(name, this._prefs) == -1){
                this._prefs.push(preference + ".moe");
            }
        },

        /**
        * Remove preference
        */
        remove: function(preference){
            var name = preference + ".moe";
            var index = $.inArray(name, this._prefs);
            if(index > -1){
                this._prefs.splice(index,1);
            }
        },

        /**
        * Load preferences
        */
		load: function(filename) {
		    var url = '/apps/snannydrawmyobservatory/preferences/get';
            if(filename !== undefined) {
                url = url + '?file=' + filename;
            }
			return $.ajax({
                url: OC.generateUrl(url),
                success: function(result) {
                    if($.isArray(result.prefs)) {
                        Preferences._prefs = result.prefs;
                    }
                    if(result.permission === 17){
                        Preferences._readonly = true;
                    }
                },
                error: function() {
                    $(".se-pre-con").fadeOut("fast");
                }
            });
		},

        /**
        * Save the preferences
        */
        save: function(){
            $.ajax({
                url: OC.generateUrl('/apps/snannydrawmyobservatory/preferences/save'),
                type: 'POST',
                data: {
                    "preferences": this._prefs
                },
                success: function() {}
            });
        },

        /**
        * Return prefs values
        */
        get: function(){
            return this._prefs;
        },

        getPermission: function () {
            return this._readonly;
        }

	};

	OCA = OCA || {};
	OCA.Preferences = Preferences;
})(jQuery);