$(function () {
    let header = $('.navbar');
    $(window).scroll(function () {
        if ($(this).scrollTop() > 1 && window.location.pathname == '/') {
            header.addClass('fixed-top');
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
                $('.fixed-top').css('opacity' , '1');
            }
        } else {
            header.removeClass('fixed-top');
        }
    });
});

$('.navbar-nav>li>a').on('click', function(){
    $('.navbar-collapse').collapse('hide');
});


google.charts.load('current', {packages: ['corechart']});
// google.charts.setOnLoadCallback(drawChart);

parent_btn = $('.list-group'); 

var student_stat = {};

parent_btn.on('click', function(e) {
    $(e.target).addClass('clicked');
    ajax_request(e);
});

function ajax_request(e) {
    $.ajax({
        url: "/themes/mentalika/assets/js/data.php",
        type: 'get',
        dataType: 'json',
        data: { full_name: e.target.innerText },
        cache: false,
        beforeSend: function() {
            $('.clicked').children().removeClass('hidden_spinner');
        },
        success: function(response) {
            student_stat = parseAjaxResponse(response);
            $('.student-full_name').text("Статистика студента: " + student_stat.full_name);
            $('.student-activity_time').text("Время активности: " + secondsToHms(student_stat.activity_time));
            $('#first').text("Первая тетрадь");
            $('#second').text("Вторая тетрадь");
            $('#third').text("Третья тетрадь");
            drawChart(student_stat.first_exbook_wrong_answ, student_stat.first_exbook_right_answ, 'first_exbook-chart');
            drawTableAnswers(student_stat.first_exbook_wrong_answ, student_stat.first_exbook_right_answ, '.first_exbook-answers');
            drawChart(student_stat.second_exbook_wrong_answ, student_stat.second_exbook_right_answ, 'second_exbook-chart', '.second_exbook-answers');
            drawTableAnswers(student_stat.second_exbook_wrong_answ, student_stat.second_exbook_right_answ, '.second_exbook-answers');
            drawChart(student_stat.third_exbook_wrong_answ, student_stat.third_exbook_right_answ, 'third_exbook-chart', '.third_exbook-answers');
            drawTableAnswers(student_stat.third_exbook_wrong_answ, student_stat.third_exbook_right_answ, '.third_exbook-answers');
        },
        complete: function() {
            $('.clicked').children().addClass('hidden_spinner');
            $('.clicked').removeClass('clicked');
        }
    });
}

// $('#button').on('click', drawChart);

function parseAjaxResponse(ajax_response){
    var student_stat;
    ajax_response.forEach(element => {
        student_stat = {
            id: element[0],
            full_name: element[1] + " " + element[2],
            activity_time: element[3],
            first_exbook_wrong_answ: element[4].split("\r\n"),
            first_exbook_right_answ: element[5].split("\r\n"),
            second_exbook_wrong_answ: element[6].split("\r\n"),
            second_exbook_right_answ: element[7].split("\r\n"),
            third_exbook_wrong_answ: element[8].split("\r\n"),
            third_exbook_right_answ: element[9].split("\r\n"),
        }
    });
    return student_stat;
}

function getAnswers(answers_array) {
    var answers = [];
    answers_array.forEach(element => {
        element = element.slice(3).replace(";","").split(',');
        answers.push(element.map(string => +string));        
    });
    return answers;
}

function getAnswersNum(answers_array) {
    var num = 0;
    answers_array.forEach(element => {
        num += element.length;      
    });
    return num;
}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + "ч. " : "";
    var mDisplay = m > 0 ? m + "м. " : "";
    var sDisplay = s > 0 ? s + "с." : "";
    return hDisplay + mDisplay + sDisplay; 
}

function drawChart(wrong_answ, right_answ, elem_chart_id) { 
    wrong_answ = getAnswers(wrong_answ);
    right_answ = getAnswers(right_answ);
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Element');
    data.addColumn('number', 'Percentage');
    data.addRows([
      ['Неверные ответы', getAnswersNum(wrong_answ)],
      ['Верные ответы', getAnswersNum(right_answ)]
    ]);
    var options = {
        is3D: true,
        fontSize: '10',
        legend: {
            position: 'top',
        },
        chartArea: {
            left: 10
        },
    }
    var chart = new google.visualization.PieChart(document.getElementById(elem_chart_id));
    chart.draw(data, options);
}



function drawTableAnswers(wrong_answ, right_answ, elem_table_id){
    $(elem_table_id).empty();
    var table1 = $('<table class="table_answers_1"/>')
    var table2 = $('<table class="table_answers_2"/>')
    var table3 = $('<table class="table_answers_3"/>')
    var table4 = $('<table class="table_answers_4"/>')

    wrong_answ = getAnswers(wrong_answ);
    right_answ = getAnswers(right_answ);
    var answCount = getAnswersNum(wrong_answ) + getAnswersNum(right_answ);
    var rowsCount = 0;
    var cellsCount = 0;
    if (answCount == 120) {
        rowsCount = 5;
        cellsCount = 6;
    }


    var table_index = 1;
    for (let i = 1; i < rowsCount+1; i++) {
        var row = $('<tr/>')
        for (let j = 1; j < cellsCount+1; j++) {
            var cell = $('<td/>')
            if ($.inArray(table_index, wrong_answ[0]) != -1) {
                cell.addClass('wrong_answer')
            }
            else{
                cell.addClass('right_answer')
            }
            cell.html(table_index);
            row.append(cell);
            table_index++;
        }
        table1.append(row);
    }
    table_index = 1;
    for (let i = 1; i < rowsCount+1; i++) {
        var row = $('<tr/>')
        for (let j = 1; j < cellsCount+1; j++) {
            var cell = $('<td/>')
            if ($.inArray(table_index, wrong_answ[1]) != -1) {
                cell.addClass('wrong_answer')
            }
            else{
                cell.addClass('right_answer')
            }
            cell.html(table_index);
            row.append(cell);
            table_index++;
        }
        table2.append(row);
    }
    table_index = 1;
    for (let i = 1; i < rowsCount+1; i++) {
        var row = $('<tr/>')
        for (let j = 1; j < cellsCount+1; j++) {
            var cell = $('<td/>')
            if ($.inArray(table_index, wrong_answ[2]) != -1) {
                cell.addClass('wrong_answer')
            }
            else{
                cell.addClass('right_answer')
            }
            cell.html(table_index);
            row.append(cell);
            table_index++;
        }
        table3.append(row);
    }
    table_index = 1;
    for (let i = 1; i < rowsCount+1; i++) {
        var row = $('<tr/>')
        for (let j = 1; j < cellsCount+1; j++) {
            var cell = $('<td/>')
            if ($.inArray(table_index, wrong_answ[3]) != -1) {
                cell.addClass('wrong_answer')
            }
            else{
                cell.addClass('right_answer')
            }
            cell.html(table_index);
            row.append(cell);
            table_index++;
        }
        table4.append(row);
    }

    table1.appendTo(elem_table_id);
    table2.appendTo(elem_table_id);
    table3.appendTo(elem_table_id);
    table4.appendTo(elem_table_id);
    
}