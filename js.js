// noprotect
//выводит столбец дат для
//уроков для планирования МРКО

window.onload = function () {
    var el = document.getElementById('wrap');

    //даты первых уроков
    //в формате месяц-день-год
    var dates = [
        '09-02-16',
        '09-07-16'
    ];
    //неучебные дни
    //в формате месяц-день-год
    //в формате: либо просто дата
    //либо массив от и до
    //
    var holidays = [
        [
            //от
            '10-03-16',
            //до
            '10-09-16',
        ],
        [
            //от
            '11-14-16',
            //до
            '11-20-16',
        ],
        [
            //от
            '12-31-16',
            //до
            '01-09-17',
        ],
        [
            //от
            '02-20-17',
            //до
            '02-26-17',
        ],
        [
            //от
            '04-10-17',
            //до
            '04-16-17',
        ],
        '11-04-16',
        '03-08-17', //просто дата
        '05-01-17',
        '05-08-17',
        '05-09-17'
    ];

    //преобразуем всё в даты
    var i = 0;
    for (i = 0; i < dates.length; i++) {
        dates[i] = new Date(dates[i]);
    }
    for (i = 0; i < holidays.length; i++) {
        if (Array.isArray(holidays[i])) {
            for (var j = 0; j < holidays[i].length; j++) {
                holidays[i][j] = new Date(holidays[i][j]);
            }
        } else {
            holidays[i] = new Date(holidays[i]);
        }
    }
    i = 0;


    //code
    var days = [];
    var d = new Date(dates[dates.length - 1]);
    while (d < new Date('06-01-17')) {
        for (i = 0; i < dates.length; i++) {
            //var currentDay = getPrintableDate(dates[i]);
            days[days.length] = new Date(dates[i]);
            //display(currentDay);

            dates[i].setDate(dates[i].getDate() + 7);
        }

        d.setDate(d.getDate() + 7);
    }

    printDays(removeHolidays(days));
    //console.log(days);
    //printDays(days);

    function printDays(days) {
        days.forEach(function (day) {
            display(getPrintableDate(day));
        });
    }

    function getPrintableDate(date) {
        return getNormalDate(date.getDate()) + '.' + getNormalDate((date.getMonth() + 1)) + '.' + getNormalYear(date.getYear())
    }

    function removeHolidays(days) {
        var newDays = [];
        days.forEach(function (day) {
            //проверяем является ли дата каникулами
            var isHoliday = false;

            for (i = 0; i < holidays.length; i++) {
                //если это одиночная дата
                if (holidays[i] instanceof Date) {
                    if (day.getTime() === holidays[i].getTime()) {
                        isHoliday = true;
                        break;
                    }
                } else {
                    //это период дат от и до
                    if (day >= holidays[i][0] && day <= holidays[i][1]) {
                        isHoliday = true;
                        break;
                    }
                }
            }

            //если это не каникулы
            if (!isHoliday) {
                //добавляем в новый массив
                newDays.push(new Date(day));
            }
        });

        return newDays;
    }

    function getNormalYear(year) {
        return 1900 + year;
    }

    function getNormalDate(date) {
        if (date < 10) return '0' + date;
        return date;
    }

    function display(str) {
        var div = document.createElement('div');
        div.textContent = str;
        el.appendChild(div);
        //console.log(str);
    }
};