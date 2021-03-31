//indexedDBの名前などの設定
var dbName = "kakeiboDB";
var storeName = "kakeiboStore";
var dbVersion = 1;

//データベース接続する。データベースが未作成なら新規作成する。
var database = indexedDB.open(dbName, dbVersion);

//データベースとオブジェクトストアの作成
database.onupgradeneeded = function (event) {
    var db = event.target.result;
    db.createObjectStore(storeName, { keyPath: "id" });
    console.log("データベースを新規作成しました");
};

//データベースに接続に成功した時に発生するイベント
database.onsuccess = function (event) {
    var db = event.target.result;
    // 接続を解除する
    db.close();
    console.log("データベースに接続できました");
};
database.onerror = function (event) {
    console.log("データベースに接続できませんでした");
};

//入出金一覧の作成
function createList() {
    //データベースからデータを全件取得
    var database = indexedDB.open(dbName);
    database.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(storeName, "readonly");
        var store = transaction.objectStore(storeName);
        store.getAll().onsuccess = function (event) {
            var rows = event.target.result;
            var section = document.getElementById("list");

            //入出金一覧のテーブルを作る
            //バッククオートでヒアドキュメント
            var table = `
                <table>
                    <tr>
                        <th>日付</th>
                        <th>収支</th>
                        <th>カテゴリ</th>
                        <th>金額</th>
                        <th>メモ</th>
                        <th>削除
                    </th>
                </tr>
            `;
            //入出金のデータを表示
            rows.forEach((element) => {
                console.log(element);
                table += `
                    <tr>
                        <td>${element.date}</td>
                        <td>${element.balance}</td>
                        <td>${element.category}</td>
                        <td>${element.amount}</td>
                        <td>${element.memo}</td>
                        <td><button onClick="deleteData('${element.id}')">×</button>
                        </td>
                    </tr>
                `;
            });
            table += `</table>`;
            section.innerHTML = table;

            //円グラフの作成
            createPieChart(rows);
        };
    };
}

//フォームの内容をDBに登録する
function regist() {
    //フォームの入力チェック。falseが返却されたら登録処理を中断
    if (!inputCheck()) {
        return;
    }

    //ラジオボタンの取得
    var radio = document.getElementsByName("balance");
    var balance;
    for (let i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            balance = radio[i].value;
            break;
        }
    }

    //フォームに入力された値を取得
    var date = document.getElementById("date").value;
    var amount = document.getElementById("amount").value;
    var memo = document.getElementById("memo").value;
    var category = document.getElementById("category").value;
    //ラジオボタンが収入を選択時はカテゴリを「収入」とする
    if (balance == "収入") {
        category = "収入";
    }

    //データベースにデータを登録する
    insertData(balance, date, category, amount, memo);

    //入手金一覧を作成
    createList();

    alert("登録しました");
}

//データの挿入
function insertData(balance, date, category, amount, memo) {
    //一意のIDを現在の日時から作成
    var uniqueID = new Date().getTime().toString(16);
    console.log(date);
    //DBに登録するための連想配列のデータを作成
    var data = {
        id: uniqueID,
        balance: balance,
        date: String(date),
        category: category,
        amount: amount,
        memo: memo,
    };

    //データベースを開く
    var database = indexedDB.open(dbName, dbVersion);
    database.onupgradeneeded = function (event) {
        var db = event.target.result;
    };
    //データベースを開いたらデータの登録を実行
    database.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(storeName, "readwrite");
        transaction.oncomplete = function (event) {
            console.log("トランザクション完了");
        };
        transaction.onerror = function (event) {
            console.log("トランザクションエラー");
        };

        var store = transaction.objectStore(storeName);
        var addData = store.add(data);
        addData.onsuccess = function () {
            console.log("データが登録できました");
        };
        addData.onerror = function () {
            console.log("データが登録できませんでした");
        };

        db.close();
    };
    //データベースの開けなかった時の処理
    database.onerror = function (event) {
        console.log("データベースに接続できませんでした");
    };
}

//データの削除
function deleteData(id) {
    //データベースを開く
    var database = indexedDB.open(dbName, dbVersion);
    database.onupgradeneeded = function (event) {
        var db = event.target.result;
    };
    //開いたら削除実行
    database.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(storeName, "readwrite");
        transaction.oncomplete = function (event) {
            console.log("トランザクション完了");
        };
        transaction.onerror = function (event) {
            console.log("トランザクションエラー");
        };
        var store = transaction.objectStore(storeName);
        var deleteData = store.delete(id);
        deleteData.onsuccess = function (event) {
            console.log("削除成功");
            createList();
        };
        deleteData.onerror = function (event) {
            console.log("削除失敗");
        };
        db.close();
    };
    //データベースの開けなかった時の処理
    database.onerror = function (event) {
        console.log("データベースに接続できませんでした");
    };
}

function deleteRecode(id, db) {}
