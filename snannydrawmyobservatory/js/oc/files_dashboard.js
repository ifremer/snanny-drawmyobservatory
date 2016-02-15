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
	OCA.DrawMyObservatory.FileList = {

		_fileMenu:undefined,
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
				icon: OC.imagePath('snannydrawmyobservatory', 'view'),
				type: OCA.Files.FileActions.TYPE_INLINE,
				actionHandler: function(fileName) {
					//get dir
					var dir = OCA.DrawMyObservatory.FileList.getDir();
					//get
					var url = OC.generateUrl('/apps/snannydrawmyobservatory/?action=edit&dir='+dir+'&filename='+fileName);
					window.open(url, "_blank");
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

			OCA.DrawMyObservatory.FileList.attachListener();

		},

		attachListener:function(){

			var tmpBody = $('body');
			tmpBody.bind("DOMSubtreeModified", function() {
				if(!OCA.DrawMyObservatory.FileList._fileMenu){
				    var item = $('.newFileMenu');
				    if(item.length > 0 ){
				    	tmpBody.off("DOMSubtreeModified");
				    	item.bind("DOMSubtreeModified", OCA.DrawMyObservatory.FileList.onDomChanged);
				    	OCA.DrawMyObservatory.FileList._fileMenu = item;
				    }
				}
			});

		    $("#controls .new").bind('click', function(){
				var menu = OCA.DrawMyObservatory.FileList._fileMenu;
				if(menu){
					var item = menu.find('#createObservatoryItem');
					if(item.length == 0){
						OCA.DrawMyObservatory.FileList._addMenuItem(menu);
					}
				}
			});
		},

		onDomChanged:function(event){
			var menu = OCA.DrawMyObservatory.FileList._fileMenu;
			menu.off("DOMSubtreeModified");
			var item = menu.find('#createObservatoryItem');
			if(item){
				OCA.DrawMyObservatory.FileList._addMenuItem(menu);
			}
		},

		_addMenuItem:function(menu){
			menu.find('ul').append('<li id="createObs"><a id="createObservatoryItem" class="supMenuItem"><span class="icon icon-obs svg"></span><span>Create Observatory</span></div></li>');
			var item = menu.find('#createObservatoryItem');
			item.bind('click', OCA.DrawMyObservatory.FileList._onCreateObservatory);
		},

		_onCreateObservatory:function(){
			var dir = OCA.DrawMyObservatory.FileList.getDir();
			//get
			var url = OC.generateUrl('/apps/snannydrawmyobservatory/?action=create&dir='+dir);
			window.open(url, "_blank");
		},


		/**
		* @return the current directory
		*/
		getDir:function() {
			var name = "dir";
    		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        	results = regex.exec(location.search);
    		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}
	};

})();

OC.Plugins.register('OCA.Files.FileList', OCA.DrawMyObservatory.FileList);