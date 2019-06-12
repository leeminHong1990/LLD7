# -*- coding: utf-8 -*-
"""
The Answer to Life, the Universe and Everything is 42
In Python, ord('*') is 42
"""

# GameWorld Entity
GW = None

# ClubStub Entity
ClubStub = None

# Lottery Entity
Lottery = None

whitelists = []


def load_whitelists():
	try:
		import KBEngine
		import KBEDebug
		p = './scripts/data/whitelists.txt'
		if KBEngine.hasRes(p):
			fs = KBEngine.open(p, 'r')
			lines = fs.readlines()
			for line in lines:
				if line.strip() != '':
					whitelists.append(int(line.strip()))
		KBEDebug.DEBUG_MSG("whitelists: {}".format(whitelists))
	except:
		pass


load_whitelists()
