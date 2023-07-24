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
Event Listeners
*/

// Event handler for the create project button
let createProjectBtn = document.getElementById("createProjectBtn")
createProjectBtn.addEventListener("click", createProject)
