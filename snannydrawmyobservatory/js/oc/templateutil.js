/**
 * 
 * Enable extensions of file upload
 *
 */
(function() {
	/**
	 * @namespace
	 */
	TemplateUtil = {

		templates: [],

		getTemplate: function(apps, name) {
			var id = apps+'_'+name;
			var defer = $.Deferred();
			if (!this.templates[id]) {
				var self = this;
				$.get(OC.filePath(apps, 'templates', name), function(tmpl) {
						self.templates[id] = $(tmpl);
						defer.resolve(self.templates[id]);
					})
					.fail(function(jqXHR, textStatus, errorThrown) {
						defer.reject(jqXHR.status, errorThrown);
					});
			} else {
				defer.resolve(this.templates[id]);
			}
			return defer.promise();
		},


		extractData: function(dialog) {
			var result = {};
			dialog.find('input, select, textarea').each(
			   function(idx, entry) {
				result[entry.name] = entry.value;
			});
			return result;
		},

		displayError: function(input, message) {
			input.attr('title', message);
			input.tooltip({
				placement: 'right',
				trigger: 'manual'
			});
			input.tooltip('show');
			input.addClass('error');

			input.bind('keyup', function() {
				input.attr('title', '');
				input.tooltip('hide');
				input.removeClass('error');
			});
		},

		createDialog: function(template, item){
			var dialogName = 'oc-dialog-' + OCdialogs.dialogsCounter + '-'+template;
			var dialogId = '#' + dialogName;
			$.when(OCA.TemplateUtil.getTemplate('snannydrawmyobservatory', template)).then(function($tmpl) {
				
				var $dlg = $tmpl.octemplate({
					dialog_name: dialogName,
					filename: item.filename,
					dir:(item.dir)?item.dir:'/',
					icon:item.icon
				});
				$('body').append($dlg);
				$dlg.ocdialog({
					closeOnEscape: true,
					modal: true,
					buttons: item.buttonList,
					close:function(){
						$(dialogId).remove();
					}
				});
			});
			return dialogId;
		},

		showNotificationMessage:function(text, title) {;
			var dialog = OCdialogs.info(
				text,
				title,
				function(){},
				true
			);
		}
	};

	OCA = OCA || {};
	OCA.TemplateUtil = TemplateUtil;
})(jQuery);