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
 * Function to create pie chart
 * @param {Object} data contains data labels and totals to display
 * @param {String} elementID element id to display chart
 * @param {String} labelTitle represents label name
 * @param {String} title represents chart title
 * Returns nothing
 */
const createPieChart = (data, elementID, labelTitle, title) => {

  const chartElement = document.getElementById(elementID)

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
      }
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

  let lowCount = 0
  let mediumCount = 0
  let highCount = 0

  const savedProjects = getAllProjects()

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

  const labels = ['Low', 'Medium', 'High']
  const totals = [lowCount, mediumCount, highCount]
  const data = { 'labels': labels, 'totals': totals }
  createPieChart(data, 'projPriorityChart', ' Total', 'Projects By Priority')

}

/**
 * Function to create the project by status chart
 * Takes no parameters
 * Returns nothing
 */
const genProjByStatusChart = () => {

  let notStartedCount = 0
  let inProgressCount = 0
  let completedCount = 0

  const savedProjects = getAllProjects()

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

  const labels = ['Completed', 'In Progress', 'Not Started']
  const totals = [completedCount, inProgressCount, notStartedCount]
  const data = { 'labels': labels, 'totals': totals }
  createPieChart(data, 'projStatusChart', ' Total', 'Projects By Status')

}

/**
 * Function to display dashboard by calling methods
 * Takes no parameters
 * Returns nothing
 */
const displayDashboardPage = () => {

  displayAllProjects()
  genProjByPriorityChart()
  genProjByStatusChart()

}


/*
Event Listeners
*/

// add event listener for the button to search for project
let searchProjectBtn = document.getElementById("searchProjectBtn")
searchProjectBtn.addEventListener("click", searchProject)

// READ and display all project on the HTML
document.addEventListener("DOMContentLoaded", displayDashboardPage)
