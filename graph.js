//棒グラフの表示
function displayBarChart(){
    var ctx = document.getElementById("barChart");
    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月'],
            datasets: [
                {
                    label: '収入',
                    data: [300000, 350000, 400000, 450000, 250000, 270000, 700000, 350000, 400000, 450000, 250000, 270000, 700000],
                    backgroundColor: "#6FCF97"
                }, {
                    label: '支出',
                    data: [410000, 200000, 350000, 400000, 250000, 120000, 580000,410000, 200000, 350000, 400000, 250000],
                    backgroundColor: "#EB5757"
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: '収支の比較'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMax: 100,
                        suggestedMin: 0,
                        stepSize: 100000,
                        callback: function (value, index, values) {
                            return value + '円'
                        }
                    }
                }]
            },
        }
    });
}

//円グラフの表示
function displayPieChart(){
            var ctx = document.getElementById("pieChart");
        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ["家賃", "光熱費", "交際費", "その他"],
                datasets: [{
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
                    data: [20, 30, 40, 10]
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'カテゴリごとの収支割合'
                }
            }
        });
}