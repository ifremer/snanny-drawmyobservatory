/*
 * Copyright (c) 2015
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

(function() {
	OCA.DrawMyObservatory = OCA.DrawMyObservatory || {};

	var DIALOG_TEMPLATE = '<div id="filesaver">Filename : <input type="text" id="filenameTyped"/></div>';


	/**
	 * @namespace
	 */
	Browser = {
		/**This method allow user to browse its owncloud*/
		browse:function(dir, filePicker, buttons){
			
			//url 
			OC.generateUrl('apps/files/ajax/list.php?dir='+encodeURIComponent(dir)+'&sort=name&sortdirection=asc');
			
		}

	};

	OCA.DrawMyObservatory.Browser = Browser;

})();