var directory = {

    views: {},

    models: {},

    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (directory[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    directory[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    }

};

directory.Router = Backbone.Router.extend({

    routes: {
        "":      "game",
        "about": "about"
    },

    initialize: function () {
        directory.shellView = new directory.ShellView();
        $('body').html(directory.shellView.render().el);
        this.$content = $("#content");
    },

    game: function () {
        // Since the game view never changes, we instantiate it and render it only once
        if (!directory.game1View) {
            this.game = new directory.Game();
            directory.game1View = new directory.GameView({model:this.game});
            directory.game1View.render();
        } else {
            directory.game1View.delegateEvents(); // delegate events when the view is recycled
            // TODO: Figure out why events are getting lost.  Probably has something to do with
            //       the events being on the itemView and not the gameView.  Just a guess... 
        }
        this.$content.html(directory.game1View.el);
        directory.shellView.selectMenuItem('home-menu');
    },

    about: function () {
        if (!directory.aboutView) {
            directory.aboutView = new directory.AboutView();
            directory.aboutView.render();
        }
        this.$content.html(directory.aboutView.el);
        directory.shellView.selectMenuItem('about-menu');
    }
});

$(document).on("ready", function () {
    directory.loadTemplates(["GameView", "AboutView", "ShellView", "PlayerView", "ItemView"],
        function () {
            directory.router = new directory.Router();
            Backbone.history.start();
        });
});
