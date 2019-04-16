<h1 align="center">feixia Engine</h1>

<div align="center">
An chess and card game framework.
</div>

## Env and dependencies

- client-engine:Cocos2d-x-3.16
- client-ui-tools:Cocos Studio v3.10
- server-engine:KBEngine v1.17


- Client Home Page: https://www.cocos.com/
- Server Home Page: https://www.comblockengine.com/
- Server source github Release: https://github.com/kbengine/kbengine/releases
- Server FAQ: https://bbs.comblockengine.com/

## Run
- step 1: download Engine: https://pan.baidu.com/s/1SKrdwEhsIEQX2cvek4wL4A   extrace code：y3nf
- step 2: unzip cocos_frameworks_v3.16.zip in cocos
- step 3: unzip windows:kbe_windows_1.17.zip or linux:kbe_tencent_ubuntu_1.17.zip in kbengine
- step 4: download nginx and config nginx like this.
<div>
+server {
+	listen       8090;
+	server_name  YingTanMJ;
+	location / {
+		root   F:/YingTanMJ/cocos;
+		index  index.html index.htm;
+		autoindex on;
+		add_header Cache-Control no-store;
+		expires off;
+	}
+	
+	#location  /frameworks {
+	#   root   D:/Engine/;
+	#   add_header Cache-Control no-store;
+	#   expires off;
+	#}  
+}
</div>
- step 5: config cocos/src/switch.js switches.kbeServerIP to server ip and switches.kbeServerLoginPort to server port (it always 20013)
- step 6: run kbengine/assets/start_server.bat or kbengine/assets/start_server.sh
- step 7: use explorer Access to the client address to login the service.
