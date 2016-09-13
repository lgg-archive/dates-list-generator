// noprotect

window.onload = function () {
    //element in which outpu will be printed
    var el = document.getElementById('result');

    //bind controls
    bindControls(el);
};

//bin controls on page
function bindControls(el) {
    var btn_go = g('generate'),
        btn_add_ld = g('add-learning-date'),
        btn_add_hs = g('add-holidays'),
        btn_add_hd = g('add-holiday'),
        table_ld = g('days-study'),
        table_hs = g('days-holidays'),
        table_hd = g('days-holiday'),
        delimiter = g('delimiter').value,
        due = g('due-date');

    //add learning dates input
    click(btn_add_ld, function () {
        table_ld.appendChild(crs());
    });

    //add holidays input
    click(btn_add_hs, function () {
        table_hs.appendChild(crh());
    });

    //add holiday input
    click(btn_add_hd, function () {
        table_hd.appendChild(crs());
    });

    //bind generate func
    click(btn_go, function () {
        var tables = {
            table_ld: table_ld,
            table_hs: table_hs,
            table_hd: table_hd
        };
        parseDates(tables, function (dates, holidays) {
            //code
            var days = [];
            var d = new Date(dates[dates.length - 1]);
            var tillDate = parseDate(due.value);
            while (d < tillDate) {
                //increase each study date for 1 week
                for (var i = 0; i < dates.length; i++) {
                    //remember this study date
                    days[days.length] = new Date(dates[i]);

                    //increase it for 1 week
                    dates[i].setDate(dates[i].getDate() + 7);
                }

                //increase counter for 1 week
                d.setDate(d.getDate() + 7);
            }

            //get delimiter for result days
            printDays(el, removeHolidays(days, holidays), delimiter);
        });
    });
}

function parseDates(tables, callback) {
    //parse study days
    var dates = getInputDatesToArray(tables.table_ld);

    //parse single holiday
    var holidays = getInputDatesToArray(tables.table_hd);

    //parse holidays from to due
    var inputs = tables.table_hs.querySelectorAll('input[type="text"]');
    for (var i = 0; i < inputs.length; i += 2) {
        if (inputs[i].value !== "" && inputs[i + 1].value !== "") {
            holidays.push([parseDate(inputs[i].value), parseDate(inputs[i + 1].value)]);
        }
    }

    callback(dates, holidays);
}

//parse all input dates to array
function getInputDatesToArray(table) {
    var dates = [];
    var inputs = table.querySelectorAll('input[type="text"]');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value !== "") {
            dates.push(parseDate(inputs[i].value));
        }
    }
    return dates;
}

//parse date from input
function parseDate(d) {
    d = d.split('-');
    //convert from dd-mm-yy to mm-dd-yy format
    d = d[1] + '-' + d[0] + '-' + d[2];
    //parse it to date
    return new Date(d);
}

//bind click event
function click(el, callback) {
    el.addEventListener('click', function (e) {
        callback(e);
    })
}

//create element
function ce(tag) {
    return document.createElement(tag);
}

//create input type=text
function cei() {
    var el = document.createElement('input');
    el.setAttribute('type', 'text');
    el.setAttribute('placeholder', 'дд-мм-гг');
    return el;
}

//create study days row
function crs() {
    var tr = ce('tr');
    var td = ce('td');
    td.appendChild(cei());
    tr.appendChild(td);
    return tr;
}

//create holiday days row
function crh() {
    var tr = ce('tr');
    var td = ce('td');
    td.textContent = "от";
    td.appendChild(cei());
    tr.appendChild(td);
    td = ce('td');
    td.textContent = "до";
    td.appendChild(cei());
    tr.appendChild(td);
    return tr;
}

//print days on screen
function printDays(el, days, delimiter) {
    var text = "";
    days.forEach(function (day) {
        text += getPrintableDate(day, delimiter) + "\n";
    });
    setText(el, text);
}

//convert date to printable format
function getPrintableDate(date, delimiter) {
    return getNormalDate(date.getDate()) + delimiter + getNormalDate((date.getMonth() + 1)) + delimiter + getNormalYear(date.getYear())
}

//delete holidays from day array
function removeHolidays(days, holidays) {
    var newDays = [];
    var i;
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

//get 2000+ year
function getNormalYear(year) {
    return 1900 + year;
}

//get digit with leading zero
function getNormalDate(date) {
    if (date < 10) return '0' + date;
    return date;
}

//set textContent of element
function setText(el, str) {
    el.textContent = str;
}

//get element by id
function g(id) {
    return document.getElementById(id);
}