const dbName = "kakeiboDB";
const dbVersion = 1;
const storeName = "kakeiboStore";
var db;

//データベースに名前を付けて作成する
var openDB = indexedDB.open(dbName, dbVersion);

//↑で決めた名前のデータベースに接続する。作成済みのデータベースがなければ新規作成する
openDB.onupgradeneeded = function (event) {
    //onupgradeneededは、DBの新規作成時とバージョン更新時に発生するイベントです。
    //ストア作成
    var db = event.target.result;
    db.createObjectStore(storeName, { keyPath: "id" });

    console.log("データベースを新規作成、またはバージョン更新しました");
};
openDB.onsuccess = function (event) {
    //onupgradeneededは接続に成功した時に発生するイベントです。
    console.log("データベースに接続できました");
    var db = event.target.result;
    // 接続を解除する
    db.close();
};
openDB.onerror = function (event) {
    console.log("データベースに接続できませんでした");
};

function deleteDB() {
    var deleteDB = indexedDB.deleteDatabase(dbName);

    deleteDB.onsuccess = function (event) {
        console.log("データベースを削除しました");
        // 存在しないDB名を指定してもこっちが実行される
    };

    deleteDB.onerror = function () {
        console.log("データベースを削除できませんでした");
    };
}

//データの取得
function selectData() {
    var openDB = indexedDB.open(dbName);
    var data = [];
    //全件取得
    openDB.onsuccess = function (event) {
        var db = event.target.result;
        var trans = db.transaction(storeName, "readonly");
        var store = trans.objectStore(storeName);
        store.getAll().onsuccess = function (event) {
            const rows = event.target.result;
            data = data.concat(rows);
        };
    };
    console.log(data);
    return;
}

function createList() {
    var openDB = indexedDB.open(dbName);
    //全件取得

    openDB.onsuccess = function (event) {
        var db = event.target.result;
        var trans = db.transaction(storeName, "readonly");
        var store = trans.objectStore(storeName);
        store.getAll().onsuccess = function (event) {
            const rows = event.target.result;
            console.log(rows);
            console.log(rows[0]);

            var section = document.getElementById("list");
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

            //円グラフ作成
            displayPieChart(rows);
        };
    };
}

//フォームの内容をDBに登録する
function regist() {
    //入力チェック。falseが返却されたら登録処理を中断
    if (!inputCheck()) {
        return;
    }

    //ラジオボタンの取得
    var radio = document.getElementsByName("balance");
    var balance;
    //ここでfor文の練習
    for (let i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            balance = radio[i].value;
            break;
        }
    }

    var date = document.getElementById("date").value;
    var amount = document.getElementById("amount").value;
    var memo = document.getElementById("memo").value;
    var category = document.getElementById("category").value;
    //ラジオボタンが収入を選択時はカテゴリを「収入」とする
    if (balance == "収入") {
        category = "収入";
    }

    console.log("category:" + category);
    insertData(balance, date, category, amount, memo);
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
    var openDB = indexedDB.open(dbName, dbVersion);
    openDB.onupgradeneeded = function (event) {
        var db = event.target.result;
        console.log("zzz");
    };
    //開いたらデータの登録を実行
    openDB.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(storeName, "readwrite");
        transaction.oncomplete = function (event) {
            console.log("transaction complete");
        };
        transaction.onerror = function (event) {
            console.log("transaction error");
        };

        var store = transaction.objectStore(storeName);
        var addData = store.add(data);

        addData.onsuccess = function () {
            console.log("データが挿入できました");
        };
        addData.onerror = function () {
            console.log("データが挿入できませんでした");
        };

        db.close();
    };
    //データベースの開けなかった時の処理
    openDB.onerror = function (event) {
        console.log("データベースに接続できませんでした");
    };
}

function deleteData(id) {
    //データベースを開く
    var openDB = indexedDB.open(dbName, dbVersion);
    openDB.onupgradeneeded = function (event) {
        var db = event.target.result;
    };
    //開いたら削除実行
    openDB.onsuccess = function (event) {
        var db = event.target.result;
        deleteRecode(id, db);
        db.close();
    };
    //データベースの開けなかった時の処理
    openDB.onerror = function (event) {
        console.log("データベースに接続できませんでした");
    };
}

function deleteRecode(id, db) {
    var transaction = db.transaction(storeName, "readwrite");
    transaction.oncomplete = function (event) {
        console.log("transaction complete");
    };
    transaction.onerror = function (event) {
        console.log("transaction error");
    };

    // create an object store on the transaction
    var objectStore = transaction.objectStore(storeName);

    // Make a request to delete the specified record out of the object store
    var objectStoreRequest = objectStore.delete(id);

    objectStoreRequest.onsuccess = function (event) {
        console.log("削除成功");
        createList();
    };
    objectStoreRequest.onerror = function (event) {
        console.log("削除失敗");
    };
}
