directory.ItemView = Backbone.View.extend({

	initialize: function(){
		_.bindAll(this, "_flip", "_markMatched");
		this.model.bind('change', this._flip);
		this.model.bind("markMatched", this._markMatched);
	},
	
	events: {
		"click .itemImg": "_itemClick",
	},

    render: function () {
        this.$el.html(this.template(this.model));
        return this;
    },
    
    _itemClick: function() {
    	if (!this.model.get("isFlipped")) {
    		this.model.set("isFlipped", true);
    	}
    },

    _flip: function(item) {
    	var _this = this;
    	if (_this.model.get("isFlipped")) {
	    	_this.$('.itemNotFlipped').fadeOut("fast", null, function() {_this.$('.itemFlipped').fadeIn();});
    	}
    	else {
    		_this.$('.itemNotFlipped').css('display', '');
    		_this.$('.itemFlipped').css('display', 'none');
    	}
    },
    
    _markMatched: function() {
    	var _this = this;
    	_this.$(".itemFlipped").removeClass("notMatched").addClass("matched");
    }
   
});