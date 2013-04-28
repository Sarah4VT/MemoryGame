directory.GameView = Backbone.View.extend({

	initialize: function() {
		_.bindAll(this, "_updateStatus");
		this.model.bind('change', this._updateStatus);
	},
	
	events: {
		"click #startGameBtn": "startGameBtnClick",
		"click #startNewGameBtn": "startNewGameBtnClick"
	},
	
    render: function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
    
    startNewGameBtnClick:function () {
    	// Clear out current game and create a new one
    	delete this.model;
    	this.model = new directory.Game();
    	this.model.bind('change', this._updateStatus);
    	
    	$("#itemTable").empty();
    	$("#playersDiv").empty();

		// Show start screen and hide board
		$("#playGameDiv").hide();
		$("#startGameDiv").show();
    },
    
	startGameBtnClick: function() {
		var _this = this;

		// Pull data off form to create new game
		var boardSize = null;
		switch ($("#difficulty").val()) {
			case "Beginner":
				boardSize = 4;
				break;
			case "Intermediate":
				boardSize = 6;
				break;
			case "Advanced":
				boardSize = 8;
				break;
			default:
				boardSize = 4;
		} 		
		_this.model.set("boardSize", boardSize);
		_this.model.set("numPlayers", $("#numPlayers").val());

		// Request items to populate board with
		var api_key = "o44asxyke14sl9g647yxlp24";
		var numItems = (boardSize*boardSize)/2;
		var url = "http://openapi.etsy.com/v2/listings/active.js?includes=Images:1&limit=" + numItems + "&api_key=" + api_key;
		$.ajax({
			url: url,
			dataType: 'jsonp',
			success: function(data) {
				if (data.ok) {
					var boardItems = [];
					$.each(data.results, function(i, item) {
						// Create a pair for each item
						for (var j = 0; j < 2; j++) {
							boardItems.push(new directory.Item(item));
						}
					});
					_this._renderBoard(boardItems);
				}
				else {
					console.log("error retrieving items!");
				}
			}
		});
	},
	
	_renderBoard: function(boardItems) {
		// Randomize boardItems before displaying
		boardItems.shuffle();
		
		// Add items to board
		var boardSize = this.model.get("boardSize");
		var index = 0;
		var items = [];
		for (var i = 0; i < boardSize; i++) {
			var row = $("<tr id='row" + i + "'></tr>");
				row.appendTo($("#itemTable"));
			for (var j = 0; j < boardSize; j++) {
				var col = $("<td id='col" + j + "'></td>");
				col.appendTo(row);

				var itemView = new directory.ItemView({model: boardItems[index]});
				items.push(itemView);
	            col.append(itemView.render().el);
	            index++;

	            itemView.model.bind('change', function(item) {
          	    	if (item.get("isFlipped") === true) {
          	    		this.model.itemFlipped(item);
          	    	}
	            }, this);
			}
		}
		this.model.set("items", items);
		
		// Add players to board
		var numPlayers = this.model.get("numPlayers");
		var players = [];
		for (var i = 0; i < numPlayers; i++) {
			var id = i + 1;
            var playerView = new directory.PlayerView({model: new directory.Player({id: id, name: "Player " + id})});
            players.push(playerView);
            $("#playersDiv").append(playerView.render().el);
		}
		this.model.set("players", players);
		
		// Show board and hide start screen
		$("#startGameDiv").hide();
		$("#playGameDiv").show();
	},
	
    _updateStatus: function() {
    	this.$("#statusDiv").empty();
    	this.$("#statusDiv").append(this.model.get("statusMsg"));
    }
});

Array.prototype.shuffle = function() {
	var i = this.length, j, tempi, tempj;
	if ( i == 0 ) return this;
	while ( --i ) {
		j = Math.floor( Math.random() * ( i + 1 ) );
		tempi   = this[i];
		tempj   = this[j];
		this[i] = tempj;
		this[j] = tempi;
	}
	return this;
};