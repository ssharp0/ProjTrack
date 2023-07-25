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
Event Listeners
*/

// add event listener for the button to search for project
let searchProjectBtn = document.getElementById("searchProjectBtn")
searchProjectBtn.addEventListener("click", searchProject)

// READ and display all project on the HTML
document.addEventListener("DOMContentLoaded", displayAllProjects())
