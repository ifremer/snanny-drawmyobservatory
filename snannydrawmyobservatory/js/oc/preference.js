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
		load: function() {
			return $.ajax({
                url: OC.generateUrl('/apps/snannydrawmyobservatory/preferences/get'),
                success: function(result) {
                    Preferences._prefs = result;
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
        }

	};

	OCA = OCA || {};
	OCA.Preferences = Preferences;
})(jQuery);