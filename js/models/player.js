directory.Player = Backbone.Model.extend({

	defaults: {
		matches: 0
	},
	
    incrementMatches: function() {
    	this.set("matches", this.get("matches") + 1);
    }

});