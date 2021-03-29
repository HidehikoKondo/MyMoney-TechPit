const dbName = 'kakeiboDB';
const dbVersion = 1;
const storeName  = 'kakeiboStore';


function openDB(){

    //データベースに名前を付けて作成する
    var dbName = 'kakeiboDB';
    var openDB  = indexedDB.open(dbName, dbVersion);

    //↑で決めた名前のデータベースに接続する。作成済みのデータベースがなければ新規作成する
    openDB.onupgradeneeded = function(event){
        //onupgradeneededは、DBの新規作成時とバージョン更新時に発生するイベントです。
        console.log('データベースを新規作成、またはバージョン更新しました');
        
        //ストア作成
        var db = event.target.result;
        db.createObjectStore(storeName, {keyPath : 'id'});

    }
    openDB.onsuccess = function(event){
        //onupgradeneededは接続に成功した時に発生するイベントです。
        console.log('データベースに接続できました');
        var db = event.target.result;
        // 接続を解除する
        db.close();
    }
    openDB.onerror = function(event){
        console.log('データベースに接続できませんでした');
    }
}

function deleteDB(){
    var deleteDB = indexedDB.deleteDatabase(dbName);

    deleteDB.onsuccess = function(event){
        console.log('データベースを削除しました');
        // 存在しないDB名を指定してもこっちが実行される
    }

    deleteDB.onerror = function(){
        console.log('データベースを削除できませんでした');
    }
}

//データの挿入
function insertData(){
    var uniqueID = new Date().getTime().toString(16);
    var data = {id : uniqueID, name : 'テスト4', test:"test"};

    var openDB = indexedDB.open(dbName);

    openDB.onsuccess = function(event){
        var db = event.target.result;
        var trans = db.transaction(storeName, 'readwrite');
        var store = trans.objectStore(storeName);
        var addData = store.add(data);

        addData.onsuccess = function(){
            console.log('データが挿入できました');
        }
        addData.onerror = function(){
                        console.log('データが挿入できませんでした');
        }
        trans.oncomplete = function(){
            // トランザクション完了時(putReq.onsuccessの後)に実行
            console.log('トランザクション完了しました');
        }
    }
}

//データの取得
function selectData(){
    var keyValue = 'A5'
    var openDB = indexedDB.open(dbName);

    //全件取得
    openDB.onsuccess = function(event){
        var db = event.target.result;
        var trans = db.transaction(storeName, 'readonly');
        var store = trans.objectStore(storeName);
        store.getAll().onsuccess = function(event) {
            const rows = event.target.result;
            console.log(rows);
        }
    }
}