var LL7PlaybackGameRoomSceneUIManager = UIManagerBase.extend({
	ctor: function (gameType) {
		this.gameType = gameType;
		this._super();
	},
	onCreate: function () {
		var initUIClassNameList = ["GamePlayerInfoUI", "HelpUI", "PlaybackControlUI", "DDZPlayBackUI"];

		for (var uiClassName of initUIClassNameList) {
			this.add_ui(uiClassName.slice(0, uiClassName.length - 2).toLowerCase() + "_ui", [], uiClassName);
		}

		var ui_dict = table_config[this.gameType];
		this.add_ui("gameroom2d_ui", [], ui_dict["REPLAY_UI"]['PlaybackGameRoom2DUI']);
		this.roomLayoutMgr = new MultipleRoomLayout(this, [this.gameroom2d_ui], this.gameType);

		for (var uiClassName in ui_dict["PREPARE_UI"]) {
			this.add_ui(uiClassName.slice(0, uiClassName.length - 2).toLowerCase() + "_ui", [], ui_dict["PREPARE_UI"][uiClassName]);
		}
		for (var uiClassName in ui_dict["SETTLEMENT_UI"]) {
			this.add_ui(uiClassName.slice(0, uiClassName.length - 2).toLowerCase() + "_ui", [], ui_dict["SETTLEMENT_UI"][uiClassName]);
		}
		for (var uiClassName in ui_dict["RESULT_UI"]) {
			this.add_ui(uiClassName.slice(0, uiClassName.length - 2).toLowerCase() + "_ui", [], ui_dict["RESULT_UI"][uiClassName]);
		}
		for (var uiClassName in ui_dict["ROOM_INFO_UI"]) {
			this.add_ui(uiClassName.slice(0, uiClassName.length - 2).toLowerCase() + "_ui", [], ui_dict["ROOM_INFO_UI"][uiClassName]);
		}
		this.playback_ui = this.ll7playback_ui;
		this.ll7playback_ui = null;
		var info_json = cc.sys.localStorage.getItem("LL7_BG_JSON");
		if (!info_json) {
			var default_info_json = '{"now_bg":0}';
			cc.sys.localStorage.setItem("LL7_BG_JSON", default_info_json);
			info_json = cc.sys.localStorage.getItem("LL7_BG_JSON");
		}
		var info_dict = eval("(" + info_json + ")");
		cc.log("now_bg",info_dict["now_bg"]);
		var select_id = info_dict["now_bg"];
		this.backgroundStrategy = new LL7BackgroundStrategy(this, table_config[this.gameType]["BG_INFO"] ,select_id);
		this.backgroundStrategy.updateBackground();

		this.roomLayoutMgr.setBackgroundStrategy(this.backgroundStrategy)
	},

});
