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
 const projectTable = document.getElementById("projectsTable")
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

 // display the associated db value from the project object
 projectID.innerText = project.projectID
 projectName.innerText = project.projectName
 projectStartDate.innerText = project.projectStartDate
 projectEndDate.innerText = project.projectEndDate
 projectPriority.innerText = project.projectPriority
 projectStatus.innerText = project.projectStatus
 projectAtRisk.innerText = project.projectAtRisk
 projectOwner.innerText = project.projectOwner
 projectNotes.innerText = project.projectNotes

 // insert an edit button for the row
 let editBtn = `<button onclick="editProject(${rowIndex})">Edit</button>`
 editButton.innerHTML = editBtn

 // insert an edit button for the row
 let deleteBtn = `<button onclick="deleteProject(${rowIndex})">Delete</button>`
 deleteButton.innerHTML = deleteBtn

 // insert a view button for the row
 let viewBtn = `<button onclick="viewProject(${rowIndex})">View</button>`
 viewButton.innerHTML = viewBtn

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

 if (tgtIndex !== -1 && searchVal) {
  viewProject(tgtIndex)
 } else {
  alert("The project cannot be found!")
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

  // calculate and update the completeion rate and return the stats
  stats['completionRate'] = Math.round((stats['completionRate'] / savedProjects.length) * 100)
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
        'rgba(201, 203, 207, 0.2)',
        'rgba(201, 203, 207, 0.2)',
        'rgba(201, 203, 207, 0.2)',
        'rgba(201, 203, 207, 0.2)',
        'rgba(201, 203, 207, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)',
        'rgb(201, 203, 207)',
        'rgb(201, 203, 207)',
        'rgb(201, 203, 207)',
        'rgb(201, 203, 207)',
        'rgb(201, 203, 207)'
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
 * Function to display dashboard by calling methods
 * Takes no parameters
 * Returns nothing
 */
const displayDashboardPage = () => {

  // call all methods to display dashboard data and metrics
  genSummary()
  displayAllProjects()
  genProjByPriorityChart()
  genProjByStatusChart()
  genProjByMonthChart()

}


/*
Event Listeners
*/

// add event listener for the button to search for project
let searchProjectBtn = document.getElementById("searchProjectBtn")
searchProjectBtn.addEventListener("click", searchProject)

// READ and display all project on the HTML
document.addEventListener("DOMContentLoaded", displayDashboardPage)
