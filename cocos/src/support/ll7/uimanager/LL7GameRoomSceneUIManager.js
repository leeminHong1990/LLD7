var LL7GameRoomSceneUIManager = UIManagerBase.extend({

	ctor: function (gameType) {
		this.gameType = gameType;
		this._super();
	},

	onCreate: function () {
		var initUIClassNameList = ["AudioRecordUI", "HelpUI", "ConfigUI", "GamePlayerInfoUI", "CommunicateUI"
			, "LL7MaiDiUI", "LL7PreviousUI"
			, "ApplyCloseUI", "GPSUI", "ToastUI", "GPSceneUI", "ClubInviteUI", "ConfirmUI"];
		for (var uiClassName of initUIClassNameList) {
			this.add_ui(uiClassName.slice(0, uiClassName.length - 2).toLowerCase() + "_ui", [], uiClassName);
		}

		var room_ui = [];
		var ui_dict = table_config[this.gameType];
		for (var uiClassName in ui_dict["PLAY_UI"]) {
			this.add_ui(uiClassName.slice(0, uiClassName.length - 2).toLowerCase() + "_ui", [], ui_dict["PLAY_UI"][uiClassName]);
			room_ui.push(eval("this." + uiClassName.slice(0, uiClassName.length - 2).toLowerCase() + "_ui"))
		}
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

		this.roomLayoutMgr = new MultipleRoomLayout(this, room_ui, this.gameType);

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
