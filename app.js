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

 // display the area
 const viewForm = document.getElementById("viewForm")
 const viewFormLegend = document.getElementById("viewFormLegend")
 viewForm.style.display = 'block'
 viewFormLegend.style.display = 'block'

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

 // add a button to cancel the view
 let button = `<button onclick="cancelView()">Cancel View</button>`
 cancelButtonEl = document.createElement("span")
 cancelButtonEl.innerHTML = button
 viewForm.append(cancelButtonEl)

}

/**
 * Function to cancel particular view
 * Takes no parameters
 * Returns nothing
 */
const cancelView = () => {
 location.reload()
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

// add event listener for the button to search for project
let searchProjectBtn = document.getElementById("searchProjectBtn")
searchProjectBtn.addEventListener("click", searchProject)

/*
UPDATE (crUd) operation and helper functions
*/

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

 // add a button to the edit form
 let button = `<button onclick="submitEdit(${projectRowIndex})">Confirm Edit</button>`
 editButtonEl = document.createElement("span")
 editButtonEl.innerHTML = button
 editForm.append(editButtonEl)

}

/**
 * Function to submit the edit to update the record in the database
 * @param {projectIndex} projectIndex Number that represents the location of record in database to edit
 * Returns nothing
 */
const submitEdit = (projectIndex) => {

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

}

/*
CREATE (Crud) operation and helper functions
*/

/**
 * Function to create a new project record
 * in order to create (CREATE) the data
 * Takes no parameters
 * Returns nothing
 */
const createProject = () => {

 // grab the form information information
 let projectID = assignID()
 let projectName = document.getElementById("createProjectName").value
 let projectStartDate = document.getElementById("createProjectStartDate").value
 let projectEndDate = document.getElementById("createProjectEndDate").value
 let projectPriority = document.getElementById("createProjectPriority").value
 let projectStatus = document.getElementById("createProjectStatus").value
 let projectAtRisk = document.getElementById("createProjectAtRisk").value
 let projectOwner = document.getElementById("createProjectOwner").value
 let projectNotes = document.getElementById("createProjectNotes").value

 // get all the saved projects
 let savedProjects = getAllProjects()

 const project = {
  "projectID": projectID,
  "projectName": projectName,
  "projectStartDate": projectStartDate,
  "projectEndDate": projectEndDate,
  "projectPriority": projectPriority,
  "projectStatus": projectStatus,
  "projectAtRisk": projectAtRisk,
  "projectOwner": projectOwner,
  "projectNotes": projectNotes
 }

 // notify the user of missing required fields, if any
 if (!projectName || !projectStartDate || !projectEndDate || !projectOwner) {
  const errorMsgSpan = document.getElementById("createFormErrorMsg")
  errorMsgSpan.style.color = 'red'
  errorMsgSpan.innerText = 'Error. Please make sure you have provided a project name, dates, and owner.'
  event.preventDefault()
 } else {
  // check for valid dates and names
  validDate = validateStartEndDates(projectStartDate, projectEndDate, "createFormErrorMsg")
  validName = validateName(projectName, "createFormErrorMsg")
  // if the name and dates are valid, add project to database
  if (validDate && validName) {
   savedProjects.push(project)
   localStorage.setItem('projects', JSON.stringify(savedProjects))
   // alert to notify success
   alert("success! The new project has been saved.")
  }
 }
}

/**
 * Funtion to assign a project ID
 * Takes no prameters
 * @return {String} string representing project number
 */
const assignID = () => {
 // get all the projects and initialize the first id
 let projects = getAllProjects()
 let id = 1
 // if there are saved projects, find the last ID available
 if (projects.length !== 0) {
  for (const key in projects) {
   if (Object.hasOwnProperty.call(projects, key)) {
    let projID = parseInt(projects[key].projectID)
    if (id <= projID) {
     id = projID
    }
   }
  }
  // incrememnt by 1 and return the string
  id = id += 1
  return formatID(id)
 }
 // otherwise there are no saved projects so assign first id
 return formatID(id)
}

/**
 * Funtion to format projectID to proper string format
 * Takes no prameters
 * @return {String} string representing the format of project number
 */
