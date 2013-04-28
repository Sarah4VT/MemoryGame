directory.PlayerView = Backbone.View.extend({

	initialize: function(){
		_.bindAll(this, "render");
		this.model.bind('change', this.render);
	},
	
    render:function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }

});