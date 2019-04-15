"use strict";
/*-----------------------------------------------------------------------------------------
												interface
-----------------------------------------------------------------------------------------*/
var LL7PlaybackOperationAdapter = LL7GameRules.extend({

	_preprocessPlaybackData: function (data) {
		let init_info = data['init_info'];
		for (var i = 0; i < init_info["player_base_info_list"].length; i++) {
			// Note: 回放时认为玩家全都是在线的
			init_info["player_base_info_list"][i].online = 1
		}
		return data;
	},

	preprocessGameRoom: function (roomInfo) {
		if (this.runMode !== const_val.GAME_ROOM_PLAYBACK_MODE) {
			cc.warn("不是回放模式不允许调用", this.runMode);
			return;
		}

		this._preprocessPlaybackData(roomInfo);
		let initRoomInfo = roomInfo['init_info'];
		this.curGameRoom.updateRoomData(initRoomInfo);
		this.curGameRoom.playerStateList = roomInfo["player_state_list"];
		this.curGameRoom.startGame();
		this.curGameRoom.curPlayerSitNum = roomInfo["lord_idx"];
		this.curGameRoom.mainServerSitNum = roomInfo["lord_idx"];
		this.curGameRoom.coverPokers = cutil.deepCopy(roomInfo["round_result"]['cover_pokers']);
		this.curGameRoom.mainPokers = roomInfo["lord_pokers"];

        this.curGameRoom.player_cover_pokers = roomInfo["player_cover_pokers"];
		this.curGameRoom.maidiPokers = cutil.deepCopy(roomInfo["player_cover_pokers"]);

		this.curGameRoom.op_record_list = JSON.parse(roomInfo['op_record_list']);
		var init_tiles = roomInfo['init_pokers'] ? cutil.deepCopy(roomInfo['init_pokers']) : undefined;
		this.curGameRoom.handTilesList = [];
		// 拿底 埋底的过程
        this.curGameRoom.handTilesList = init_tiles;
        for (var i = 0; i < this.curGameRoom.player_cover_pokers.length; i++){
        	var cover_info = this.curGameRoom.player_cover_pokers[i];
        	var index = cover_info[0];
			if(i === 0){
                // 1.拿底
				var hand_tiles = init_tiles[index].concat(roomInfo["begin_cover_pokers"]);
                // 2.埋底
                collections.removeArray(hand_tiles, cover_info[1], true);
                this.curGameRoom.handTilesList[index] = hand_tiles;
			} else{
                // 1.拿底
                var hand_tiles = init_tiles[index].concat(this.curGameRoom.player_cover_pokers[i-1][1]);
                // 2.埋底
                collections.removeArray(hand_tiles, cover_info[1], true);
                this.curGameRoom.handTilesList[index] = hand_tiles;
			}
		}
		// 排下序
        for (var i = 0; i < this.curGameRoom.handTilesList.length; i++){
            this.curGameRoom.handTilesList[i] = cutil_ll7.sort(this.curGameRoom.handTilesList[i], this.curGameRoom.mainPokers[0]);
		}
		this.curGameRoom['round_result'] = roomInfo['round_result'];
	},


	setGameRoom: function (gameRoom) {
		if (this.runMode !== const_val.GAME_ROOM_PLAYBACK_MODE) {
			cc.warn("不是回放模式不允许调用", this.runMode);
			return;
		}
		this.curGameRoom = gameRoom;
	},

	onReplay: function (callback) {
		if (h1global.curUIMgr.roomLayoutMgr) {
			h1global.curUIMgr.roomLayoutMgr.notifyObserver2("hide");
			h1global.curUIMgr.roomLayoutMgr.startGame(function (complete) {
				if (complete && callback) {
					callback();
				}
			});
		}
	}

});
