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
				item.callback(item)
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
					dir:(item.dir)?item.dir:'/',
					buttonList:[
					{
						text: 'Save',
						click: function(){
							var dialog = $(this);
							var errorMsg = dialog.find('#errorMsg');
							var waitingMessage = dialog.find("#waitingDialog");
							var data = OCA.TemplateUtil.extractData(dialog);
							waitingMessage.toggleClass('hidden', false);
							errorMsg.toggleClass('hidden', true);
							$.when(item.callback(data)).then(function(result){
								if (result.status === 'error') {
									//Display error
									errorMsg.html(result.message);
									waitingMessage.toggleClass('hidden', true);
									errorMsg.toggleClass('hidden', false);
								} else {
									waitingMessage.toggleClass('hidden', true);
									dialog.ocdialog('close');
								}

							});

						},
						defaultButton: true
					}]

			});
			this._dialog = $(dialogId);
			return $(dialogId);
		}
	};

	OCA.DrawMyObservatory.FileSave = FileSave;

})();

OC.Plugins.register('OCA.Files.FileList', OCA.DrawMyObservatory.FileList);