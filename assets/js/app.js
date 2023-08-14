// Test for a connection to the html page
console.log('connected')

// enable JS strict mode to enforce stricter parsing
'use strict';

// local storage serves as database
const localStorage = window.localStorage

/*
READ (cRud) operation and helper functions
*/

/**
 * Funtion to get and return all projects from local storage db
 * Takes no prameters
 * @return {Array} all saved projects
 */
const getAllProjects = () => {
 const savedProjects = JSON.parse(localStorage.getItem('projects')) || []
 return savedProjects
}

/**
 * Funtion to READ and display all projects
 * Takes no prameters and returns nothing
 */
const displayAllProjects = () => {
 // get all projects from db
 const savedProjects = getAllProjects()
 let rowIndex = 0
 // if there are projects, insert the record in the table for display
 if (savedProjects.length !== 0) {
  savedProjects.forEach(project => {
   insertProjectRecord(project, rowIndex)
   rowIndex += 1
  })
 }
}

/**
 * Helper Function to insert project record into project table
 * in order to display (READ) the data
 * @param {Object} project Object that contains the target project details
 * @param {Number} rowIndex Number that represents the row index to insert data
 * Returns nothing
 */
const insertProjectRecord = (project, rowIndex) => {

 // get the project table element and insert a row at the end
 const projectTable = document.getElementById("projectsTableBody")
 let row = projectTable.insertRow(-1)

 // assign data id to element
 row.dataset.id = rowIndex

 // insert all the cells to display data
 let projectID = row.insertCell(0)
 let projectName = row.insertCell(1)
 let projectStartDate = row.insertCell(2)
 let projectEndDate = row.insertCell(3)
 let projectPriority = row.insertCell(4)
 let projectStatus = row.insertCell(5)
 let projectAtRisk = row.insertCell(6)
 let projectOwner = row.insertCell(7)
 let projectNotes = row.insertCell(8)
 let editButton = row.insertCell(9)
 let deleteButton = row.insertCell(10)
 let viewButton = row.insertCell(11)

 // slice off after 15 characters to limit display on table
 charSlice = 15
 let projectNotesSliced = project.projectNotes.slice(0, charSlice)
 if (project.projectNotes.length > 10) {
  projectNotesSliced += '...'
 }

 // display the associated db value from the project object
 projectID.innerText = project.projectID
 projectName.innerText = project.projectName
 projectStartDate.innerText = project.projectStartDate
 projectEndDate.innerText = project.projectEndDate
 projectPriority.innerText = project.projectPriority
 projectStatus.innerText = project.projectStatus
 projectAtRisk.innerText = project.projectAtRisk
 projectOwner.innerText = project.projectOwner
 projectNotes.innerText = projectNotesSliced

 // insert an edit button for the row
 let editBtn = `<span class="editPill badge rounded-pill" onclick="editProject(${rowIndex})"><img class="iconAction" src="./assets/images/pencil-fill.svg"> Edit</img></span>`
 editButton.innerHTML = editBtn
 editButton.setAttribute("class", "text-center")

 // insert an edit button for the row
 let deleteBtn = `<span class="deletePill badge rounded-pill" onclick="deleteProject(${rowIndex})" data-bs-toggle="modal" data-bs-target="#modalDeleteProj"><img class="iconAction" src="./assets/images/trash.svg"> Delete</img></span>`
 deleteButton.innerHTML = deleteBtn
 deleteButton.setAttribute("class", "text-center")

 // insert a view button for the row
 let viewBtn = `<span class="viewPill badge rounded-pill" onclick="viewProject(${rowIndex})"><img class="iconAction" src="./assets/images/info-circle-fill.svg"> View</img></span>`
 viewButton.innerHTML = viewBtn
 viewButton.setAttribute("class", "text-center")

}

/**
 * Function to view a particular project
 * @param {Number} projectRowIndex Number that represents the row index to find project
 * Returns nothing
 */
