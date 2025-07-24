# 追加する方法

## 曲を追加する方法

1. [/songs](https://github.com/whole-4-4-rest/kaiwai-list/tree/main/static/content/songs)に移動します。
2. 右上の「Add file」ボタンを押します。
3. 「Create new file」を押します。
4. 「Fork this repository」を押します。
5. 「Name your file...」欄に「ローマ字での曲の名前.md」と入力します。
6. 以下のフォーマットをコピーし編集します。（template.mdにもあります）
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
7. 「Commit changes...」を押します。
8. 「Propose changes」を押します。
9. 新たに出た画面で「Create pull request」を押します。
10. 新たに出た画面で再度「Create pull request」を押します。
11. 承認されるまでお待ち下さい。

## 作曲者を追加する方法

1. [/songs](https://github.com/whole-4-4-rest/kaiwai-list/tree/main/static/content/composers)に移動します。
2. 右上の「Add file」ボタンを押します。
3. 「Create new file」を押します。
4. 「Fork this repository」を押します。
5. 「Name your file...」欄に「ローマ字での作曲者の名前.md」と入力します。
6. 以下のフォーマットをコピーし編集します。（template.mdにもあります）
```markdown
---
# すべて「"」で囲ってください。「”」ではありません。
title: "作曲者名" # 作曲者名。正式名称が好ましいです。
activity_start_date: "2000-01" # 作曲者が活動を始めた日。わからない場合は月。
activity_end_date: "2010-01-01" # 作曲者が活動を終えた日。終えていない場合はこの行ごと消してください。
summary: "作曲者。" # 一文での概要
kaiwai_ness: "3" # 界隈度。3: 4人によって作られた音楽。2: 明らかな模倣。1: エッセンスを感じられるもの。
accounts: ["URL1"] # アカウントのURL。複数ある場合は,でつなげる。
same_person: ["sakkyokusha1"] # 同一人物ではないかとされている人物。/composersに配置されているファイル名を記載。複数ある場合は,でつなげる。いない場合はこの行ごと消してください。
alias: ["別名義1", "別名義2"] # 別名義。複数ある場合は,でつなげる。いない場合はこの行ごと消してください。
---

<!-- 自由に説明を書いてください。 -->
```
7. 「Commit changes...」を押します。
8. 「Propose changes」を押します。
9. 新たに出た画面で「Create pull request」を押します。
10. 新たに出た画面で再度「Create pull request」を押します。
11. 承認されるまでお待ち下さい。

# 編集する方法

## 曲を編集する方法

1. [/songs](https://github.com/whole-4-4-rest/kaiwai-list/tree/main/static/content/songs)に移動します。
2. 編集したいファイルに移動します。
3. 右上のペンアイコンをクリックします。
4. 「Fork this repository」を押します。
5. 編集します。
6. 「Commit changes...」を押します。
7. 「Propose changes」を押します。
8. 新たに出た画面で「Create pull request」を押します。
9. 新たに出た画面で再度「Create pull request」を押します。
10. 承認されるまでお待ち下さい。

## 作曲者を編集する方法

1. [/songs](https://github.com/whole-4-4-rest/kaiwai-list/tree/main/static/content/composers)に移動します。
2. 編集したいファイルに移動します。
3. 右上のペンアイコンをクリックします。
4. 「Fork this repository」を押します。
5. 編集します。
6. 「Commit changes...」を押します。
7. 「Propose changes」を押します。
8. 新たに出た画面で「Create pull request」を押します。
9. 新たに出た画面で再度「Create pull request」を押します。
10. 承認されるまでお待ち下さい。