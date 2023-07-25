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
 * Function to get the index of project to view
 * Takes no parameters
 * @return {String} projectID
 */
const getViewProjectIndex = () => {
 let projIndex = localStorage.getItem("viewProjIndex")
 return projIndex
}

/**
 * Function to populate view form with current project details
 * Takes no parameters
 * Returns nothing
 */
const populateViewForm = () => {
 let projIndex = getViewProjectIndex()
 viewProject(projIndex)
}

/**
 * Function to go to the navDashboard
 * Takes no parameters
 * Returns nothing
 */
const navDashboard = () => {
 event.preventDefault()
 window.location.href = "./dashboard.html"
}

/**
 * Function to view a particular project
 * @param {Number} projectRowIndex Number that represents the row index to find project
 * Returns nothing
 */
const viewProject = (projectRowIndex) => {

 // display the area
 const viewForm = document.getElementById("viewForm")
 viewForm.style.display = 'block'

 // get the target project to display
 const savedProjects = getAllProjects()
 const target = savedProjects.filter((project, index) => index.toString() === projectRowIndex.toString())

 // get the elements
 let projectID = document.getElementById("viewProjectID")
 let projectName = document.getElementById("viewProjectName")
 let projectStartDate = document.getElementById("viewProjectStartDate")
 let projectEndDate = document.getElementById("viewProjectEndDate")
 let projectPriority = document.getElementById("viewProjectPriority")
 let projectStatus = document.getElementById("viewProjectStatus")
 let projectAtRisk = document.getElementById("viewProjectAtRisk")
 let projectOwner = document.getElementById("viewProjectOwner")
 let projectNotes = document.getElementById("viewProjectNotes")

 // populate the project details
 projectID.value = target[0].projectID
 projectName.value = target[0].projectName
 projectStartDate.value = target[0].projectStartDate
 projectEndDate.value = target[0].projectEndDate
 projectPriority.value = target[0].projectPriority
 projectStatus.value = target[0].projectStatus
 projectAtRisk.value = target[0].projectAtRisk
 projectOwner.value = target[0].projectOwner
 projectNotes.value = target[0].projectNotes

 // display the project ID
 const viewProjIDHeading = document.getElementById("viewProjIDHeading")
 viewProjIDHeading.innerHTML = `Viewing Project: ${target[0].projectID}`

}

/*
Event Listeners
*/

// submit the updated details
const viewProjectBtn = document.getElementById("viewProjectBtn")
viewProjectBtn.addEventListener("click", navDashboard)

// Display project details for editing
document.addEventListener("DOMContentLoaded", populateViewForm())