directory.Game = Backbone.Model.extend({

	defaults: {
		boardSize: 4,
		numPlayers: 2,
		matchesMade: 0,
		currentPlayer: 1,
        statusMsg: ""
	},
	
	initialize: function() {
		this._setStatusMsgCurrentPlayer();
	},
	
	itemFlipped: function(item) {
		var _this = this;
    	var firstItemFlipped = _this.get("firstItemFlipped");
    	if (firstItemFlipped) {
    		var currentPlayer = _this.get("currentPlayer");
        	if (firstItemFlipped.id == item.id) { // We have a match!
        		_this.get("players")[currentPlayer-1].model.incrementMatches();
        		_this.attributes.matchesMade++;
        		firstItemFlipped.trigger("markMatched");
        		item.trigger("markMatched");
        		_this.set("firstItemFlipped", null);
        		_this._setStatusMsgFoundMatch();
    			var boardSize = _this.get("boardSize");
    	    	if (_this.get("matchesMade") == ((boardSize*boardSize)/2)) {
    	    		this._setStatusMsgGameOver();
    	    	}
        	}
        	else {
        		_this._setStatusMsgNoMatch();
        		$("body").block({message: null});
    			setTimeout(function() {
    				firstItemFlipped.set("isFlipped", false);
    				item.set("isFlipped", false);
    				if (currentPlayer == _this.get("numPlayers"))
    					_this.set("currentPlayer", 1);
    				else
    					_this.set("currentPlayer", currentPlayer+1);
    				_this._setStatusMsgCurrentPlayer();
    				_this.set("firstItemFlipped", null);
    				$("body").unblock();
    			}, "1500");
        	}
    	}
    	else {
    		_this.set("firstItemFlipped", item);
    	}
	},
	
	_setStatusMsgCurrentPlayer: function() {
		this.set("statusMsg", "Player " + this.get("currentPlayer") + "'s turn");
	},
	
	_setStatusMsgFoundMatch: function() {
		this.set("statusMsg", "Player " + this.get("currentPlayer") + ", you found a match.  Go again!");
	},
	
	_setStatusMsgNoMatch: function() {
		this.set("statusMsg", "Not a match");
	},

	_setStatusMsgGameOver: function() {
		var winners = [];
		var highestMatches = 0;
		var players = this.get("players");
		if (players.length > 1) {
			$.each(players, function(i, player) {
				var matches = player.model.get("matches");
				if (winners.length == 0) {
					highestMatches = matches;
					winners.push(player);
				}
				else if (matches > highestMatches) {
					winners.length = 0;
					winners.push(player);
					highestMatches = matches;
				}
				else if (matches == highestMatches) {
					winners.push(player);
				}
			});
			if (winners.length > 1) {
				var winnersNames = "";
				$.each(winners, function(i, player) {
					if (winnersNames.length > 0)
						winnersNames = winnersNames + " and ";
					winnersNames = winnersNames + player.model.get("name") + " ";
				});
				this.set("statusMsg", winnersNames + "tied!  Select 'Start New Game' to play again.");
			}
			else {
				this.set("statusMsg", winners[0].model.get("name") + " won!  Select 'Start New Game' to play again.");
			}
		}
		else {
			this.set("statusMsg", "Game over!  Select 'Start New Game' to play again.");
		}
		
	}
});