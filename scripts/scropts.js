const calculator                    = document.querySelector('.calculator')
const formAddCard                   = document.querySelector('.add-card')

const cardsOfSpeed                  = document.querySelector('.speed')
const cardsOfDistance               = document.querySelector('.distance')

const tabSpeed                      = document.querySelector('.tabs__switching').children[0]
const tabDistance                   = document.querySelector('.tabs__switching').children[1]

const dashboardValueOfTime          = document.querySelector('.dashboard__valueOfTime')
const dashboardValueOfTimeElement   = Array.from(dashboardValueOfTime.children)

const dashboardTypeOfTime           = document.querySelector('.dashboard__typeOfTime')
const dashboardTypeOfTimeElement    = Array.from(dashboardTypeOfTime.children)

const dashboardTypeOfDistance       = document.querySelector('.dashboard__typeOfDistance')
const distanceMeasurementType       = Array.from(dashboardTypeOfDistance.children)

const dashboardTypeOfSpeed          = document.querySelector('.dashboard__typeOfSpeed')
const speedMeasurementType          = Array.from(dashboardTypeOfSpeed.children)

const dashboardValueOfSpeed         = document.querySelector('.dashboard__valueOfSpeed')
const dashboardValueOfDistance      = document.querySelector('.dashboard__valueOfDistance')

const parentElementsDashboard       = [dashboardTypeOfSpeed, dashboardTypeOfDistance, dashboardTypeOfTime, dashboardValueOfTime]

const keyFilterKeys                 = ['0','1','2','3','4','5','6','7','8','9','Delete','Enter','Escape','Backspace']

const timeUnits                     = [ [  8766,   24,     1,       1 / 60 ,   1 / 3600 ],
                                        [ 'years','days', 'hours', 'minutes', 'seconds' ], ]

const distanceUnit                  = [ [ 'km', 'au',         'ly',            'pc'],
                                        [  1,    149597828.67, 9460730472580.8, 30856778570831.27 ] ]

const speedUnit                     = [ [ 'km', 'm', 'c'],
                                        [  1,    3.6, 1079252848.8 ] ]

const activeItems                   = { tab: 'speed', }

let speedCards                    = {}
let distanceCards                 = {}

let distanceMeasurement             = 'km'
let speedMeasurement                = 'km/h'
let occasion                        = ''
let keydown                         = ''
let time                            = 0


if ( localStorage.getItem('speedCards') ) {
  speedCards = JSON.parse( localStorage.getItem('speedCards') )

  loadCards(speedCards)
}
if ( localStorage.getItem('distanceCards') ) {
  distanceCards = JSON.parse( localStorage.getItem('distanceCards') )

  loadCards(distanceCards)
}

function loadCards(cardName) {
  let type = ''
  let typeCard = ''
  if ( cardName === speedCards ) {
     type  = 'speedID-'
     typeCard = 'speed__list'
    }
  else {
    type  = 'distanceID-'
    typeCard = 'distance__list'
  }
  for (const cardValue in cardName) {
    let value = cardName[cardValue]
    let name  = cardValue
    let id    = document.querySelector(`.${typeCard}`).childElementCount
    let card  = `
                <li id="${type}${id}" class="list__item">
                  <div class="list__name">${name}</div>
                  <div class="list__value">${value}</div>
                </li> 
               `
    document.querySelector(`.${typeCard}`).insertAdjacentHTML('beforeend', card)
  }
}

function saveCards(name, value, type) {
  if (type === 'speedID-') { 
    speedCards[name] = value 
    localStorage.setItem('speedCards', JSON.stringify(speedCards))
  }
  else { 
    distanceCards[name] = value 
    localStorage.setItem('distanceCards', JSON.stringify(distanceCards))
  }
}

function changeTypes (value) {
  if (value.parentElement === dashboardTypeOfDistance) {
    distanceMeasurementType.forEach(element => {
      element.classList.remove('active')
      if (value === element) {
        element.classList.add('active')
        distanceMeasurement = value.innerText
      }
    });
  }
  if (value.parentElement === dashboardTypeOfSpeed) {
    speedMeasurementType.forEach(element => {
      element.classList.remove('active')
      if (value === element) {
        element.classList.add('active')
        speedMeasurement = value.innerText
      }
    });
  }
  if (dashboardValueOfSpeed.value && dashboardValueOfDistance.value) {
    calculatorBody()
    }
}

