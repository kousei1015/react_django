# 名前
Map Collection


# 説明
このアプリはユーザーが名所だと思った場所を紹介するためのアプリです。

#デモ

後で貼ります

# 機能一覧
simplejwt djoserというライブラリを使ったjwt認証機能

ユーザー情報編集機能

投稿表示機能

新規投稿機能

自身の投稿の編集・削除機能

コメント機能

公開後もアップデートを行い、機能を追加する予定です

#URL
後で貼ります


# 主に使用した技術一覧
Node.js 16

React.js 18.1.0

Python 3.7

Django 3.0.7

django-rest-framework 3.10

MySQL 5.7.38

Nginx

Gunicorn

Docker/Docker-compose

# テスト
バックエンド:unittest

フロントエンド:react-testing-library + Jest


# ER図

![](er-picture.drawio.svg)

# AWS

概要だけ説明すると、バックエンドはECS(Fargate)で、フロントエンドの方はS3とCloudFrontで、データベースはRDSを使って構成しました

図は後で貼ります
