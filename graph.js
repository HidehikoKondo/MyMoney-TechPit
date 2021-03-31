//円グラフの表示
function displayPieChart(rows) {
    //円グラフ用データ作成
    var pieChartData = {};
    console.log("pieChartData");
    console.log(pieChartData["a"]);

    //一覧からデータをカテゴリ毎に取り出して集計
    var amount = 0;
    var category = "";
    rows.forEach(function (element) {
        category = element.category;
        if (category != "収入") {
            console.log(pieChartData[category]);
            if (pieChartData[category] === undefined) {
                pieChartData[category] = Number(element.amount);
            } else {
                pieChartData[category] += Number(element.amount);
            }
        }
    });
    console.log(pieChartData);

    //円グラフ用にカテゴリと合計金額を配列に入れる
    var keyArray = [];
    var valueArray = [];
    for (key in pieChartData) {
        keyArray.push(key);
        valueArray.push(pieChartData[key]);
    }
    console.log(keyArray);
    console.log(valueArray);

    var ctx = document.getElementById("pieChart");
    var myPieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: keyArray,
            datasets: [
                {
                    backgroundColor: [
                        "#EB5757",
                        "#6FCF97",
                        "#56CCF2",
                        "#F2994A",
                        "#F2C94C",
                        "#2F80ED",
                        "#9B51E0",
                        "#BB6BD9",
                    ],
                    data: valueArray,
                },
            ],
        },
        options: {
            title: {
                display: true,
                text: "カテゴリ毎の支出割合",
            },
        },
    });
}
