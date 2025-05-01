# DIFY_BFF
公開したDifyのワークフローにてSSO連携を可能にするためのBFF(Backend For Frontend)です。
本BFFをApacheに組み込み、mod_auth_openidcなどでSSO連携して利用します。  
Difyの画面は利用できません。独自にチャット画面を作成する必要があります。また、DifyのAPIをblockingで呼び出しているため、長文を出力する場合は待ちが発生します。

## ライセンス
本ソフトウェアはライセンスを定めておりません。許可なく利用、修正、複製、配布することを禁止します。

# 使い方
## .env
.envファイルを作成してください

| 項目 | 値 |
|:--|:--|
|LOG_LEVEL|ログの出力レベル|
|DIFY_BFF_PORT|公開ポート番号|
|DIFY_API_ENDPOINT|DifyのAPIエンドポイント /v1まで |
|DIFY_API_KEY|ワークフローのAPIキー|
|USER_KEY|SSO連携した認証情報が埋め込まれるヘッダー|

例）
```
LOG_LEVEL=debug
DIFY_BFF_PORT=3000
DIFY_API_ENDPOINT=http://localhost/v1
DIFY_API_KEY={YOUR_DIFY_API_KEY}
USER_KEY=REMOTE_USER
```

複数のワークフローを利用したい場合、カスタマイズしてください

## 起動
```
# node --env-file=.env index.js
```