const viewProject = (projectRowIndex) => {
  localStorage.setItem("viewProjIndex", projectRowIndex)
  window.location.href = "./viewProj.html"
}

/**
 * Function to search for a project by name
 * Takes no parameters
 * Returns nothing
 */
const searchProject = () => {

 // get the search value and find the index if there is matching name
 let searchVal = document.getElementById("searchProjectVal").value
 const savedProjects = getAllProjects()
 const tgtIndex = savedProjects.findIndex(project => project.projectName.toLowerCase() === searchVal.toLowerCase())

 // check if project exists, else provide feedback
 if (tgtIndex !== -1 && searchVal) {
  viewProject(tgtIndex)
 } else if (!savedProjects.length) {
   msg = "There are no projects to search!"
   localStorage.setItem("feedbackMsg", msg)
   location.reload()
 } else {
  msg = "The project cannot be found!"
  localStorage.setItem("feedbackMsg", msg)
  location.reload()
 }

}

/*
UPDATE (crUd) operation
*/

/**
 * Function to UPDATE (edit) the target project
 * @param {Number} projectRowIndex Number that represents the row index of record to edit
 * Returns nothing
 */
const editProject = (projectRowIndex) => {
  localStorage.setItem("editProjIndex", projectRowIndex)
  window.location.href = "./editProj.html"
}

/*
Chart Methods
*/

/**
 * Function to generate general dashboard stats
 * Takes no parameters
 * Returns nothing
 */
const genSummary = () => {

  // elements to display stats
  const totalProjCountEl = document.getElementById("totalProjCount")
  const totalProjCompletionRateEl = document.getElementById("totalProjCompletionRate")
  const totalProjectsAtRiskEl = document.getElementById("totalProjAtRisk")

  // get all the stats
  const stats = calcStats()

  // display the stats
  totalProjCountEl.innerText = `${stats['totalProjects']}`
  totalProjCompletionRateEl.innerText = `${stats['completionRate']}%`
  totalProjectsAtRiskEl.innerText = `${stats['totalProjAtRisk']}`

}

/**
 * Function to calculate dashboard metric stats
 * Takes no parameters
 * @return {Object} calculated stats for completion rate and projects at risk
 */
const calcStats = () => {

  // get all projects
  const savedProjects = getAllProjects()

  // initialize stats object
  let stats = {
    'totalProjects': savedProjects.length,
    'completionRate': 0,
    'totalProjAtRisk': 0
  }

  // for each saved project count completed and projects at risk
  savedProjects.forEach(project => {

    let projStatus = project['projectStatus']
    let projAtRisk = project['projectAtRisk']

    // increment if the project status is completed
    if (projStatus === 'Completed') {
      let currentCount = stats['completionRate']
      stats['completionRate'] = currentCount += 1
    }

    // increment if the project is at risk
    if (projAtRisk === 'Yes') {
      let currentCount = stats['totalProjAtRisk']
      stats['totalProjAtRisk'] = currentCount += 1
    }

  });

  // calculate a completion rate if there are projects
  if (stats.totalProjects === 0) {
    stats['completionRate'] = 0
  } else {
    stats['completionRate'] = Math.round((stats['completionRate'] / savedProjects.length) * 100)
  }

  // return all the stats
  return stats

}

/**
 * Function to create pie chart
 * @param {Object} data contains data labels and totals to display
 * @param {String} elementID element id to display chart
 * @param {String} labelTitle represents label name
 * @param {String} title represents chart title
 * Returns nothing
 */
