directory.AboutView = Backbone.View.extend({

    render:function () {
        this.$el.html(this.template());
        return this;
    }

});