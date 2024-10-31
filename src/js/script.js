const DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const TIME_REGEX = /^\d+:[0-5]\d:[0-5]\d$/;
let timerElement = document.getElementById("timer");

function loadPage() {
    let params = new URLSearchParams(window.location.search);
    
    let dateNow = new Date();
    let ms = 0;

    if (params.has("date") && DATE_REGEX.test(params.get("date"))) {
        let date = new Date(params.get("date"));
        let dateDiff = date - dateNow;
        ms = dateDiff;

    } else if (params.has("time") && TIME_REGEX.test(params.get("time"))) {
        let time = params.get("time");
        let dateDiff = addTime(time) - dateNow;
        ms = dateDiff;
    }

    if (params.has("date") || params.has("time")) {
        params.has("foreground") ? changeColor(`#${params.get("foreground")}`) : changeColor("#ffffff");
        if (params.has("border")) { changeBorder(`#${params.get("border")}`) }
        
        let timerMethodNormal = document.getElementById("timer");
        let timerMethodFlip = document.getElementById("flipdown");
        if (params.get("timer") == "normal") {
            timerMethodNormal.style.display = "block";
            timerMethodFlip.style.display = "none";
        } else {
            timerMethodNormal.style.display = "none";
            timerMethodFlip.style.display = "block";
        }

        startCountdown(ms);
    }
    else {
        var flipDownDemo = new FlipDown(0).start();
        document.getElementById("dateSet").setAttribute("min", getCurrentTime());
        document.getElementById("dateSet").value = getCurrentTime();
        document.getElementById("settings").style.display = "block";
    }
}

loadPage();


function startCountdown(ms) {
    const endTime = Math.floor(Date.now() / 1000) + Math.floor(ms / 1000) + 1;
    var flipDown = new FlipDown(endTime)
        .start()
        .ifEnded(() => {
            console.log("end");
        });

    const intervalId = setInterval(() => {
        if (ms <= 0) {
            clearInterval(intervalId);
            document.getElementById("timer").innerHTML = "00:00:00";
        } else {
            document.getElementById("timer").innerHTML = convertMsToTime(ms);  // Frissített idő megjelenítése
            ms -= 1000;  // Csökkentjük az eltérést 1 másodperccel
        }
    }, 1000);  // Frissítés másodpercenként
}

function addTime(timeString) {
    let dateTemp = new Date();
    const units = timeString.split(":");

    dateTemp.setHours(dateTemp.getHours() + parseInt(units[0]));
    dateTemp.setMinutes(dateTemp.getMinutes() + parseInt(units[1]));
    dateTemp.setSeconds(dateTemp.getSeconds() + parseInt(units[2]));

    return dateTemp;
}


function convertMsToTime(ms) {
    let hours = Math.floor(ms / (60*60*1000));
    const hoursms = ms % (60*60*1000);
    let minutes = Math.floor(hoursms / (60*1000));
    const minutesms = ms % (60*1000);
    let sec = Math.floor(minutesms / 1000);

    hours = hours.toString().length == 1 ? "0" + hours : hours;
    minutes = minutes.toString().length == 1 ? "0" + minutes : minutes;
    sec = sec.toString().length == 1 ? "0" + sec : sec;

    return hours + ":" + minutes + ":" + sec;
}

function convertMsToSeconds(ms) {
    return parseInt(ms / 1000);
}

function getCurrentTime() {
    let date = new Date();
    let datePart1 = date.toLocaleString().replaceAll(". ", "-").substring(0, 10);
    let datePart2 = date.toLocaleString().substring(14, 19);

    return `${datePart1}T${datePart2}`
}

function convertDateToString(date) {
    let datePart1 = date.toLocaleString().replaceAll(". ", "-").substring(0, 10);
    let datePart2 = date.toLocaleString().substring(14, 19);

    return `${datePart1}T${datePart2}:00.000Z`
}


function dateRadioHandler() {
    let dateRadioSpecific = document.getElementById("dateRadioSpecific");

    let dateMethodSpecific = document.getElementById("dateMethodSpecific");
    let dateMethodAdd = document.getElementById("dateMethodAdd");

    if (dateRadioSpecific.checked) {
        dateMethodSpecific.style.display = "block";
        dateMethodAdd.style.display = "none"
    } else {
        dateMethodSpecific.style.display = "none";
        dateMethodAdd.style.display = "flex"
    }
}

function timerRadioHandler() {
    let timerRadioNormal = document.getElementById("timerRadioNormal");

    let timerMethodNormal = document.getElementById("timer");
    let timerMethodFlip = document.getElementById("flipdown");
    
    let timerNormalColors = document.getElementById("timerNormalColors");

    if (timerRadioNormal.checked) {
        timerMethodNormal.style.display = "block";
        timerNormalColors.style.display = "block";
        timerMethodFlip.style.display = "none";
    } else {
        timerMethodNormal.style.display = "none";
        timerNormalColors.style.display = "none";
        timerMethodFlip.style.display = "block";
    }
}

function borderCheckHandler(el) {
    let colorEl = document.getElementById("timerBorder");

    if (el.checked) {
        colorEl.disabled = false;
        changeBorder();
    } else {
        colorEl.disabled = true;
        timerElement.style.webkitTextStroke = "";
    }
}


function changeColor(color) {
    const timerElement = document.getElementById("timer");
    const selectedColor = color || document.getElementById("timerColor").value;
    timerElement.style.color = selectedColor;
}

function changeBorder(color) {
    const timerElement = document.getElementById("timer");
    const selectedColor = color || document.getElementById("timerBorder").value;
    timerElement.style.webkitTextStroke = `0.05px ${selectedColor}`;
}



function generateURL() {
    let query = "?";
    
    // DATE
    let dateRadioSpecific = document.getElementById("dateRadioSpecific");
    if (dateRadioSpecific.checked) {
        let dateEl = new Date(document.getElementById("dateSet").value);
        dateEl = convertDateToString(new Date(dateEl.getTime() + (dateEl.getTimezoneOffset() * 60000)));

        query += `date=${dateEl}`;
    }
    else {
        let dateHours = document.getElementById("dateSetHours").value.toString().padStart(2, '0');
        let dateMinutes = document.getElementById("dateSetMinutes").value.toString().padStart(2, '0');
        let dateSeconds = document.getElementById("dateSetSeconds").value.toString().padStart(2, '0');

        query += `time=${dateHours}:${dateMinutes}:${dateSeconds}`;
    }

    // TIMER
    let timerRadioNormal = document.getElementById("timerRadioNormal");
    if (timerRadioNormal.checked) {
        query += `&timer=normal`;

        // FOREGROUND
        let color = document.getElementById("timerColor").value;
        query += `&foreground=${color.replace("#", "")}`;
        
        // BORDER
        if (document.getElementById("wantTimerBorder").checked) {
            let border = document.getElementById("timerBorder").value;
            query += `&border=${border.replace("#", "")}`;
        }
    } else {
        query += `&timer=flipdown`;
    }

    document.getElementById("resultURL").setAttribute("href", window.location.href.split("?")[0] + query);
    document.getElementById("resultURL").style.display = "block";
    //console.log(window.location.href.split("?")[0] + query);
}