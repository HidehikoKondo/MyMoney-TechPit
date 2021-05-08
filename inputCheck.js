//ラジオボタンによりカテゴリを有効無効切り替え
function disableSelectBox(disabled) {
    document.getElementById("category").disabled = disabled;
}



//収支入力フォームの内容チェック
function inputCheck() {
    //チェック結果 true:入力チェックOK　false:未記入アリ
    var result = true;

    //選択した収支のラジオボタンの取得
    var radio = document.getElementsByName("balance");
    var balance;
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked == true) {
            balance = radio[i].value;
            break;
        }
    }

    //日付、カテゴリ、金額、メモの取得
    var date = document.getElementById("date").value;
    var category = document.getElementById("category").value;
    var amount = document.getElementById("amount").value;
    var memo = document.getElementById("memo").value;

    //入力チェック。未記入があればresultをfalseにする
    if (date == "") {
        result = false;
        alert("日付が未記入です");
    } else if (category == "-選択してください-" && balance == `支出`) {
        result = false;
        alert("カテゴリを選択してください");
    } else if (amount == "" || amount == 0) {
        result = false;
        alert("金額が未記入です");
    } else if (memo == "") {
        result = false;
        alert("メモが未記入です");
    }
    return result;
}
