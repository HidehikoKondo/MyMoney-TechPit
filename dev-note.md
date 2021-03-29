# 実装方法やったことメモ
### 家計簿ページのテンプレート
### index.html
オーソドックスなhtmlでページ作成し。
### css
sakura.cssを使って手軽に見た目変更<br />
レイアウト部分を軽くcssで調整<br />
https://oxal.org/projects/sakura/

## JS 入力
・フォームの入力チェック<br />
・フォームの有効無効の切り替え（収入、支出の入力切替時）<br />
・収入、支出の判定<br />
・DBに登録<br />

## JS IndexedDB
DB作成、接続<br />
・データ挿入<br />
・データ読み込み、表示<br />
・ES6のヒアドキュメント、ヒアドキュメント内での変数利用<br />
・getElementById("xxx")で要素取得<br />
・InnerHTMLで要素書き換え。


## JS グラフ
chart.jsのverticalとpieを使う<br />
https://www.chartjs.org/samples/latest/<br />

CDN<br />
https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js

棒グラフも円グラフも配列でグラフの項目名と値を渡せばＯＫ