const createPieChart = (data, elementID, labelTitle, title) => {

  // assign the element to display
  const chartElement = document.getElementById(elementID)

  // setup the pie chart data
  const pieChartData = {
    labels: data['labels'],
    datasets: [{
      label: labelTitle,
      data: data['totals'],
      backgroundColor: [
        '#00ac46',
        '#fd8c00',
        '#dc0000'
      ],
      hoverOffset: 4
    }]
  }

  // configure the pie chart settings
  const config = {
    type: 'pie',
    data: pieChartData,
    options: {
      plugins: {
        legend: { position: 'bottom', align: 'center' },
        title: {
          display: true,
          text: title
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  };

  // create the new chart
  new Chart(chartElement, config)

}

/**
 * Function to create bar chart
 * @param {Object} data contains data labels and totals to display
 * @param {String} elementID element id to display chart
 * @param {String} labelTitle represents label name
 * @param {String} title represents chart title
 * Returns nothing
 */
const createBarChart = (data, elementID, labelTitle, title) => {

  // assign the element to display
  const chartElement = document.getElementById(elementID)

  // setup the bar chart data
  const barChartData = {
    labels: data['labels'],
    datasets: [{
      label: '',
      data: data['totals'],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)'
      ],
      borderWidth: 1
    }]
  };

  // configure the bar chart settings
  const config = {
    type: 'bar',
    data: barChartData,
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
          grid: { display: false }
        },
        x: {
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: title
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  };

  // create the new chart
  new Chart(chartElement, config)

}

/**
 * Function to create the project by priority pie chart
 * Takes no parameters
 * Returns nothing
 */
const genProjByPriorityChart = () => {

  // variables to hold counts
  let lowCount = 0
  let mediumCount = 0
  let highCount = 0

  // get all the saved projects
  const savedProjects = getAllProjects()

  // for each project update the counts by priority
  savedProjects.forEach(project => {

    let projPriority = project['projectPriority']

    switch (projPriority) {
      case 'Low':
        lowCount += 1
        break;
      case 'Medium':
        mediumCount += 1
        break;
      case 'High':
        highCount += 1
        break;
    }

  });

  // create the data object
  const labels = ['Low', 'Medium', 'High']
  const totals = [lowCount, mediumCount, highCount]
  const data = { 'labels': labels, 'totals': totals }

  // call the method to create the pie chart from calculated data
  createPieChart(data, 'projPriorityChart', ' Total', 'Projects By Priority')

}

/**
 * Function to create the project by status chart
 * Takes no parameters
 * Returns nothing
 */
const genProjByStatusChart = () => {

  // variables to hold counts
  let notStartedCount = 0
  let inProgressCount = 0
  let completedCount = 0

  // get all the saved projects
  const savedProjects = getAllProjects()

  // for each project update the counts by status
  savedProjects.forEach(project => {

    let projStatus = project['projectStatus']

    switch (projStatus) {
      case 'Not Started':
        notStartedCount += 1
        break;
      case 'In Progress':
        inProgressCount += 1
        break;
      case 'Completed':
        completedCount += 1
        break;
    }

  });

  // create data object
  const labels = ['Completed', 'In Progress', 'Not Started']
  const totals = [completedCount, inProgressCount, notStartedCount]
  const data = { 'labels': labels, 'totals': totals }

  // call the method to create the pie chart from calculated data
  createPieChart(data, 'projStatusChart', ' Total', 'Projects By Status')

}

/**
 * Function to create the project by month chart
 * Takes no parameters
 * Returns nothing
 */
const genProjByMonthChart = () => {

  // fill 12 empty values representing months
  let monthTotals = Array(12).fill(0)

  // get all saved projects
  const savedProjects = getAllProjects()

  // for each saved project get the project start date
  savedProjects.forEach(project => {

    // update the month totals based on project start date
    let projStartMonth = project['projectStartDate']
    let date = new Date(projStartMonth)
    let month = date.getMonth() // jan is 0
    let currentCount = monthTotals[month]
    monthTotals[month] = currentCount += 1
  });

  // create data object
  const labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
  const data = { 'labels': labels, 'totals': monthTotals }

  // call the method to create the bar chart from calculated data
  createBarChart(data, 'projMonthlyChart', ' Total', 'Projects By Start Month')
}

/**
 * Function to intialize the current date in local storage
 * Takes no parameters
 * Returns nothing
 */
const initializeCurrentDate = () => {

  // get the current date
  let currentDate = new Date() // date object with current date and time
  let month = currentDate.getMonth() // month as number 0-11
  let year = currentDate.getFullYear() // four digit number YYYY

  // set the date month year in local storage
  localStorage.setItem("dateMonthYear", JSON.stringify({
    month: month,
    year: year
  }))

}

/**
 * Function to get the month and year from local storage to display calendar
 * Takes no parameters
 * @return {Object} date month and year object
 */
const getMonthYear = () => {

  // get the date month year from local storage
  const dateMonthYear = JSON.parse(localStorage.getItem('dateMonthYear')) || null
  return dateMonthYear

}

/**
 * Function to update the month year in local storage
 * @param {Number} month month number to update to
 * @param {Number} year year number to update to
 * Returns nothing
 */
const updateDate = (month, year) => {

  // update the date month year in local storage
  localStorage.setItem("dateMonthYear", JSON.stringify({
    month: month,
    year: year
  }))

}

/**
 * Function to get all due dates
 * Takes no paramters
 * @return {Array} due dates
 */
const getDueDates = () => {

  // get all saved projects and initialize empty array
  const savedProjects = getAllProjects()
  let dueDates = []

  // for each project, add the end date to the due dates array
  savedProjects.forEach(project => {
    if (!dueDates.includes(project.projectEndDate)) {
      dueDates.push(project.projectEndDate)
    }
  })

  // return array of due dates
  return dueDates
 
}

/**
 * Function to get the calendar month names
 * Takes no paramters
 * @return {Array} calendar months
 */
const getCalendarMonthsArray = () => {

  // array to store calendar month names
  const calendarMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]

  // return the calendar months
  return calendarMonths

}

