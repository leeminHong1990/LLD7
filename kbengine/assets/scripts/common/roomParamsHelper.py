# -*- coding: utf-8 -*-
import const
import const_ddz
from llkddmj import const_llkddmj
import const_ll7
from KBEDebug import *

# ---------------------------- 开房参数检查 ----------------------------
"""
def XXX_CreateChecker(create_dict):
	return True of False
"""

def DummyChecker(*args):
	print("You need to implement a checker !!!")
	return False


def DDZ_CreateChecker(create_dict):
	room_type = create_dict['room_type']
	game_round = create_dict['game_round']
	game_mode = create_dict['game_mode']
	player_num = create_dict['player_num']
	hand_prepare = create_dict['hand_prepare']
	op_seconds = create_dict['op_seconds']
	pay_mode = create_dict['pay_mode']
	max_boom_times = create_dict['max_boom_times']
	flower_mode = create_dict['flower_mode']
	mul_mode = create_dict['mul_mode']
	dealer_joker = create_dict['dealer_joker']
	dealer_42 = create_dict['dealer_42']
	is_emotion = create_dict['is_emotion']
	if game_round not in const_ddz.GAME_ROUND \
			or game_mode not in const_ddz.GAME_MODE \
			or max_boom_times not in const_ddz.MAX_BOOM_TIMES \
			or op_seconds not in const_ddz.OP_SECONDS \
			or player_num != 3 \
			or flower_mode not in const_ddz.FLOWER_MODE \
			or mul_mode not in const_ddz.MUL_MODE \
			or dealer_joker not in const_ddz.DEALER_MODE \
			or dealer_42 not in const_ddz.DEALER_MODE \
			or is_emotion not in const_ddz.EMOTION_MODE \
			or hand_prepare not in const.PREPARE_MODE \
			or pay_mode not in const.PAY_MODE:
		return False

	if room_type == const.NORMAL_ROOM and pay_mode not in (const.NORMAL_PAY_MODE, const.AA_PAY_MODE):
		return False
	elif room_type == const.CLUB_ROOM and pay_mode not in (const.CLUB_PAY_MODE, const.AA_PAY_MODE):
		return False
	return True

def LL7_CreateChecker(create_dict):

	room_type = create_dict['room_type']
	player_num = create_dict['player_num']
	op_seconds = create_dict['op_seconds']
	game_round = create_dict['game_round']
	max_level = create_dict['max_level']
	mul_level =  create_dict['mul_level']
	bottom_level = create_dict['bottom_level']
	sig_double =  create_dict['sig_double']
	play_mode = create_dict['play_mode']
	hand_prepare = create_dict['hand_prepare']
	pay_mode = create_dict['pay_mode']
	is_emotion = create_dict['is_emotion']
	if game_round not in const_ll7.GAME_ROUND \
			or player_num not in const_ll7.PLAYER_NUM \
			or op_seconds not in const_ll7.DISCARD_SECONDS \
			or max_level not in const_ll7.MAX_LEVEL \
			or mul_level not in const_ll7.MUL_LEVEL \
			or bottom_level not in const_ll7.BOTTOM_LEVEL \
			or sig_double not in const_ll7.SIG_DOUBLE \
			or play_mode not in const_ll7.PLAY_MODE \
			or is_emotion not in const_ll7.EMOTION_MODE \
			or hand_prepare not in const.PREPARE_MODE:
		return False

	if room_type == const.NORMAL_ROOM and pay_mode not in (const.NORMAL_PAY_MODE, const.AA_PAY_MODE):
		return False
	elif room_type == const.CLUB_ROOM and pay_mode not in (const.CLUB_PAY_MODE, const.AA_PAY_MODE):
		return False
	return True

def LLKDDMJ_CreateChecker(create_dict):
	room_type = create_dict['room_type']
	add_dealer = create_dict['add_dealer']
	game_mode = create_dict['game_mode']
	game_round = create_dict['game_round']
	hand_prepare = create_dict['hand_prepare']
	king_mode = create_dict['king_mode']
	pay_mode = create_dict['pay_mode']
	reward = create_dict['reward']
	base_score = create_dict['base_score']
	ekong_is_dwin = create_dict['ekong_is_dwin']
	special_mul = create_dict['special_mul']
	seven_pair = create_dict['seven_pair']
	mouse_general = create_dict['mouse_general']
	mouse_general_onetwo = create_dict['mouse_general_onetwo']
	ting_mouse = create_dict['ting_mouse']
	bao_kong = create_dict['bao_kong']
	repeat_kong	= create_dict['repeat_kong']

	if add_dealer not in const_llkddmj.ADD_DEALER \
			or game_mode not in const_llkddmj.GAME_MODE \
			or game_round not in const_llkddmj.GAME_ROUND \
			or hand_prepare not in const.PREPARE_MODE \
			or king_mode not in const_llkddmj.KING_MODE \
			or pay_mode not in const.PAY_MODE \
			or base_score not in const_llkddmj.BASE_SCORE_MODE \
			or special_mul not in const_llkddmj.SPECIAL_MUL_MODE \
			or ekong_is_dwin not in const_llkddmj.CURRENCY_MODE \
			or seven_pair not in const_llkddmj.CURRENCY_MODE \
			or mouse_general not in const_llkddmj.CURRENCY_MODE \
			or mouse_general_onetwo not in const_llkddmj.CURRENCY_MODE \
			or ting_mouse not in const_llkddmj.CURRENCY_MODE \
			or bao_kong not in const_llkddmj.CURRENCY_MODE \
			or repeat_kong not in const_llkddmj.CURRENCY_MODE \
			or reward not in const_llkddmj.REWARD_MODE:
		return False

	if room_type == const.NORMAL_ROOM and pay_mode not in (const.NORMAL_PAY_MODE, const.AA_PAY_MODE):
		return False
	elif room_type == const.CLUB_ROOM and pay_mode not in (const.CLUB_PAY_MODE, const.AA_PAY_MODE):
		return False
	return True

