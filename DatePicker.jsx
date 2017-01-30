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

function populateWeek (weekElem, firstDayTime, weekId, currentDay = 0) {
  weekElem.addEventListener('click', function (ev) {
    console.log(`click event:  ${ev.target.innerHTML}`)
    ev.stopPropagation()
  })
  weekElem.children[0].innerHTML = weekId
  let dayAcc = 0
  for (let i = 1; i < 8; ++i) {
    const el = weekElem.children[i]
    if (i === currentDay) {
      el.classList.add('current')
    }
    const day = new Date(firstDayTime + (i * miliDay)).getDate()
    el.innerHTML = day
    if (Number.parseInt(day) < Number.parseInt(dayAcc)) {
      el.dispatchEvent(new CustomEvent(
        'newMonth',
        {
          'detail': new Date(firstDayTime + (i * miliDay)).getMonth(),
          'bubbles': true,
          'cancelable': true
        }
      ))
    }
    dayAcc = day
  }
}

const DatePicker = React.createClass({
  getInitialState () {
    return { populated: false }
  },
  focusHandler () {
    this.refs.calendar.classList.add('rdtOpen')
    if (this.state.populated) return
    for (let i = 0; i < 5; ++i) {
      let newWeek = this.refs.popup.lastChild.cloneNode(true)
      newWeek = this.refs.popup.insertBefore(newWeek, this.refs.popup.lastChild)

      populateWeek(newWeek, (new Date().getTime() - (new Date().getDay() * miliDay) + (i * miliDay * 7)), 1)
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
        <input onBlur={this.blurHandler} onFocus={this.focusHandler}/>
        <div ref='popup' className='rdtPicker' style={{width: '400px'}}>
          <div style={weekStyle}>
            <div style={headItemStyle}>week</div>
            <div style={headItemStyle}>Mon</div>
            <div style={headItemStyle}>Tue</div>
            <div style={headItemStyle}>Wed</div>
            <div style={headItemStyle}>Thi</div>
            <div style={headItemStyle}>Fri</div>
            <div style={headItemStyle}>Sat</div>
            <div style={headItemStyle}>Sun</div>
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