function calculatorBody () {
  clearValuesOnDisplay()
  if (speedMeasurement === 'km/h') {
    if (distanceMeasurement === 'km') {
      time = dashboardValueOfDistance.value / dashboardValueOfSpeed.value
    }
    if (distanceMeasurement === 'au') {
      time = dashboardValueOfDistance.value * (distanceUnit[1][1] / dashboardValueOfSpeed.value)
    }
    if (distanceMeasurement === 'ly') {
      time = dashboardValueOfDistance.value * (distanceUnit[1][2] / dashboardValueOfSpeed.value)
    }
    if (distanceMeasurement === 'pc') {
      time = dashboardValueOfDistance.value * (distanceUnit[1][3] / dashboardValueOfSpeed.value)
    }
  }
  if (speedMeasurement === 'm/s') {
    if (distanceMeasurement === 'km') {
      time = dashboardValueOfDistance.value / (dashboardValueOfSpeed.value * speedUnit[1][1])
    }
    if (distanceMeasurement === 'au') {
      time = dashboardValueOfDistance.value * (distanceUnit[1][1] / (dashboardValueOfSpeed.value * speedUnit[1][1]))
    }
    if (distanceMeasurement === 'ly') {
      time = dashboardValueOfDistance.value * (distanceUnit[1][2] / (dashboardValueOfSpeed.value * speedUnit[1][1]))
    }
    if (distanceMeasurement === 'pc') {
      time = dashboardValueOfDistance.value * (distanceUnit[1][3] / (dashboardValueOfSpeed.value * speedUnit[1][1]))
    }
  }
  if (speedMeasurement === 'c') {
    if (distanceMeasurement === 'km') {
      time = dashboardValueOfDistance.value / (dashboardValueOfSpeed.value * speedUnit[1][2])
    }
    if (distanceMeasurement === 'au') {
      time = dashboardValueOfDistance.value * (distanceUnit[1][1] / (dashboardValueOfSpeed.value * speedUnit[1][2]))
    }
    if (distanceMeasurement === 'ly') {
      time = dashboardValueOfDistance.value * (distanceUnit[1][2] / (dashboardValueOfSpeed.value * speedUnit[1][2]))
    }
    if (distanceMeasurement === 'pc') {
      time = dashboardValueOfDistance.value * (distanceUnit[1][3] / (dashboardValueOfSpeed.value * speedUnit[1][2]))
    }
  }
  displayingData(time)
}

function displayingData (time) {
  for (let i = 0; i < 5; i++) {
    if (time >= timeUnits[0][i]) {
      dashboardValueOfTimeElement[i].innerText = Math.floor(time / timeUnits[0][i])
      dashboardTypeOfTimeElement[i].innerText = timeUnits[1][i]
      time = time % timeUnits[0][i]
    }
  }

  if ( dashboardValueOfTimeElement[0].innerText.length > 3 ) {
    dashboardValueOfTimeElement[0].innerText = spaceInYearValue(dashboardValueOfTimeElement, 0)
  }

  let empty = true

  for (let i = 0; i < 5; i++) {
    if ( dashboardTypeOfTimeElement[i].innerText !== '' ) { return empty = false }
  }

  if ( empty ) { dashboardTypeOfTimeElement[0].innerText = 'Too fast!' }

}

function valueAfterDot (value) {
  value = String(value)
  let dotPosition = value.indexOf('.')
  dotPosition = value.substring(dotPosition)
  return dotPosition
}

function clearValuesOnDisplay() {
  dashboardValueOfTimeElement.forEach((index)=>index.innerText = '')
  dashboardTypeOfTimeElement.forEach((index)=>index.innerText = '')
}

function clearValueInputs() {
  dashboardValueOfSpeed.value = ''
  dashboardValueOfDistance.value = ''
}

function spaceInYearValue(value, position) {
  let length   = value[position].innerText.length
  let meaning  = value[position].innerText
  let i        = length % 3
  let j        = (length - i) / 3
  let newValue = meaning.substr(0, i) + ' '
  for (let n = 0; n < j; n++, i += 3) {
    newValue += meaning.substr(i, 3) + ' '
  }
  return newValue.trimEnd()
}

