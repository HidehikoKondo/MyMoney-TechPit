const dbName = "kakeiboDB";
const dbVersion = 1;
const storeName = "kakeiboStore";
var db;

function openDB() {
    //データベースに名前を付けて作成する
    var openDB = indexedDB.open(dbName, dbVersion);

    //↑で決めた名前のデータベースに接続する。作成済みのデータベースがなければ新規作成する
    openDB.onupgradeneeded = function (event) {
        //onupgradeneededは、DBの新規作成時とバージョン更新時に発生するイベントです。
        console.log("データベースを新規作成、またはバージョン更新しました");

        //ストア作成
        var db = event.target.result;
        db.createObjectStore(storeName, { keyPath: "id" });
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
}

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

//データの挿入
function insertData() {
    var uniqueID = new Date().getTime().toString(16);
    var date = new Date();
    var toDay =
        date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    var data = {
        id: uniqueID,
        balance: "income",
        date: toDay,
        category: "光熱費",
        amount: 1000,
        memo: "メモ",
    };

    var openDB = indexedDB.open(dbName, dbVersion);
    openDB.onsuccess = function (event) {
        var db = event.target.result;
        var trans = db.transaction(storeName, "readwrite");
        var store = trans.objectStore(storeName);
        var addData = store.add(data);

        addData.onsuccess = function () {
            console.log("データが挿入できました");
        };
        addData.onerror = function () {
            console.log("データが挿入できませんでした");
        };
        trans.oncomplete = function () {
            // トランザクション完了時(putReq.onsuccessの後)に実行
            console.log("トランザクション完了しました");
        };
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
                        <th>摘要</th>
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
                        <td><button onClick="deleteData('${element.id}')">×</button></td>
                    </tr>
                `;
            });

            table += `</table>`;
            section.innerHTML = table;
        };
    };
}

function deleteData(id) {
    //データベースを開く
    var openDB = indexedDB.open(dbName, dbVersion);
    openDB.onupgradeneeded = function (event) {
        var db = event.target.result;
        db.createObjectStore(storeName, { keyPath: "id" });
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
