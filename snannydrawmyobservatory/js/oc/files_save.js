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
	FileSave = {
		/**Current directory*/
		dir:'',
		/**Current filename*/
		filename:undefined,
		/**DataBrowser*/
		browser:undefined,

		_dialog:undefined,

		/**This method allow user to browse its owncloud*/
		browse: function(){
			if(!this.browse){
				this.browser = new OCA.DrawMyObservatory.Browser();
			}
			this.browser.browse(dir);

		},

		save: function(item){
			if (item.filename) {
				item.callback(item);
			} else {
				OCA.DrawMyObservatory.FileSave.showSaveDialog(item);
			}
		},

		showSaveDialog: function(item){
			var dialogId = OCA.TemplateUtil.createDialog(
				'filesaver.html',
				{
					filename: item.filename,
					icon: OC.imagePath('core','filetypes/folder'),
					dir:'/',
					buttonList:[
					{
						text: 'Save',
						click: function(){
							var dialog = $(this);
							var errorMsg = dialog.find('#errorMsg');
							var data = OCA.TemplateUtil.extractData(dialog);
							errorMsg.toggleClass('hidden', true);
							$.when(item.callback(data)).then(function(result){
								debugger;
								if (result.status === 'error') {
									//Display error
									errorMsg.html(result.message);
									errorMsg.toggleClass('hidden', false);
								} else {
									dialog.ocdialog('close');
								}

							});

						},
						defaultButton: true
					}]

			});
			this._dialog = $(dialogId);
		}
	};

	OCA.DrawMyObservatory.FileSave = FileSave;

})();

OC.Plugins.register('OCA.Files.FileList', OCA.DrawMyObservatory.FileList);