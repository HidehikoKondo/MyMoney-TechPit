function inputCheck() {
    var result = true;

    var radio = document.getElementsByName("balance");
    var balance;
    for (let i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            balance = radio[i].value;
            break;
        }
    }
    var date = document.getElementById("date").value;
    var category = document.getElementById("category").value;
    var amount = document.getElementById("amount").value;
    var memo = document.getElementById("memo").value;

    //日付が未記入
    if (date == "") {
        result = false;
        alert("日付が未記入です");
        return;
    }
    if (category == "-選択してください-") {
        result = false;
        alert("カテゴリを選択してください");
        return;
    }
    if (amount == "" || amount == 0) {
        result = false;
        alert("金額が未記入です");
        return;
    }
    if (memo == "") {
        alert("メモが未記入です");
        return;
    }
    return result;
}
