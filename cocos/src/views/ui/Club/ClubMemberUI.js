"use strict";

var ClubMemberUI = UIBase.extend({
    ctor:function () {
        this._super();
        this.resourceFilename = "res/ui/ClubMemberUI.json";
    },

    show_by_info:function (club_id) {
        if(!h1global.player() || !h1global.player().club_entity_dict){return}
        if(!h1global.player().club_entity_dict[club_id]){return}
        this.club = h1global.player().club_entity_dict[club_id];
        this.show();
    },

    initUI:function () {
        var self = this;
        var club_player_panel = this.rootUINode.getChildByName("club_player_panel");
        var player_panel = club_player_panel.getChildByName("player_panel");

        player_panel.getChildByName("back_btn").addTouchEventListener(function (sender, eventType) {
            if(eventType === ccui.Widget.TOUCH_ENDED){
                self.hide();
            }
        });

        this.mem_page_index = 1;
        this.apply_page_index = 1;
        this.page_show_num = 10;

		this.cur_page_num = 1;//当前页数
		this.max_page_num = 1;//最大页数
		this.mem_total = 0;//成员总人数

        var left_btn_panel = player_panel.getChildByName("left_btn_panel")

        var member_btn = left_btn_panel.getChildByName("member_btn");
        var apply_btn = left_btn_panel.getChildByName("apply_btn");
        var search_btn = left_btn_panel.getChildByName("search_btn");

        this.btn_list = [member_btn, apply_btn, search_btn];

        var member_panel = player_panel.getChildByName("member_panel");
        var apply_panel = player_panel.getChildByName("apply_panel");
        var search_panel = player_panel.getChildByName("search_panel");
        var detail_panel = player_panel.getChildByName("detail_panel");

        var page_list = [ member_panel,apply_panel , search_panel];

        function update_now_tab(index){
            self.now_options = index;
            self.update_page_panel(self);
            for(var i = 0; i<self.btn_list.length;i++){
                if(i == index){
                    self.btn_list[i].getChildByName("label_select").setVisible(true);
                    self.btn_list[i].getChildByName("label_normal").setVisible(false);
                }else{
                    self.btn_list[i].getChildByName("label_select").setVisible(false);
                    self.btn_list[i].getChildByName("label_normal").setVisible(true);
                }
            }
            if(index==2){
                player_panel.getChildByName("base_panel").getChildByName("page_panel").setVisible(false);
            }else{
                player_panel.getChildByName("base_panel").getChildByName("page_panel").setVisible(true);
            }
        }

        this.now_options = 0;
        this.is_owner = this.club.is_owner(h1global.player().userId);
        if(this.is_owner){
            this.now_options = 1;
            UICommonWidget.create_tab(this.btn_list, page_list,1,undefined,update_now_tab);
        }else{
            this.btn_list = [member_btn];
            page_list = [detail_panel];
            UICommonWidget.create_tab(this.btn_list, page_list,0,undefined,update_now_tab);
            detail_panel.setVisible(true);
            apply_btn.setVisible(false);
            search_btn.setVisible(false);
            member_btn.setVisible(false);
            member_panel.setVisible(false);
            player_panel.getChildByName("base_panel").getChildByName("page_panel").setPositionX(460);
        }

        this.init_invite_panel();
        //this.init_search_panel();
        this.init_page_btn_pt();

        // h1global.player().clubOperation(const_val.CLUB_OP_GET_MEMBERS, this.club.club_id);
		cutil.lock_ui();
		h1global.player().clubOperation(const_val.CLUB_OP_GET_MEMBERS2, self.club.club_id,[0,self.page_show_num,"",["online","free"]]);
        if(this.club.is_owner(h1global.player().userId)){
            h1global.player().clubOperation(const_val.CLUB_OP_GET_APPLICANTS, this.club.club_id);
        }
    },

    init_page_btn_pt:function () {
        var page_panel = this.rootUINode.getChildByName("club_player_panel").getChildByName("player_panel").getChildByName("base_panel").getChildByName("page_panel");
        var left_page_btn = page_panel.getChildByName("left_page_btn");
        var right_page_btn = page_panel.getChildByName("right_page_btn");

        left_page_btn.hitTest = function (pt) {
            var size = this.getContentSize();
            var bb = cc.rect(-size.width*0.1, -size.height * 0.3, size.width, size.height * 2);
            return cc.rectContainsPoint(bb, this.convertToNodeSpace(pt));
        };
        right_page_btn.hitTest = function (pt) {
            var size = this.getContentSize();
            var bb = cc.rect(-size.width*0.1, -size.height * 0.3, size.width, size.height * 2);
            return cc.rectContainsPoint(bb, this.convertToNodeSpace(pt));
        };
    },

    update_club_member:function (club_id,member_list,now_page,total) {
        if(!this.is_show){return;}
        if(this.club.club_id !== club_id){return;}
        var self = this;
        this.members = member_list;
		this.cur_page_num = now_page+1;//当前页数
		this.mem_total = total;//成员总人数

        this.update_page_panel(self);
    },

    reset_club_member:function(club_id){
        //成员发生了变化
		if(this.club.club_id !== club_id){return;}
		var self = this;
		cutil.lock_ui();
		// h1global.player().clubOperation(const_val.CLUB_OP_GET_MEMBERS2, self.club.club_id,[0,self.page_show_num,"",["online","free"]]);
		h1global.player().clubOperation(const_val.CLUB_OP_GET_MEMBERS2, self.club.club_id,[self.mem_page_index-1,self.page_show_num,"",["online","free"]]);
    },

    update_member_page:function (info_panel, show_list) {
        if(!this.is_show){return;}
        var self = this;

        function update_item_func(itemPanel, itemData, index){
                // if(index%2 === 1){
                //     itemPanel.getChildByName("light_img").loadTexture("res/ui/CirclePopUI/rank_scroll_bg2.png");
                // } else {
                //     itemPanel.getChildByName("light_img").loadTexture("res/ui/CirclePopUI/rank_scroll_bg1.png");
                // }
                var head_img_frame = itemPanel.getChildByName("head_img_frame");
                // head_img_frame.setVisible(false);
                itemPanel.reorderChild(itemPanel.getChildByName("light_img"), head_img_frame.getLocalZOrder()-10);
			    itemPanel.__imgUrl = itemData["head_icon"];
                cutil.loadPortraitTexture(itemData["head_icon"], itemData["sex"], function(img){
                    if(self && self.is_show && cc.sys.isObjectValid(itemPanel)){
						if (itemPanel.__imgUrl != itemData["head_icon"]) {
							return;
						}
                        if(itemPanel.getChildByName("head_icon")){
                            itemPanel.removeChild(itemPanel.getChildByName("head_icon"))
                        }
                        var portrait_sprite  = new cc.Sprite(img);
                        portrait_sprite.setScale(74/portrait_sprite.getContentSize().width);
                        itemPanel.addChild(portrait_sprite);
                        portrait_sprite.setPosition(head_img_frame.getPosition());
                        portrait_sprite.setName("head_icon");
                        itemPanel.reorderChild(portrait_sprite, head_img_frame.getLocalZOrder())
                    }
                });

                itemPanel.getChildByName("name_label").setString(cutil.info_sub_ver2(itemData["nickname"], 4));
                itemPanel.getChildByName("id_label").setString(itemData["userId"]);
                // cc.log(itemData);

                if(itemData["online"]){
                    if(itemData["free"]){
                        itemPanel.getChildByName("state_label").setString("空闲");
                        itemPanel.getChildByName("state_label").setTextColor(cc.color(65, 140, 35));
                    }else{
                        itemPanel.getChildByName("state_label").setString("游戏中");
                        itemPanel.getChildByName("state_label").setTextColor(cc.color(255, 57, 65));
                    }
                }else{
                    //离线状态
                    itemPanel.getChildByName("state_label").setString(cutil.get_off_online_time(itemData["logout_time"]));
                    itemPanel.getChildByName("state_label").setTextColor(cc.color(194, 156, 110));
                }


                // itemPanel.getChildByName("mark_label").setString(itemData["notes"]);
                //
                // itemPanel.getChildByName("mark_btn").addTouchEventListener(function(sender, eventType){
                //     if(eventType === ccui.Widget.TOUCH_ENDED){
                //         if(h1global.curUIMgr.editor_ui && !h1global.curUIMgr.editor_ui.is_show){
                //             h1global.curUIMgr.editor_ui.show_by_info(function (editor_string) {
                //                 h1global.player().clubOperation(const_val.CLUB_OP_SET_MEMBER_NOTES, self.club.club_id, [itemData["userId"], editor_string]);
                //             }, "请输入玩家备注", const_val.CLUB_MAX_MARK_LEN)
                //         }
                //     }
                // });

                itemPanel.getChildByName("delete_btn").addTouchEventListener(function (sender, eventType) {
                    if(eventType === ccui.Widget.TOUCH_ENDED){
                        if(h1global.curUIMgr.confirm_ui && !h1global.curUIMgr.confirm_ui.is_show && self.club.club_id) {
                            h1global.curUIMgr.confirm_ui.show_by_info("确定将该成员踢出亲友圈?", function () {
								h1global.player().clubOperation(const_val.CLUB_OP_KICK_OUT, self.club.club_id, [itemData["userId"]]);
                            });
                        }
                    }
                });
                // if(h1global.player().userId === self.club.owner.userId){
                //     if(self.club.owner.userId === itemData.userId){
                //         itemPanel.getChildByName("delete_btn").setVisible(false);
                //         itemPanel.getChildByName("light_img").loadTexture("res/ui/CirclePopUI/light2_img.png");
                //     }else{
                //         itemPanel.getChildByName("delete_btn").setVisible(true);
                //         itemPanel.getChildByName("light_img").loadTexture("res/ui/CirclePopUI/light_img.png");
                //     }
                // }else{
                //     itemPanel.getChildByName("delete_btn").setVisible(false);
                // }
            if(h1global.player().userId === self.club.owner.userId){
                if(self.club.owner.userId === itemData.userId){
                    itemPanel.getChildByName("delete_btn").setVisible(false);
                }else{
                    itemPanel.getChildByName("delete_btn").setVisible(true);
                }
            }else{
                itemPanel.getChildByName("delete_btn").setVisible(false);
            }
            if(h1global.player().userId === itemData.userId){
                itemPanel.getChildByName("light_img").loadTexture("res/ui/CirclePopUI/light2_img.png");
            }else{
                itemPanel.getChildByName("light_img").loadTexture("res/ui/CirclePopUI/light_img.png");
            }
        }
        UICommonWidget.update_scroll_items(info_panel, show_list, update_item_func)
    },

    update_club_apply:function (apply_list) {
        if (!this.is_show) {
            return;
        }
        this.club.apply_list = apply_list;
        var self = this;
        this.update_page_panel(self);
    },

    update_apply_page:function (info_panel, show_list) {
        if(!this.is_show){return;}
        var self = this;
        function update_item_func(itemPanel, itemData, index) {

            // if(index%2 === 1){
            //     itemPanel.getChildByName("light_img").loadTexture("res/ui/CirclePopUI/rank_scroll_bg2.png");
            // } else {
            //     itemPanel.getChildByName("light_img").loadTexture("res/ui/CirclePopUI/rank_scroll_bg1.png");
            // }

            var head_img_frame = itemPanel.getChildByName("head_img_frame");
            // head_img_frame.setVisible(false);
            itemPanel.reorderChild(itemPanel.getChildByName("light_img"), head_img_frame.getLocalZOrder()-10);

            cutil.loadPortraitTexture(itemData["head_icon"], itemData["sex"], function(img){
                if(self && self.is_show){
                    if(itemPanel.getChildByName("head_icon")){
                        itemPanel.removeChild(itemPanel.getChildByName("head_icon"))
                    }
                    var portrait_sprite  = new cc.Sprite(img);
                    portrait_sprite.setScale(74/portrait_sprite.getContentSize().width);
                    itemPanel.addChild(portrait_sprite);
                    portrait_sprite.setPosition(head_img_frame.getPosition());
                    portrait_sprite.setName("head_icon");
                    itemPanel.reorderChild(portrait_sprite, head_img_frame.getLocalZOrder())
                    // var portrait_sprite = new cc.Sprite(img);
                    // portrait_sprite.setScale(85 / portrait_sprite.getContentSize().width);
                    // var stencil = new cc.Sprite("res/ui/GameHallUI/mask2.png"); // 遮罩模板 -- 就是你想把图片变成的形状
                    // var printed = new cc.Sprite("res/ui/GameHallUI/fram_printed.png");
                    // var frame = new cc.Sprite("res/ui/GameHallUI/frame.png");
                    // var head_layer = new cc.Layer();
                    // var clipnode = new cc.ClippingNode();
                    // clipnode.setInverted(false);
                    // clipnode.setAlphaThreshold(1);
                    // clipnode.setStencil(stencil);
                    // clipnode.addChild(portrait_sprite);
                    // head_layer.setName("head_icon");
                    // head_layer.addChild(clipnode);
                    // head_layer.addChild(printed);
                    // head_layer.addChild(frame);
                    // head_layer.setPosition(head_img_frame.getPosition());
                    // itemPanel.addChild(head_layer);
                }
            });
            itemPanel.getChildByName("name_label").setString(cutil.info_sub_ver2(itemData["nickname"], 4));
            itemPanel.getChildByName("id_label").setString("申请加入");
            itemPanel.getChildByName("time_label").setString(cutil.convert_timestamp_to_ymd(itemData["ts"]));

            itemPanel.getChildByName("agree_btn").addTouchEventListener(function(sender, eventType){
                if(eventType === ccui.Widget.TOUCH_ENDED){
                    if(h1global.curUIMgr.editor_ui && !h1global.curUIMgr.editor_ui.is_show){
                        h1global.player().clubOperation(const_val.CLUB_OP_AGREE_IN, self.club.club_id, [itemData["userId"]]);
                    }
                }
            });

            itemPanel.getChildByName("cancel_btn").addTouchEventListener(function (sender, eventType) {
                if(eventType === ccui.Widget.TOUCH_ENDED){
                    h1global.player().clubOperation(const_val.CLUB_OP_REFUSE_IN, self.club.club_id, [itemData["userId"]]);
                }
            });
        }
        UICommonWidget.update_scroll_items(info_panel, show_list, update_item_func)
    },

    init_invite_panel:function () {
        var club_player_panel = this.rootUINode.getChildByName("club_player_panel");
        var player_panel = club_player_panel.getChildByName("player_panel");
        var search_panel = player_panel.getChildByName("search_panel");

        var sub_panel = search_panel.getChildByName("sub_panel");
        var info_panel = sub_panel.getChildByName("info_panel");

        sub_panel.getChildByName("id_edit_box").setPlaceHolderColor(cc.color(255,255,255));

        // var warning_label = search_panel.getChildByName("warning_label");
        //
        // if(!this.club.is_owner(h1global.player().userId)){
        //     warning_label.setVisible(true);
        //     sub_panel.setVisible(false);
        //     return
        // }else {
        //     warning_label.setVisible(false);
        //     sub_panel.setVisible(true);
        // }

        sub_panel.getChildByName("search_btn").addTouchEventListener(function(sender, eventType){
            if(eventType === ccui.Widget.TOUCH_ENDED){
                var id_str = sub_panel.getChildByName("id_edit_box").getString();
                if(isNaN(Number(id_str))){
                    if(h1global.globalUIMgr.info_ui){
                        h1global.globalUIMgr.info_ui.show_by_info("输入不合法");
                    }
                    return
                }
                var id = Number(id_str);
                if(id < 1000000 || id > 9999999){
                    if(h1global.globalUIMgr.info_ui){
                        h1global.globalUIMgr.info_ui.show_by_info("玩家ID不合法");
                    }
                    return
                }
                h1global.player().queryUserInfo(id);
                sub_panel.getChildByName("id_edit_box").setString("");
            }
        });

        info_panel.getChildByName("clear_btn").addTouchEventListener(function(sender, eventType){
            if(eventType === ccui.Widget.TOUCH_ENDED){
                info_panel.setVisible(false);
            }
        })
    },

    init_search_panel:function () {

        // if(!this.club.is_owner(h1global.player().userId)){
        //     return
        // }
        var self = this;
        var club_player_panel = this.rootUINode.getChildByName("club_player_panel");
        var player_panel = club_player_panel.getChildByName("player_panel");
        var search_panel = player_panel.getChildByName("now_search_panel");

        search_panel.getChildByName("search_btn").hitTest = function (pt) {
            var size = this.getContentSize();
            var bb = cc.rect(-size.width, -size.height, size.width * 3, size.height * 3);
            return cc.rectContainsPoint(bb, this.convertToNodeSpace(pt));
        };

        search_panel.getChildByName("search_btn").addTouchEventListener(function(sender, eventType){
            if(eventType === ccui.Widget.TOUCH_ENDED){
                var id_str = search_panel.getChildByName("id_edit_box").getString();
                if(isNaN(Number(id_str))){
                    if(h1global.globalUIMgr.info_ui){
                        h1global.globalUIMgr.info_ui.show_by_info("输入不合法");
                    }
                    return
                }
                var id = Number(id_str);
                if(id < 1000000 || id > 9999999){
                    if(h1global.globalUIMgr.info_ui){
                        h1global.globalUIMgr.info_ui.show_by_info("玩家ID不合法");
                    }
                    return
                }
                if(self.now_options==2){
                    h1global.player().queryUserInfo(id);
                }else{
                    self.update_page_panel(self,id);
                }
                search_panel.getChildByName("id_edit_box").setString("");
            }
        });

    },

    update_user_info:function (userInfo,user_club_list) {
        if(!this.is_show || !this.club){
            return;
        }
        if(!this.club.is_owner(h1global.player().userId)){
            return;
        }
        cc.error(userInfo,user_club_list,this.club.club_id);
        var is_member = false;
        for(var k in user_club_list){
			if(user_club_list[k] == this.club.club_id){
				is_member = true;
            }
        }

        var self = this;
        var club_player_panel = this.rootUINode.getChildByName("club_player_panel");
        var player_panel = club_player_panel.getChildByName("player_panel");
        var search_panel = player_panel.getChildByName("search_panel");

        var sub_panel = search_panel.getChildByName("sub_panel");
        var info_panel = sub_panel.getChildByName("info_panel");

        var head_img_frame = info_panel.getChildByName("head_img_frame");
        cutil.loadPortraitTexture(userInfo["head_icon"], userInfo["sex"], function(img){
            if(self && self.is_show){
                if(info_panel.getChildByName("head_icon")){
                    info_panel.removeChild(info_panel.getChildByName("head_icon"))
                }
                var portrait_sprite  = new cc.Sprite(img);
                portrait_sprite.setScale(80/portrait_sprite.getContentSize().width);
                info_panel.addChild(portrait_sprite);
                portrait_sprite.setPosition(head_img_frame.getPosition());
                portrait_sprite.setName("head_icon");
                // info_panel.reorderChild(portrait_sprite, head_img_frame.getLocalZOrder()-1)
            }
        });

        info_panel.getChildByName("name_label").setString(cutil.str_sub(userInfo["name"], 7));
        info_panel.getChildByName("id_label").setString("ID:" + userInfo["userId"]);

        if (this.club.is_owner(userInfo['userId'])) {
			info_panel.getChildByName("invite_btn").setVisible(false);
			info_panel.getChildByName("delete_btn").setVisible(false);
			info_panel.setVisible(true);
        } else if (is_member) {
			info_panel.getChildByName("delete_btn").addTouchEventListener(function (sender, eventType) {
				if (eventType === ccui.Widget.TOUCH_ENDED) {
					if(h1global.curUIMgr.confirm_ui && !h1global.curUIMgr.confirm_ui.is_show && self.club.club_id) {
						h1global.curUIMgr.confirm_ui.show_by_info("确定将该成员踢出亲友圈?", function () {
							h1global.player().clubOperation(const_val.CLUB_OP_KICK_OUT, self.club.club_id, [userInfo["userId"]]);
						});
						this.setVisible(false);
					}
				}
			});
			info_panel.getChildByName("invite_btn").setVisible(false);
			info_panel.getChildByName("delete_btn").setVisible(true);
			info_panel.setVisible(true);
        } else {
			info_panel.getChildByName("invite_btn").addTouchEventListener(function (sender, eventType) {
				if (eventType === ccui.Widget.TOUCH_ENDED) {
					h1global.player().clubOperation(const_val.CLUB_OP_INVITE_IN, self.club.club_id, [userInfo["userId"]]);
					this.setVisible(false);
				}
			});
			info_panel.getChildByName("invite_btn").setVisible(true);
			info_panel.getChildByName("delete_btn").setVisible(false);
			info_panel.setVisible(true);
		}
    },

	update_page: function (page_panel, index ,total,id) {
		if (id || total==0) {
            page_panel.getChildByName("page_label").setString("1/1")
		} else {
            page_panel.getChildByName("page_label").setString(index.toString() + "/" + Math.ceil(total / this.page_show_num).toString())
		}
        if(index == 1){
            page_panel.getChildByName("left_page_btn").setEnabled(false);
        }else{
            page_panel.getChildByName("left_page_btn").setEnabled(true);
        }
        if(total==0 || index == Math.ceil(total / this.page_show_num)){
            page_panel.getChildByName("right_page_btn").setEnabled(false);
        }else{
            page_panel.getChildByName("right_page_btn").setEnabled(true);
        }
	},

    update_page_panel:function(self,id){
        if(!this.is_show){return;}
        //var self = this;

        var club_player_panel = this.rootUINode.getChildByName("club_player_panel");

        var player_panel = club_player_panel.getChildByName("player_panel");
        var member_panel = player_panel.getChildByName("member_panel");
        var base_panel = player_panel.getChildByName("base_panel");

        var page_panel = base_panel.getChildByName("page_panel");
        var info_panel = member_panel.getChildByName("info_panel");


        var now_list = null;

        switch (this.now_options){
            case 0:
                if(this.is_owner){
                    info_panel = player_panel.getChildByName("member_panel").getChildByName("info_panel");
                }else{
                    info_panel = player_panel.getChildByName("detail_panel").getChildByName("record_all_scroll");
                }
                // now_list = this.club.members;
                now_list = this.members;
                break;
            case 1:
                info_panel = player_panel.getChildByName("apply_panel").getChildByName("info_panel");
                now_list = this.club.apply_list;
                break;
            default:
                break;
        }
        if(this.now_options == 2){return ;};
        if(!now_list){now_list = []};
        if(this.now_options == 0){
            // if(this.mem_page_index >= Math.ceil(now_list.length/this.page_show_num) && this.mem_page_index > 0){
            //     this.mem_page_index -= 1;
            // }
			this.mem_page_index = this.cur_page_num;
            // var show_list = now_list.slice(this.mem_page_index * this.page_show_num, this.mem_page_index * this.page_show_num + this.page_show_num);
            var show_list = now_list;

            if(id){
                show_list = [];
                for(var i =0;i<now_list.length;i++){
                    if(now_list[i]["userId"]==id){
                        show_list.push(now_list[i]);
                    }
                }
                if(show_list.length<1){
                    if(h1global.globalUIMgr.info_ui){
                        h1global.globalUIMgr.info_ui.show_by_info("找不到该成员");
                    }
                    return;
                }
            }
			// this.cur_page_num = now_page;//当前页数
			// this.mem_total;
	        self.update_page(page_panel, this.cur_page_num, this.mem_total, id);

            page_panel.getChildByName("left_page_btn").addTouchEventListener(function (sender, eventType) {
                if(eventType === ccui.Widget.TOUCH_ENDED){
                    if(self.mem_page_index <= 0){
                        return
                    }
                    self.mem_page_index--;
					cutil.lock_ui();
					h1global.player().clubOperation(const_val.CLUB_OP_GET_MEMBERS2, self.club.club_id,[self.mem_page_index-1,self.page_show_num,"",["online","free"]]);
					// self.update_page(page_panel, self.mem_page_index + 1, now_list.length, id);
					// var show_list = now_list.slice(self.mem_page_index * self.page_show_num, self.mem_page_index * self.page_show_num + self.page_show_num);
                    // self.update_member_page(info_panel, show_list);
                    // info_panel.jumpToTop();
                }
            });

            page_panel.getChildByName("right_page_btn").addTouchEventListener(function (sender, eventType) {
                if(eventType === ccui.Widget.TOUCH_ENDED){
                    if(self.mem_page_index >= Math.ceil(self.mem_total/self.page_show_num)){
                        return
                    }
                    self.mem_page_index++;
					cutil.lock_ui();
					h1global.player().clubOperation(const_val.CLUB_OP_GET_MEMBERS2, self.club.club_id,[self.mem_page_index-1,self.page_show_num,"",["online","free"]]);
					// self.update_page(page_panel, self.mem_page_index + 1, now_list.length, id);
					// var show_list = now_list.slice(self.mem_page_index * self.page_show_num, self.mem_page_index * self.page_show_num + self.page_show_num);
                    // self.update_member_page(info_panel, show_list);
                    // info_panel.jumpToTop();
                }
            });
	        // self.update_page(page_panel, self.mem_page_index + 1, now_list.length, id);
	        this.update_member_page(info_panel, show_list);
        }else if(this.now_options==1){
            if(this.apply_page_index >= Math.ceil(now_list.length/this.page_show_num) && this.apply_page_index > 0){
                this.apply_page_index -= 1;
            }

            var show_list = now_list.slice(this.apply_page_index * this.page_show_num, this.apply_page_index * this.page_show_num + this.page_show_num);

            if(id){
                show_list = [];
                for(var i =0;i<now_list.length;i++){
                    if(now_list[i]["userId"]==id){
                        show_list.push(now_list[i]);
                    }
                }
                if(show_list.length<1){
                    if(h1global.globalUIMgr.info_ui){
                        h1global.globalUIMgr.info_ui.show_by_info("找不到该成员");
                    }
                    return;
                }
            }

            page_panel.getChildByName("left_page_btn").addTouchEventListener(function (sender, eventType) {
                if(eventType === ccui.Widget.TOUCH_ENDED){
                    if(self.apply_page_index <= 0){
                        return
                    }
                    self.apply_page_index -= 1;
	                self.update_page(page_panel, self.apply_page_index+1, now_list.length, id);
                    var show_list = now_list.slice(self.apply_page_index * self.page_show_num, self.apply_page_index * self.page_show_num + self.page_show_num);
                    self.update_apply_page(info_panel, show_list);
                    info_panel.jumpToTop();
                }
            });

            page_panel.getChildByName("right_page_btn").addTouchEventListener(function (sender, eventType) {
                if(eventType === ccui.Widget.TOUCH_ENDED){
                    if(self.apply_page_index + 1 >= Math.ceil(now_list.length/self.page_show_num)){
                        return
                    }
                    self.apply_page_index += 1;
	                self.update_page(page_panel, self.apply_page_index+1, now_list.length, id);
	                var show_list = now_list.slice(self.apply_page_index * self.page_show_num, self.apply_page_index * self.page_show_num + self.page_show_num);
                    self.update_apply_page(info_panel, show_list);
                    info_panel.jumpToTop();
                }
            });
	        self.update_page(page_panel, self.apply_page_index+1, now_list.length, id);
            this.update_apply_page(info_panel, show_list)
        }
    },
});