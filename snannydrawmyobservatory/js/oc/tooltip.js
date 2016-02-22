var itemContents = [];

TooltipManager = Backbone.View.extend({

	_currentItem:undefined,

	initialize:function(){
		$('.paper-container').on('mouseenter', this.hide);
	},

	register: function(target, cellId, content){

		itemContents[cellId.toString()] = content;
		$(target).on('mouseover', this.render);
		$(target).on('mousedown', this.hide);
	},

	hide: function() {
		$('.tooltip-container').hide();
	},

	render: function(evt) {

		var target;
		var isPoint = !_.isUndefined(evt.x) && !_.isUndefined(evt.y);

		if (isPoint) {

			target = evt;

		} else {

			this.$target = $(evt.target).closest('[model-id]');
			target = this.$target[0];
		}
		var content;
		if(target){
			var cellId = target.attributes['model-id'].nodeValue;
			content = itemContents[cellId];
		}

		var tooltip = $('.tooltip-container');

		if(content === "" || content === undefined){
			//No display 
			tooltip.hide();
		}else{
			tooltip.html(_.isFunction(content) ? content(target) : content);
			tooltip.css({
				top: target.getBoundingClientRect().top - 25,
				left: target.getBoundingClientRect().left + 70
			});
			tooltip.show();
		}
	},
});

OCA = OCA || {};
OCA.TooltipManager = TooltipManager;