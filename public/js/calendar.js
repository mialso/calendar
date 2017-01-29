console.log('calendar.js')

const miliDay = 24*60*60*1000
const miliWeek = 7 * miliDay

const monthData = 0

function populateWeek(weekElem, firstDayTime, weekId, currentDay = 0) {
	weekElem.addEventListener('click', function(ev) {
		console.log('click event: ' + ev.target.innerHTML)
		ev.stopPropagation()
	})
	weekElem.children[0].innerHTML = weekId
	let dayAcc = 0
	for (let i = 1; i < 8; ++i) {
		const el = weekElem.children[i]
		if (i === currentDay) {
			el.classList.add('current')
		}
		day = new Date(firstDayTime+(i*miliDay)).getDate()
		el.innerHTML = day
		if (Number.parseInt(day) < Number.parseInt(dayAcc)) {
			el.dispatchEvent(new CustomEvent(
				'newMonth', 
				{
					'detail': new Date(firstDayTime+(i*miliDay)).getMonth(),
					'bubbles': true,
					'cancelable': true
				}
			))
		}
		dayAcc = day
	}
}
function getCurrentWeek(currentDate) {
	const startYear = new Date(currentDate.getFullYear(), 0).getTime()
	const thisDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime()
	let thisWeek = thisDay - currentDate.getDay()*miliDay
	let weeks = 0
	for (let previousWeek = thisWeek; previousWeek > startYear; previousWeek -= miliWeek) {
		++weeks
	}
	return weeks
}
const currentDate = new Date(Date.now())
const currentTime = currentDate.getTime()
let currentDay = currentDate.getDay()
if (currentDay === 0) currentDay = 7
//const startWeekTime = currentTime.getTime() - currentDay*miliDay
const calendarEl = document.querySelector('.calendar')
calendarEl.addEventListener('click', function(ev) {
	console.log('event click: %o', ev)
})
calendarEl.addEventListener('newMonth', function(ev) {
	console.log('new month event, month = ' + ev.detail)
	ev.stopPropagation()
})

const currentYear = currentDate.getFullYear()
calendarEl.children[0].children[2].innerHTML = currentYear

const myDate = {}
myDate.year = currentYear
myDate.week = getCurrentWeek(currentDate)
myDate.month = currentDate.getMonth()

const showWeekNumber = 3
const newDate = {}
for (let i = 0; i < 6; ++i) {
	const startWeekTime = currentTime + (i*7 - (showWeekNumber*7) + currentDay)*miliDay
	populateWeek(calendarEl.children[i+1], startWeekTime, myDate.week-1+i, i === 1 ? currentDay : 0)
}

//console.log(getCurrentWeek(currentDate))

Date.prototype.getWeek = function () {
	    var target  = new Date(this.valueOf());
	    var dayNr   = (this.getDay() + 6) % 7;
	    target.setDate(target.getDate() - dayNr + 3);
	    var firstThursday = target.valueOf();
	    target.setMonth(0, 1);
	    if (target.getDay() != 4) {
				        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
				    }
	    return 1 + Math.ceil((firstThursday - target) / 604800000);
}

var d= new Date();
//alert(d.getWeek());
