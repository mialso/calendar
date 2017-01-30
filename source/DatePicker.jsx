import React from 'react'

const weekStyle = {
  display: 'flex'
}
const headItemStyle = {
  flex: 1,
  backgroundColor: '#ff0000',
  textAlign: 'center'
}
const itemStyle = {
  flex: 1,
  textAlign: 'center'
}
const miliDay = 24 * 60 * 60 * 1000


const DatePicker = React.createClass({
  getInitialState () {
    return { populated: false, bottomWeekStartTime: 0, topWeekStartTime: 0}
  },
	getMonthElement(monthNum, yearNum) {
		console.log('add month'+monthNum)
		const monthEl = document.createElement('div')
		monthEl.classList.add('month')
		switch(monthNum) {
			case 0: monthEl.innerHTML = `January ${yearNum}`;break
			case 1: monthEl.innerHTML = `February ${yearNum}`;break
			case 2: monthEl.innerHTML = `March ${yearNum}`;break
			case 3: monthEl.innerHTML = `April ${yearNum}`;break
			case 4: monthEl.innerHTML = `May ${yearNum}`;break
			case 5: monthEl.innerHTML = `June ${yearNum}`;break
			case 6: monthEl.innerHTML = `July ${yearNum}`;break
			case 7: monthEl.innerHTML = `August ${yearNum}`;break
			case 8: monthEl.innerHTML = `September ${yearNum}`;break
			case 9: monthEl.innerHTML = `October ${yearNum}`;break
			case 10: monthEl.innerHTML = `November ${yearNum}`;break
			case 11: monthEl.innerHTML = `December ${yearNum}`;break
			default: monthEl.innertHTML = 'unknown';break
		}
		return monthEl
	},
	populateWeek (weekElem, firstDayTime, weekId, currentDay = 0) {
		const self = this
		let month = null
		weekElem.children[0].innerHTML = weekId
		let dayAcc = 0
		for (let i = 1; i < 8; ++i) {
			const el = weekElem.children[i]
			if (i === currentDay) {
				el.classList.add('current')
			}
			const curDate = new Date(firstDayTime + ((i -1) * miliDay))
			const day = curDate.getDate()
			el.innerHTML = day
			el.dataset.time = curDate.getTime()
			if (Number.parseInt(day) < Number.parseInt(dayAcc)) {
				month = new Date(firstDayTime + (7 * miliDay)).getMonth()
			}
			dayAcc = day
		}
		return month
	},
	addWeekTop () {
		const time = this.state.topWeekStartTime - (miliDay * 7)
		let weekToMove = this.refs.popup.lastChild.previousSibling
		while (weekToMove && weekToMove.classList.contains('month')) {
			const toRemove = weekToMove
			weekToMove = weekToMove.previousSibling
			this.refs.popup.removeChild(toRemove)
		}
		let newMonth = this.populateWeek(weekToMove, time, 1)
		if (newMonth === null) {
			const curWeekMonth = new Date(time).getMonth()
			const nextWeekMonth = new Date(time+(miliDay * 7)).getMonth()
			if (curWeekMonth !== nextWeekMonth) newMonth = nextWeekMonth
		}
		if (newMonth !== null && !this.refs.popup.firstChild.nextSibling.classList.contains('month')) {
			const monthEl = this.getMonthElement(newMonth, new Date(time+(miliDay * 7)).getFullYear())
			this.refs.popup.insertBefore(monthEl, this.refs.popup.firstChild.nextSibling)
		}
		this.refs.popup.insertBefore(weekToMove, this.refs.popup.firstChild.nextSibling)
		this.setState({topWeekStartTime: time, bottomWeekStartTime: this.state.bottomWeekStartTime - (miliDay * 7)})
	},
	addWeekDown () {
		const time = this.state.bottomWeekStartTime + (miliDay * 7)
		let weekToMove = this.refs.popup.firstChild.nextSibling
		while (weekToMove && weekToMove.classList.contains('month')) {
			const toRemove = weekToMove
			weekToMove = weekToMove.nextSibling
			//weekToMove = weekToMove.previousSibling
			this.refs.popup.removeChild(toRemove)
		}
		let newMonth = this.populateWeek(weekToMove, time, 1)
		if (newMonth === null) {
			const curWeekMonth = new Date(time).getMonth()
			const nextWeekMonth = new Date(time+(miliDay * 7)).getMonth()
			if (curWeekMonth !== nextWeekMonth) newMonth = nextWeekMonth
		}
		this.refs.popup.insertBefore(weekToMove, this.refs.popup.lastChild)
		if (newMonth !== null) {
			const monthEl = this.getMonthElement(newMonth, new Date(time+(miliDay * 7)).getFullYear())
			this.refs.popup.insertBefore(monthEl, this.refs.popup.lastChild)
		}
		this.setState({bottomWeekStartTime: time, topWeekStartTime: this.state.topWeekStartTime + (miliDay * 7)})
	},
	mouseWheelHandler (ev) {
		console.log('mouse wheel handler')
		ev = ev || window.event
		if (ev.preventDefault) {
			ev.preventDefault()
		}
		ev.returnValue = false
		ev.deltaY < 0 ? this.addWeekTop() : this.addWeekDown()
	},
  focusHandler () {
		const self = this
		this.refs.popup.addEventListener('wheel', this.mouseWheelHandler)
    this.refs.calendar.classList.add('rdtOpen')
    if (this.state.populated) return
    for (let i = 0; i < 5; ++i) {
      let newWeek = this.refs.popup.lastChild.cloneNode(true)

			const time = new Date().getTime() - (new Date().getDay() * miliDay) + (i * miliDay * 7)
			if (i == 0) this.setState({topWeekStartTime: time})
			if (i == 4) this.setState({bottomWeekStartTime: time})
      let newMonth = this.populateWeek(newWeek, time, 1)
			if (newMonth === null) {
				const curWeekMonth = new Date(time).getMonth()
				const nextWeekMonth = new Date(time+(miliDay * 7)).getMonth()
				if (curWeekMonth !== nextWeekMonth) newMonth = nextWeekMonth
			}
      newWeek = this.refs.popup.insertBefore(newWeek, this.refs.popup.lastChild)
			if (newMonth !== null) {
				const monthEl = this.getMonthElement(newMonth, new Date(time+(miliDay * 7)).getFullYear())
				this.refs.popup.insertBefore(monthEl, this.refs.popup.lastChild)
			}
			newWeek.addEventListener('click', function (ev) {
				const date = ev.target.dataset.time
				console.log(`click event:  ${date}`)
				console.log(new Date(Number.parseInt(date)).toString())
				ev.stopPropagation()
				self.refs.calendar.classList.remove('rdtOpen')
				self.refs.input.value = date
				self.refs.popup.removeEventListener('wheel', this.mouseWheelHandler)
			})
    }
    this.setState({populated: true})
  },
  blurHandler () {
    // this.refs.calendar.classList.remove('rdtOpen')
  },
  componentDidMount () {
  },
  render () {
    return (
      <div ref='calendar' className='rdt'>
        <input ref='input' onBlur={this.blurHandler} onFocus={this.focusHandler}/>
			  <span>{new Date(this.state.topWeekStartTime).toString()}</span>
			  <span>{new Date(this.state.bottomWeekStartTime).toString()}</span>
        <div ref='popup' className='rdtPicker' style={{width: '400px'}}>
          <div style={weekStyle}>
            <div style={headItemStyle}>week</div>
            <div style={headItemStyle}>Sun</div>
            <div style={headItemStyle}>Mon</div>
            <div style={headItemStyle}>Tue</div>
            <div style={headItemStyle}>Wed</div>
            <div style={headItemStyle}>Thi</div>
            <div style={headItemStyle}>Fri</div>
            <div style={headItemStyle}>Sat</div>
          </div>
          <div style={{display: 'flex'}}>
            <div style={itemStyle}></div>
            <div style={itemStyle}></div>
            <div style={itemStyle}></div>
            <div style={itemStyle}></div>
            <div style={itemStyle}></div>
            <div style={itemStyle}></div>
            <div style={itemStyle}></div>
            <div style={itemStyle}></div>
          </div>
        </div>
      </div>
    )
  }
})

export default DatePicker