/**
 * Function to get calendar dates to display on calendar
 * Takes no paramters
 * @return {Object} calendar dates
 */
const getCalendarDates = () => {

  // get the month, year and calendar months array
  let dateObj = getMonthYear()
  let month = dateObj['month']
  let year = dateObj['year']
  let calendarMonths = getCalendarMonthsArray()

  // initilize empty object to store calculations
  let calendarDates = {}

  // update calendar dates object with calculated date details
  calendarDates['month'] = month
  calendarDates['monthName'] = calendarMonths[month]
  calendarDates['year'] = year
  calendarDates['firstDay'] = new Date(year, month, 1).getDay() // weekday as number 0-6
  calendarDates['monthDaysCount'] = new Date(year, month + 1, 0).getDate() // day as number 1-31

  // return calendar dates so calendar can be generated
  return calendarDates

}

/**
 * Function to check if the calandar date is a due date
 * @param {String} calendarDate calendar date to check
 * @return {String} string dueDate if date is a due date
 */
const checkIsDueDate = (calendarDate) => {

  // get all due dates in an array
  const dueDates = getDueDates()
  let isDueDate = ''

  // if the provided calendar date is a due date, update isDueDate
  if (dueDates.includes(calendarDate)) {
    isDueDate = 'dueDate'
  } else {
    isDueDate = 'notDueDate'
  }

  // return value
  return isDueDate
}

/**
 * Function to insert calendar days into calendar
 * @param {String} calendarDates calendar dates used to insert days for month/year
 * Returns nothing
 */
const insertCalendarDates = (calendarDates) => {

  // clear the days list in the calendar
  const days = document.getElementById("days")
  days.innerHTML = ''

  // add empty list nodes for anything before the first day
  for (let i = 1; i <= calendarDates['firstDay']; i++) {

    // create the list elemnet and append it to the days
    let listElement = document.createElement("li")
    listElement.appendChild(document.createTextNode(""))
    days.appendChild(listElement)

  }

  // create a list of all days of the month
  for (let i = 1; i <= calendarDates['monthDaysCount']; i++) {

    // set day and month+1 to format i (day) into proper date format
    let day = ''
    let month = calendarDates['month'] + 1

    // if i (i.e. the day) is less than 10 reformat with leading '0'
    if (i < 10) {
      day = '0' + i.toString()
    } else {
      day = i.toString()
    }

    // if the month is less than 10 reformat with leading '0'
    if (month < 10) {
      month = '0' + month
    }

    // format the calendar date of current i
    let calendarDate = `${calendarDates['year']}-${month}-${day}`

    // check if the calendar date is due date
    let isDueDate = checkIsDueDate(calendarDate)

    // add the day to the days list
    let listElement = document.createElement("li")
    listElement.appendChild(document.createTextNode(i))
    listElement.setAttribute("class", `${isDueDate} calendarDay`)
    days.appendChild(listElement)

  }

}