function changeTab(tab) {
  if (tab === tabSpeed) {
  tabSpeed.classList.add('active')
  tabDistance.classList.remove('active')
  cardsOfSpeed.style.display = 'block'
  cardsOfDistance.style.display = 'none'
  activeItems.tab = 'speed'
  } else {
    tabSpeed.classList.remove('active')
    tabDistance.classList.add('active')
    cardsOfSpeed.style.display = 'none'
    cardsOfDistance.style.display = 'block'
    activeItems.tab = 'distance'
  }
  cardsOfSpeed.firstElementChild.lastElementChild.classList.remove('remove-active')
  cardsOfSpeed.lastElementChild.classList.remove('remove-active')
  cardsOfDistance.firstElementChild.lastElementChild.classList.remove('remove-active')
  cardsOfDistance.lastElementChild.classList.remove('remove-active')
}

function addCard(element, key) {
  let value = formAddCard.querySelector('.form__value').value
  let name  = formAddCard.querySelector('.form__name').value
  let id = 0
  let type = ''

  if (activeItems.tab === 'speed') { 
    id = document.querySelector('.speed__list').childElementCount
    type = 'speedID-'
  }
  else { 
    id = document.querySelector('.distance__list').childElementCount
    type = 'distanceID-'
  }

  if (name === '') { name = `value ${id}`}

  let card = `
  <li id="${type}${id}" class="list__item">
  <div class="list__name">${name}</div>
  <div class="list__value">${value}</div>
  </li> 
  `
  
  if ( element.innerText === '+ add' ) { 
    if (formAddCard.style.display !== 'flex') { formAddCard.style.display = 'flex' } 
  }
  

  if ( element.innerText === 'add' && value || key === 'Enter' && value ) {
    if (activeItems.tab === 'speed') { document.querySelector('.speed__list').insertAdjacentHTML('beforeend', card) }
    else {document.querySelector('.distance__list').insertAdjacentHTML('beforeend', card) }
    formAddCard.style.display = 'none'
    formAddCard.querySelector('.form__value').value = ''
    saveCards(name, value, type)
  }

  if (
    element === formAddCard        ||
    element.innerText === 'cancel' ||
    key === 'Escape'
  ) { if ( formAddCard.style.display === 'flex' ) formAddCard.style.display = 'none' }
}

function removeCard(element) {
  let name = ''
  name = element.children[0].innerText
  if ( element.parentElement.parentElement === cardsOfSpeed ) {
    element.remove()
    delete speedCards[name]
    localStorage.setItem('speedCards', JSON.stringify(speedCards))
  } 
  else {
    element.remove()
    delete distanceCards[name]
    localStorage.setItem('distanceCards', JSON.stringify(distanceCards))
  }
}

function takeValue(element) {
  element.parentElement.parentElement === cardsOfSpeed
    ? dashboardValueOfSpeed.value = element.children[1].innerText
    : dashboardValueOfDistance.value = element.children[1].innerText

  for ( let card of element.parentElement.children ) { card.classList.remove('active-item') }

  element.classList.add('active-item')
  calculatorBody()
}

function eventHandler(event) {
  keydown  = event.key
  if ( event.target !== document.firstElementChild ) { occasion = event.target }

  if (dashboardValueOfSpeed.value && dashboardValueOfDistance.value && keydown === 'Enter') { calculatorBody() }

  if (dashboardValueOfSpeed.value && dashboardValueOfDistance.value) { setTimeout(calculatorBody(), 1000) }

  if (!dashboardValueOfSpeed.value || !dashboardValueOfDistance.value) { clearValuesOnDisplay() }

  if (parentElementsDashboard.includes(occasion.parentElement)) { changeTypes(occasion) }

  if (keydown === 'Delete') {
    if      (document.activeElement === dashboardValueOfSpeed)    { dashboardValueOfSpeed.value = '' }
    else if (document.activeElement === dashboardValueOfDistance) { dashboardValueOfDistance.value = '' }
    else    { clearValueInputs() }
  }

  if (occasion === tabSpeed || occasion === tabDistance ) { changeTab(occasion) }

  if ( occasion.innerText === '- remove') { 
    occasion.parentNode.nextElementSibling.classList.toggle('remove-active')
    occasion.classList.toggle('remove-active')
  }

  if ( occasion.innerText === '+ add' || formAddCard.style.display === 'flex' ) { addCard(occasion, keydown) }

  if ( occasion.parentElement.classList.contains('list') ) {
    occasion.parentElement.previousElementSibling.children[1].classList.contains('remove-active')
      ? removeCard(occasion)
      : takeValue(occasion)
    }
}

function keyFilter (event) {
  if ( keyFilterKeys.includes(event.key) ) { eventHandler(event) }
}

window.addEventListener ( 'click',   eventHandler )
window.addEventListener ( 'keydown', keyFilter )
window.addEventListener ( 'keyup',   keyFilter )