const formatID = (id) => {
 // hold an empty string
 let formattedID = id.toString()

 // add prefix 0's to the format
 if (id < 10) {
  formattedID = '00' + formattedID
 } else if (id >= 10 || id < 100) {
  formattedID = '0' + formattedID
 }

 // return teh formatted string
 return formattedID
}

/**
 * Function to validate dates
 * @param {String} start project start date
 * @param {String} end project end date
 * @param {String} elementID id of error msg element
 * @return {Boolean} true or false representing if valid or not
 */
const validateStartEndDates = (start, end, elementID) => {
 if (end < start) {
  const errorMsgSpan = document.getElementById(elementID)
  errorMsgSpan.style.color = 'red'
  errorMsgSpan.innerText = 'Error. The end date cannot be before the start date.'
  event.preventDefault()
  return false
 }
 return true
}

/**
 * Function to validate name (no duplicates)
 * @param {String} name project name
 * @param {String} elementID id of error msg element
 * @return {Boolean} true or false representing if valid or not
 */
const validateName = (name, elementID) => {

 // get all projects to check for any dupliate
 let projects = getAllProjects()

 // if there are projects, see if there is project with provided name
 if (projects.length !== 0) {
  for (const key in projects) {
   if (Object.hasOwnProperty.call(projects, key)) {
    let projName = projects[key].projectName
    if (name.toLowerCase() === projName.toLowerCase()) {
     const errorMsgSpan = document.getElementById(elementID)
     errorMsgSpan.style.color = 'red'
     errorMsgSpan.innerText = 'Error. A project already exists with this name.'
     event.preventDefault()
     return false
    }
   }
  }
 }
 return true
}

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
  response = confirmAction("delete all projects")
  // if the response was confirmed, then delete all records
  if (response === 'confirmed') {
   // clear the database
   localStorage.clear()
   alert("All projects have been deleted!")
   location.reload()
  }
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
Seed Hard Coded Data for Testing
*/

/**
 * Function to generate seed data from hardcoded information
 * Takes no paramters
 * Returns nothing
 */
const generateSeedData = () => {

 // arrays to store project details
 let projectIDs = ["001", "002", "003"]
 let projectNames = ["Create Repo", "Setup Server", "Setup DB"]
 let projectStartDates = ["2023-06-08", "2023-06-23", "2023-06-29"]
 let projectEndDates = ["2023-06-21", "2023-06-28", "2023-07-08"]
 let projectPriorities = ["Low", "High", "Medium"]
 let projectStatuses = ["Completed", "In Progress", "In Progress"]
 let projectAtRisk = ["No", "Yes", "No"]
 let projectOwner = ["Myself", "Joe", "Myself"]
 let projectNotes = ["Initialize Setup", "Test Config", "Create Fields"]
 let numberOfProjects = projectIDs.length

 // for each project, create object and set it to local storage database
 for (let i = 0; i < numberOfProjects; i++) {
  // get all current projects to add current project
  let savedProjects = getAllProjects()
  // create the object
  const project = {
   "projectID": projectIDs[i],
   "projectName": projectNames[i],
   "projectStartDate": projectStartDates[i],
   "projectEndDate": projectEndDates[i],
   "projectPriority": projectPriorities[i],
   "projectStatus": projectStatuses[i],
   "projectAtRisk": projectAtRisk[i],
   "projectOwner": projectOwner[i],
   "projectNotes": projectNotes[i]
  }
  // push the project to the saved projects and set in the database
  savedProjects.push(project)
  localStorage.setItem('projects', JSON.stringify(savedProjects))
  location.reload()
 }
}

/*
Event Listeners
*/

// add event listener for the button to genereate seed data
let genSeedDataBtn = document.getElementById("genSeedDataBtn")
genSeedDataBtn.addEventListener("click", generateSeedData)

// Event handler for the create project button
let createProjectBtn = document.getElementById("createProjectBtn")
createProjectBtn.addEventListener("click", createProject)

// Event Handler to delete all projects
let deleteAllProjBtn = document.getElementById("deleteAllProjBtn")
deleteAllProjBtn.addEventListener("click", deleteAllProjects)

// READ and display all project on the HTML
document.addEventListener("DOMContentLoaded", displayAllProjects())
