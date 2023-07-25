// Test for a connection to the html page
console.log('connected')

// enable JS strict mode to enforce stricter parsing
'use strict';

// local storage serves as database
const localStorage = window.localStorage

/*
READ (cRud) operation
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

 const notificationDiv = document.getElementById("notificationDiv");
 notificationDiv.setAttribute("class", "")

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
  let msg = 'Error. Please make sure you have provided a project name, dates, and owner.'
  showNotification("error", msg, "N/A", "N/A")
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
   const errorMsgSpan = document.getElementById("createFormErrorMsg")
   errorMsgSpan.innerText = ""
   savedProjects.push(project)
   localStorage.setItem('projects', JSON.stringify(savedProjects))
   // alert to notify success
   msg = `Success! Your new project has been saved.`
   showNotification("success", msg, projectID, projectName)
   event.preventDefault()
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
  errorMsg = 'Error. The end date cannot be before the start date.'
  errorMsgSpan.style.color = 'red'
  errorMsgSpan.innerText = errorMsg
  event.preventDefault()
  showNotification("error", errorMsg, "N/A", "N/A")
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
     errorMsg = 'Error. A project already exists with this name.'
     errorMsgSpan.style.color = 'red'
     errorMsgSpan.innerText = errorMsg
     event.preventDefault()
     showNotification("error", errorMsg, "N/A", "N/A")
     return false
    }
   }
  }
 }
 return true
}

/*
Handle Notification Pop Ups
*/

/**
 * Function to toggle the notification msg for display
 * Takes no parameters
 * Returns nothing
 */
const toggleFade = () => {
 const notificationDiv = document.getElementById("notificationDiv");
 const createNewProjectDiv = document.getElementById("createNewProjectDiv")
 notificationDiv.classList.toggle('fade')
 createNewProjectDiv.style.display = 'block'
}

/**
 * Function to remove the class attribute to remove the fade
 * Takes no parameters
 * Returns nothing
 */
const removeFade = () => {
 let notificationDiv = document.getElementById("notificationDiv");
 notificationDiv.setAttribute("class", "")
}

/**
 * Function to display notification pop up
 * @param {String} status 'success' if action succcessful
 * @param {String} textString message to display
 * @param {String} projID ID assigned to project to display
 * @param {String} projName name assigned to project to display
 * Returns nothing
 */
const showNotification = (status, textString, projID, projName) => {

 // grab elements to display
 const notificationDiv = document.getElementById("notificationDiv");
 const notificationProjID = document.getElementById("notificationProjID");
 const notificationProjName = document.getElementById("notificationProjName");
 const notification = document.getElementById("notification");
 const notificationAddNewBtn = document.getElementById("notificationAddNewBtn")
 const notificationContinueBtn = document.getElementById("notificationContinueBtn")
 const notificationViewAlltn = document.getElementById("notificationViewAlltn")
 const notificationResetBtn = document.getElementById("notificationResetBtn")

 const createNewProjectDiv = document.getElementById("createNewProjectDiv")
 createNewProjectDiv.style.display = 'none'

 // display successful notification
 notificationDiv.style.display = "block"
 notification.innerHTML = textString
 notificationProjID.value = `Project ID: ${projID}`
 notificationProjName.value = `Project Name: ${projName}`

 if (status === 'success') {
  notificationDiv.style.backgroundColor = 'green'
  notificationContinueBtn.style.display = 'none'
  notificationResetBtn.style.display = 'none'
  notificationAddNewBtn.style.display = 'block'
  notificationViewAlltn.style.display = 'block'
 } else {
  notificationDiv.style.backgroundColor = 'red'
  notificationContinueBtn.style.display = 'block'
  notificationResetBtn.style.display = 'block'
  notificationAddNewBtn.style.display = 'none'
  notificationViewAlltn.style.display = 'none'
 }
}

/**
 * Function reset all form inputs
 * Takes no parameters
 * Returns nothing
 */
const resetForm = () => {
 const createForm = document.getElementById("createForm")
 const createNewProjectDiv = document.getElementById("createNewProjectDiv")
 createNewProjectDiv.style.display = 'block'
 createForm.reset()
 toggleFade()
}

/**
 * Function to reset form and display form to add new proj
 * Takes no parameters
 * Returns nothing
 */
const confirmAddNew = () => {
 resetForm()
 createForm.style.display = 'block'
}

/**
 * Function to go to the navDashboard
 * Takes no parameters
 * Returns nothing
 */
const navDashboard = () => {
 window.location.href = "./index.html"
}

/*
Event Listeners
*/

// Event handler for the create project button
let createProjectBtn = document.getElementById("createProjectBtn")
createProjectBtn.addEventListener("click", createProject)

// Event handler for adding a new project
let notificationAddNewBtn = document.getElementById("notificationAddNewBtn")
notificationAddNewBtn.addEventListener("click", confirmAddNew)

// Event handler for viewing all projects
let notificationViewAlltn = document.getElementById("notificationViewAlltn")
notificationViewAlltn.addEventListener("click", navDashboard)

// Event handler for continuing with entry
let notificationContinueBtn = document.getElementById("notificationContinueBtn")
notificationContinueBtn.addEventListener("click", toggleFade)

// Event handler for reseting the input values
let notificationResetBtn = document.getElementById("notificationResetBtn")
notificationResetBtn.addEventListener("click", resetForm)