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

	/**
	 * @namespace
	 */
	OCA.DrawMyObservatory.Util = {
		/**
		 * Initialize the versions plugin.
		 *
		 * @param {OCA.Files.FileList} fileList file list to be extended
		 */
		attach: function(fileList) {
			var id = 0;
			var fileActions = fileList.fileActions;
			fileActions.registerAction({
				name: 'Visualize',
				displayName: '',
				mime: 'all',
				permissions: OC.PERMISSION_ALL,
				icon: OC.imagePath('drawmyobservatory', 'view'),
				type: OCA.Files.FileActions.TYPE_INLINE,
				actionHandler: function(fileName) {
					//get dir
					var dir = OCA.DrawMyObservatory.Util.getDir();
					//get
					var url = OC.generateUrl('/apps/drawmyobservatory/?dir='+dir+'&filename='+fileName+'&user=admin');
					window.open(url, "_blank");

					//fileList.showDetailsView(fileName, 'shareTabView');
				},
				render: function(actionSpec, isDefault, context) {
					var fileArray = context.fileList.files;
					var file = fileArray[id];
					id = (id+1)%fileArray.length;

					if(file != undefined){
						if(file.name.substr(file.name.lastIndexOf('.') + 1) === "moe"){
							return fileActions._defaultRenderAction.call(fileActions, actionSpec, isDefault, context);
						}
					}
					return null;
				}
			});

		},

		getDir:function() {
			var name = "dir";
    		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        	results = regex.exec(location.search);
    		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}
	};
})();

OC.Plugins.register('OCA.Files.FileList', OCA.DrawMyObservatory.Util);