/**
 * Function to generate the calendar and call methods
 * Takes no parameters
 * Returns nothing
 */
const generateCalendar = () => {

  // get the calendar dates
  let calendarDates = getCalendarDates()

  // display the month and year
  const dateMonthYearEl = document.getElementById("dateMonthYear")
  dateMonthYearEl.innerText = `${calendarDates['monthName']} - ${calendarDates['year']}`

  // call method to insert all the days into the calendar
  insertCalendarDates(calendarDates)

}

/**
 * Function to increment the month and year (if needed)
 * Takes no parameters
 * Returns nothing
 */
const genNextMonth = () => {

  // get the month and year that is currently stored
  let dateObj = getMonthYear()
  let month = dateObj['month']
  let year = dateObj['year']

  // increment the month
  month += 1

  // if it's out of range increment the year and reset the month
  if (month > 11) {
    month = 0
    year += 1
  }

  // update the month and year in local storage and generate calendar
  updateDate(month, year)
  generateCalendar()
}

/**
 * Function to decrenebt the month and year (if needed)
 * Takes no parameters
 * Returns nothing
 */
const genPrevMonth = () => {

  // get the month and year that is currently stored
  let dateObj = getMonthYear()
  let month = dateObj['month']
  let year = dateObj['year']

  // decrement the month
  month -= 1

  // if the month is less than zero, decrement the year and reset month
  if (month < 0) {
    month = 11
    year -= 1
  }

  // update the month and year in local storage and generate calendar
  updateDate(month, year)
  generateCalendar()
}

/**
 * Function to generate the list of project names for dropdown
 * Takes no parameters
 * Returns nothing
 */
const genDataListProjNames = () => {

  // get all saved projects and initialize an empty array
  let savedProjects = getAllProjects()
  let names = []

  // for each saved project, add the projName to the array (not duplicated)
  savedProjects.forEach(project => {
    projName = project['projectName']
    if (names.indexOf(projName) === -1) {
      names.push(projName)
    }
  })

  // sort the array a-z
  names.sort()

  // get the elements to update on the form
  const projectName = document.getElementById("searchProjectVal")
  const projectNameOptions = document.getElementById("searchProjectNameOptions")
  projectName.innerHTML = ''

  // for each projName, insert the option html
  names.forEach(projName => {
    let optionElement = document.createElement("option")
    optionElement.setAttribute("value", projName)
    projectNameOptions.appendChild(optionElement)
  })

}


/**
 * Function to display dashboard by calling methods
 * Takes no parameters
 * Returns nothing
 */
const displayDashboardPage = () => {

  // call all methods to display dashboard data and metrics
  initializeCurrentDate()
  genSummary()
  displayAllProjects()
  genProjByPriorityChart()
  genProjByStatusChart()
  genProjByMonthChart()
  generateCalendar()
  genDataListProjNames()

}


/*
Event Listeners
*/

// add event listener for the button to display next month calendar
let nextMonthBtn = document.getElementById("nextMonthBtn")
nextMonthBtn.addEventListener("click", genNextMonth)

// add event listener for the button to display previous month calendar
let prevMonthBtn = document.getElementById("prevMonthBtn")
prevMonthBtn.addEventListener("click", genPrevMonth)

// add event listener for the button to search for project
let searchProjectBtn = document.getElementById("searchProjectBtn")
searchProjectBtn.addEventListener("click", searchProject)

// READ and display all project on the HTML
document.addEventListener("DOMContentLoaded", displayDashboardPage)
