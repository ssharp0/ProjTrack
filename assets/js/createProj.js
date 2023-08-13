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
 * Function to create a new project object
 * Takes no parameters
 * @return {Object} project object with details
 */
const createProjObj = () => {

 // assign a project ID and grab the form information
 let projectID = assignID()
 let projectName = document.getElementById("createProjectName").value
 let projectStartDate = document.getElementById("createProjectStartDate").value
 let projectEndDate = document.getElementById("createProjectEndDate").value
 let projectPriority = document.getElementById("createProjectPriority").value
 let projectStatus = document.getElementById("createProjectStatus").value
 let projectAtRisk = document.getElementById("createProjectAtRisk").value
 let projectOwner = document.getElementById("createProjectOwner").value
 let projectNotes = document.getElementById("createProjectNotes").value

 // create the object
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

 // return the project with all the details
 return project

}

/**
 * Function to create a new project record
 * in order to create (CREATE) the data
 * Takes no parameters
 * Returns nothing
 */
const createProject = () => {

 // Fetch all the forms we want to apply custom Bootstrap validation styles to
 const forms = document.querySelectorAll('.needs-validation')
 const createProjForm = document.getElementById("createForm")

 // create the project object and check for validation (i.e. no missing fields)
 let project = createProjObj()
 let validated = validateForm(project)

 // stop the default for the form action if boostrap validation or internal validation fails
 createProjForm.addEventListener("click", event => {
  if (!createProjForm.checkValidity() || !validated) {
   event.preventDefault()
   event.stopPropagation()
  }
  createProjForm.classList.add('was-validated')
 }, false)

}

/**
 * Function to validate the form
 * @param {Object} project project object with project details
 * @return {Boolean} return true if no errors, otherwise false
 */
const validateForm = (project) => {

 // notify the user of missing required fields, if any
 if (!project.projectName || !project.projectStartDate || !project.projectEndDate || !project.projectOwner) {
  let msg = 'Error. Please provide a project name, dates, and owner.'
  const errorMsgSpan = document.getElementById("createFormErrorMsg")
  errorMsgSpan.style.color = 'red'
  errorMsgSpan.innerText = 'Error. Please make sure you have provided a project name, dates, and owner.'
  event.preventDefault()
  return false
 } else {
  // check for valid dates and names
  validDate = validateStartEndDates(project.projectStartDate, project.projectEndDate, "createFormErrorMsg")
  validName = validateName(project.projectName, "createFormErrorMsg")
  // if the name and dates are valid, add project to database
  if (validDate && validName) {
   // get all the saved projects
   let savedProjects = getAllProjects()
   const errorMsgSpan = document.getElementById("createFormErrorMsg")
   errorMsgSpan.innerText = ""
   savedProjects.push(project)
   localStorage.setItem('projects', JSON.stringify(savedProjects))
   // alert to notify success
   msg = `Success! Your new project has been saved.`
   showNotification("success", msg, project.projectID, project.projectName)
   event.preventDefault()
   return true
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
  notificationContinueBtn.style.display = 'none'
  notificationResetBtn.style.display = 'none'
  notificationAddNewBtn.style.display = 'block'
  notificationViewAlltn.style.display = 'block'
  notification.style.color = 'green'
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
 resetFormValues()
 const createNewProjectDiv = document.getElementById("createNewProjectDiv")
 createNewProjectDiv.style.display = 'block'
 toggleFade()
}

/**
 * Function to reset form and display form to add new proj
 * Takes no parameters
 * Returns nothing
 */
const confirmAddNew = () => {
 resetForm()
 location.reload()
 createForm.style.display = 'block'
}

/**
 * Function to go to the navDashboard
 * Takes no parameters
 * Returns nothing
 */
const navDashboard = () => {
 window.location.href = "./dashboard.html"
}

/**
 * Function to set the forms start and end dates as current date
 * Takes no parameters
 * Returns nothing
 */
const setDefaultFormDates = () => {

 // get the form elements
 const projectStartDate = document.getElementById("createProjectStartDate")
 const projectEndDate = document.getElementById("createProjectEndDate")

 // get the current date
 let today = new Date()
 let year = today.getFullYear().toString()
 let month = (today.getMonth() + 1).toString().padStart(2, 0)
 let day = today.getDate().toString().padStart(2, 0)

 // reformat the date
 todayFormatted = year + '-' + month + '-' + day

 // update the form with the current date
 projectStartDate.value = todayFormatted
 projectEndDate.value = todayFormatted

}

/**
 * Function to generate the list of project owners for dropdown
 * Takes no parameters
 * Returns nothing
 */
const genDataListProjOwners = () => {

 // get all saved projects and initialize an empty array
 let savedProjects = getAllProjects()
 let owners = []

 // for each saved project, add the owner to the array (not duplicated)
 savedProjects.forEach(project => {
  owner = project['projectOwner']
  if (owners.indexOf(owner) === -1) {
   owners.push(owner)
  }
 })

 // sort the array a-z
 owners.sort()

 // get the elements to update on the form
 const projectOwner = document.getElementById("createProjectOwner")
 const projectOwnerOptions = document.getElementById("createProjectOwnerOptions")
 projectOwner.innerHTML = ''

 // for each owner, insert the option html
 owners.forEach(owner => {
  let optionElement = document.createElement("option")
  optionElement.setAttribute("value", owner)
  projectOwnerOptions.appendChild(optionElement)
 })

}

/**
 * Function to set all input values to null
 * Takes no parameters
 * Returns nothing
 */
const resetFormValues = () => {
 const createForm = document.getElementById("createForm")
 createForm.reset()
}

/**
 * Function to enable the form informational popover
 * Takes no parameters
 * Returns nothing
 */
const enablePopover = () => {
 // enable the form popover
 const formInfoPopover = document.getElementById("formInfoPopover")
 new bootstrap.Popover(formInfoPopover)
}

/**
 * Function to call methods to display information on page
 * Takes no parameters
 * Returns nothing
 */
const displayFormPage = () => {

 // set the default form dates
 setDefaultFormDates()

 // generate the list of project owners in the form
 genDataListProjOwners()

 // enable form popover
 enablePopover()

 // count text area text
 countTextChar()

}

/**
 * Function to count the input text in text area form
 * Takes no parameters
 * Returns nothing
 */
const countTextChar = () => {
 projNotesEl = document.getElementById("createProjectNotes")
 projNotesAllowedLen = projNotesEl.maxLength
 projNotesLen = projNotesEl.value.length
 charCounterEl = document.getElementById("charCounter")
 charCounterEl.innerHTML = `Characters Remaining: ${projNotesAllowedLen - projNotesLen}`
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

// Event handler for reseting the input values when adding a new project
let notificationResetBtn = document.getElementById("notificationResetBtn")
notificationResetBtn.addEventListener("click", resetForm)

// Event handler to reset all form values
let createProjectResetBtn = document.getElementById("createProjectResetBtn")
createProjectResetBtn.addEventListener("click", resetFormValues)

// Event listener to count character input in text area
let createProjectNotesTxtArea = document.getElementById("createProjectNotes")
createProjectNotesTxtArea.addEventListener("keyup", countTextChar)

// Event listener to cancel form entry
let createProjectCancelBtn = document.getElementById("createProjectCancelBtn")
createProjectCancelBtn.addEventListener("click", navDashboard)

// Event listener to display dates and generate project owners when page is loaded
document.addEventListener("DOMContentLoaded", displayFormPage)