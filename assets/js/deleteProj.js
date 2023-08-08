// Test for a connection to the html page
console.log('connected')

// enable JS strict mode to enforce stricter parsing
'use strict';

/*
DELETE (cruD) operation and helper functions
*/

/**
 * Funtion to delete a selected project
 * @param {Number} projectRowIndex Number that represents the row index of record to edit
 * Returns nothing
 */
const deleteProject = (projectRowIndex) => {

 // get all projects and find the project ID to get user confirmation to delete
 let savedProjects = getAllProjects()
 let targetID = savedProjects[projectRowIndex].projectID
 response = confirmAction(`delete project ${targetID}`)

 // if the user confirms to delete then delete the record
 if (response === 'confirmed') {
  // exclude the selected project and update database
  savedProjects = savedProjects.filter((project, index) => index.toString() !== projectRowIndex.toString())
  localStorage.setItem('projects', JSON.stringify(savedProjects))
  // notify user of successful action
  alert(`Successfully deleted project ${targetID}!`)
  location.reload()
 }
}

/**
 * Funtion to delete all projects
 * Takes no pramters
 * Returns nothing
 */
const deleteAllProjects = () => {

 // check if there are projects
 let savedProjects = getAllProjects()

 // if there are projects confirm with the user
 if (savedProjects.length) {
   // clear the database
   localStorage.clear()
   location.reload()
 } else {
  alert("There are no projects to delete!")
 }
}

/**
 * Function to confirm user response
 * @param {String} msg message to display user
 * @return {String} user response
 */
const confirmAction = (msg) => {
 // variable to hold the reponse
 let response = ''
 let prompt = `Are you sure you want to ${msg}?\nPress OK to confirm, or cancel to void.`

 // get the user response and return it
 if (confirm(`${prompt}`)) {
  response = 'confirmed'
 } else {
  response = "cancelled"
 }
 return response
}

/*
Event Listeners
*/

// Event Handler to delete all projects
let deleteAllProjBtn = document.getElementById("deleteAllProjBtn")
deleteAllProjBtn.addEventListener("click", deleteAllProjects)