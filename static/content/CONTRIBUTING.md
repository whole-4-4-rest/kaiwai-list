## 曲を追加する方法

1. [/songs](https://github.com/whole-4-4-rest/kaiwai-list/tree/main/static/content/songs)に移動します。
2. 右上の「Add file」ボタンを押します。
3. 「Create new file」を押します。
4. 「Name your file...」欄に「ローマ字での曲の名前.md」と入力します。
5. 以下のフォーマットをコピーし編集します。
```markdown
---
# すべて「"」で囲ってください。
title: "タイトル" # 曲のタイトル。正式名称が好ましいです。
date: "2000-01-01" # 曲が公開された日。2回以上公開されている場合は最初に公開された日。
kaiwai_ness: "3" # 界隈度。3: 4人によって作られた音楽。2: 明らかな模倣。1: エッセンスを感じられるもの。
composer: "作曲者" # 作曲者。/composersに配置されているファイル名を記載。
series: "〇〇アルバム等" # シリーズ。ない場合は削除してください。
summary: "音楽。" # 一文での概要
original_urls: ["URL1"] # オリジナルURL。複数ある場合は,でつなげる。
copied_urls: ["URL1", "URL2"] # 転載動画のURL。複数ある場合は,でつなげる。
---

<!-- 自由に説明を書いてください。 -->
```