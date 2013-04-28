directory.Item = Backbone.Model.extend({
    defaults: {
        isFlipped: false
    },
    
    initialize: function() {
    	this.imageUrl = this.get("Images")[0].url_75x75;
    	this.id = this.get("listing_id");
    }
    
});