const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const root = document.getElementById("calendar");
const prevMonth = document.getElementById("prev");
const nextMonth = document.getElementById("next");
const today = document.getElementById("today");

var modal = document.getElementById("modalContainer");


var eventDateId;
var dataEvents;

if (localStorage.getItem("calendarEvents")){
    dataEvents = JSON.parse(localStorage.getItem("calendarEvents"));
} else {
    dataEvents = {};
}





var modalContainer = document.getElementById("modalContainer");

var initDate = new Date();
//var setMonth = initDate.getMonth() + 1;
var setMonth = initDate.getMonth();
var setYear = initDate.getFullYear();
var year = document.getElementById("year");
var month = document.getElementById("month");

year.innerHTML = setYear;
month.innerHTML = monthName[setMonth];


function getDay(date) {
    var day = date.getDay();
    if (day == 0) {
        day = 7
    };
    return day - 1;
}

function createCalendar(id, year, month) {
    var container = document.getElementById(id);
//    var mon = month - 1;
    var d = new Date(year, month);

    for (day in days) {
        var dayCell = document.createElement("div");
        dayCell.textContent = days[day];
        dayCell.setAttribute("class", "day-name");
        container.appendChild(dayCell);
    }

    for (var i = 0; i < getDay(d); i++) {
        var blankCell = document.createElement("div");
        blankCell.setAttribute("class","blank-cell")
        container.appendChild(blankCell);
    }

    while (d.getMonth() == month) {
        createCell(container, d);
        d.setDate(d.getDate() + 1);
    }
    addListenerToCells();
}

createCalendar("calendar", setYear, setMonth);


function clearContainer(container){
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
}



nextMonth.onclick = function(){
    clearContainer(root);
    if (setMonth === 11) {
        setYear++;
        setMonth = 0;
    } else {
        setMonth++;
    };
    year.innerHTML = setYear;
    month.innerHTML = monthName[setMonth];
    createCalendar("calendar", setYear, setMonth);
};

prevMonth.onclick = function(){
    clearContainer(root);
    if (setMonth === 0) {
        setMonth = 11;
        setYear--;
    } else {
        setMonth--;
    };
    year.innerHTML = setYear;
    month.innerHTML = monthName[setMonth];
    createCalendar("calendar", setYear, setMonth);
};

today.onclick = function(){
    initDateFunc();
    clearContainer(root);
    year.innerHTML = setYear;
    month.innerHTML = monthName[setMonth];
    createCalendar("calendar", setYear, setMonth);
};

function initDateFunc(){
    initDate = new Date();
    setMonth = initDate.getMonth();
    setYear = initDate.getFullYear();
}

function createCell(container, dateInput) {
    const cell = document.createElement('div');
    cell.setAttribute('class', 'cell');
    const dateDiv = document.createElement('div');
    dateDiv.setAttribute('class', 'date-cell');
    dateDiv.setAttribute('id', dateInput.toDateString());
    dateDiv.textContent = dateInput.getDate();



    cell.appendChild(dateDiv);

    if(typeof dataEvents !== "undefined"){
        if(dataEvents[dateDiv.id]){
            var eventContainer = document.createElement('span');
            eventContainer.textContent = dataEvents[dateDiv.id];
            cell.appendChild(eventContainer);
        }
    }

    container.appendChild(cell);
}


function addListenerToCells() {
    cardsImage = document.querySelectorAll('.date-cell');
    for (let i = 0; i < cardsImage.length; i++) {
        cardsImage[i].addEventListener('click', changeEvent);
    }
}

function changeEvent(e){
    event.stopPropagation();
    let cellId = e.target.getAttribute('id');
    eventDateId = cellId;
    createForm(modalContainer,cellId);
    modal.style.display = "block";

}



function createForm(container, dateData){
    var form = document.createElement("form");
        form.setAttribute("class","modal-content");
    var formHeader = document.createElement("h3");
        formHeader.textContent = "Add event";
    var date = document.createElement("h4");
        date.textContent = dateData;
    var textInput = document.createElement("textarea");
        textInput.setAttribute("id","event-details");
    if(typeof dataEvents !== "undefined"){
        if(dataEvents[dateData]){ textInput.textContent = dataEvents[dateData]; }
    }
        textInput.required = true;
    var save = document.createElement("input");
        save.setAttribute("type","button");
        save.setAttribute("value","save");
        save.addEventListener("click", saveEvent);
    var close = document.createElement("input");
        close.setAttribute("type","button");
        close.setAttribute("value","close");
        close.addEventListener("click", closeModal);
    form.appendChild(formHeader);
    form.appendChild(date);
    form.appendChild(textInput);
    form.appendChild(save);
    form.appendChild(close);
    container.appendChild(form);

}

function saveEvent(e){
    e.stopPropagation();
    e.preventDefault();
    var eventDetails = document.getElementById("event-details").value;
//    if (eventDetails.length != 0) {dataEvents[eventDateId] = eventDetails;}
    dataEvents[eventDateId] = eventDetails;
    var serialDataEvents = JSON.stringify(dataEvents);
    localStorage.setItem("calendarEvents", serialDataEvents);

//    localStorage.setItem(tempData, eventDetails);
//    clearContainer(modalContainer);
//    modal.style.display = "none";
    closeModal();

    clearContainer(root);
    createCalendar("calendar", setYear, setMonth);
}
function closeModal(){
    modal.style.display = "none";
    clearContainer(modalContainer);

}


