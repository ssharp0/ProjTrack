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

/*
UPDATE (crUd) operation and helper functions
*/

/**
 * Function to get the index of project to edit
 * Takes no parameters
 * @return {String} projectID
 */
const getEditProjIndex = () => {
 let projIndex = localStorage.getItem("editProjIndex")
 return projIndex
}

/**
 * Function to populate edit form with current project details
 * Takes no parameters
 * Returns nothing
 */
const populateEditForm = () => {
 let projIndex = getEditProjIndex()
 editProject(projIndex)
}

/**
 * Function to UPDATE (edit) the target project
 * @param {Number} projectRowIndex Number that represents the row index of record to edit
 * Returns nothing
 */
const editProject = (projectRowIndex) => {

 // grab all the form elements
 const editForm = document.getElementById("editForm")
 let projectID = document.getElementById("editProjectID")
 let projectName = document.getElementById("editProjectName")
 let projectStartDate = document.getElementById("editProjectStartDate")
 let projectEndDate = document.getElementById("editProjectEndDate")
 let projectPriority = document.getElementById("editProjectPriority")
 let projectStatus = document.getElementById("editProjectStatus")
 let projectAtRisk = document.getElementById("editProjectAtRisk")
 let projectOwner = document.getElementById("editProjectOwner")
 let projectNotes = document.getElementById("editProjectNotes")

 // find the specific project to edit
 let savedProjects = getAllProjects()
 let target = savedProjects.filter((project, index) => index.toString() === projectRowIndex.toString())

 // add the project's data values to the edit form
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
 const editProjIDHeading = document.getElementById("editProjIDHeading")
 editProjIDHeading.innerHTML = `Edit Project: ${target[0].projectID}`

}

/**
 * Function to submit the edit to update the record in the database
 * Takes no parameters
 * Returns nothing
 */
const submitEdit = () => {

 // get the project index to edit
 let projectIndex = getEditProjIndex()

 // get all the saved projects
 let savedProjects = getAllProjects()

 // grab the updated information
 let projectID = document.getElementById("editProjectID")
 let projectName = document.getElementById("editProjectName")
 let projectStartDate = document.getElementById("editProjectStartDate")
 let projectEndDate = document.getElementById("editProjectEndDate")
 let projectPriority = document.getElementById("editProjectPriority")
 let projectStatus = document.getElementById("editProjectStatus")
 let projectAtRisk = document.getElementById("editProjectAtRisk")
 let projectOwner = document.getElementById("editProjectOwner")
 let projectNotes = document.getElementById("editProjectNotes")

 // update the particular project with updated details
 savedProjects[projectIndex] = {
  "projectID": projectID.value,
  "projectName": projectName.value,
  "projectStartDate": projectStartDate.value,
  "projectEndDate": projectEndDate.value,
  "projectPriority": projectPriority.value,
  "projectStatus": projectStatus.value,
  "projectAtRisk": projectAtRisk.value,
  "projectOwner": projectOwner.value,
  "projectNotes": projectNotes.value
 }

 // update the DB with the updated details
 localStorage.setItem('projects', JSON.stringify(savedProjects))

 // alert user to notify the action was completed
 alert("Project has been updated!")

 // remove the key reflecting index from local storage
 localStorage.removeItem("editProjIndex")

 // prevent the default and navigate back
 event.preventDefault()
 window.location.href = "./index.html"

}

/*
Event Listeners
*/

// submit the updated details
const editProjectBtn = document.getElementById("editProjectBtn")
editProjectBtn.addEventListener("click", submitEdit)

// Display project details for editing
document.addEventListener("DOMContentLoaded", populateEditForm())