def roomParamsChecker(game_type, create_dict):
	name = const.GameType2GameName.get(game_type, None)
	if name is None:
		return False
	else:
		return globals().get("{}_CreateChecker".format(name), DummyChecker)(create_dict)

# ------------------------------------------------------------------------


# ----------------------------- 开房参数获取 ------------------------------
"""
def XXX_roomParams(create_dict):
	return a dict
"""


def DDZ_roomParams(create_dict):
	return {
		'game_round'	: create_dict['game_round'],
		'game_mode'		: create_dict['game_mode'],
		'player_num'	: 3,
		'hand_prepare'	: create_dict['hand_prepare'],
		'pay_mode'		: create_dict['pay_mode'],
		'max_boom_times': create_dict['max_boom_times'],
		'op_seconds'	: create_dict['op_seconds'],
		'game_max_lose' : 999999,
		'room_type'		: create_dict['room_type'],
		'flower_mode'	: 0,
		'mul_mode'		: create_dict['mul_mode'],
		'dealer_joker'	: create_dict['dealer_joker'],
		'dealer_42'		: create_dict['dealer_42'],
		'is_emotion'	: create_dict['is_emotion'],
	}

def LLKDDMJ_roomParams(create_dict):
	return {
		'king_num' 			: 0 if create_dict['game_mode'] <= 1 else (1 if create_dict['king_mode'] <= 2 else 2),
		'player_num'		: 4,
		'lucky_num'			: 0,
		'game_mode'			: create_dict['game_mode'],
		'king_mode'			: create_dict['king_mode'],
		'reward'			: create_dict['reward'],
		'base_score'		: create_dict['base_score'],
		'add_dealer'		: create_dict['add_dealer'],
		'ekong_is_dwin'		: create_dict['ekong_is_dwin'],
		'special_mul'		: create_dict['special_mul'],
		'seven_pair'		: create_dict['seven_pair'],
		'mouse_general'		: create_dict['mouse_general'],
		'mouse_general_onetwo'		: create_dict['mouse_general_onetwo'],
		'ting_mouse'		: create_dict['ting_mouse'],
		'bao_kong'			: create_dict['bao_kong'],
		'repeat_kong'		: create_dict['repeat_kong'],
		'game_round'		: create_dict['game_round'],
		'hand_prepare'		: create_dict['hand_prepare'],
		'pay_mode'			: create_dict['pay_mode'],
		'room_type'			: create_dict['room_type'],
	}

def LL7_roomParams(create_dict):
	return {
		'player_num'		: create_dict['player_num'],
		'op_seconds'		: 0,
		'game_round'		: create_dict['game_round'],
		'max_level'			: create_dict['max_level'],
		'mul_level'			: create_dict['mul_level'],
		'bottom_level'		: create_dict['bottom_level'],
		'sig_double'		: create_dict['sig_double'],
		'play_mode'			: create_dict['play_mode'],
		'hand_prepare'		: create_dict['hand_prepare'],
		'pay_mode'			: create_dict['pay_mode'],
		'room_type'			: create_dict['room_type'],
		'is_emotion'		: create_dict['is_emotion'],
	}



def roomParamsGetter(game_type, create_dict):
	name = const.GameType2GameName.get(game_type, None)
	if name is None:
		return None
	else:
		return globals()["{}_roomParams".format(name)](create_dict)

# ------------------------------------------------------------------------


def clubDefault_roomParams():
	ll7_dict = {
		'player_num'		: 5,
		'op_seconds'		: 0,
		'game_round'		: 6,
		'max_level'			: 3,
		'mul_level'			: 1,
		'bottom_level'		: 0,
		'sig_double'		: 1,
		'play_mode'			: 1,
		'hand_prepare'		: 0,
		'is_emotion'		: 0,
		'pay_mode'			: const.CLUB_PAY_MODE,
		'room_type'			: const.CLUB_ROOM,
	}
	return const.LvLiang7, ll7_dict


def updateRoomParamsGetter(game_type, roomParams):
	name = const.GameType2GameName.get(game_type, None)
	if name is None:
		return game_type , roomParams
	else:
		funcName = "{}_updateRoomParams".format(name)
		if  funcName in globals():
			func = globals()[funcName]
			if callable(func):
				return func(game_type , roomParams)

	return game_type , roomParams


def LL7_updateRoomParams(game_type, params):
	if "is_emotion" not in params:
		params.update({
			"is_emotion": 0,
		})
	return game_type, params

def DDZ_updateRoomParams(game_type, params):
	if "is_emotion" not in params:
		params.update({
			"is_emotion": 0,
		})
	return game_type, params
