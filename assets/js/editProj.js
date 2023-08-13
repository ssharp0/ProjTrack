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
 * Function to edit a new project object
 * Takes no parameters
 * @return {Object} project object with details
 */
const editProjObj = () => {

 // grab form informaiton
 let projectID = document.getElementById("editProjectID").value
 let projectName = document.getElementById("editProjectName").value
 let projectStartDate = document.getElementById("editProjectStartDate").value
 let projectEndDate = document.getElementById("editProjectEndDate").value
 let projectPriority = document.getElementById("editProjectPriority").value
 let projectStatus = document.getElementById("editProjectStatus").value
 let projectAtRisk = document.getElementById("editProjectAtRisk").value
 let projectOwner = document.getElementById("editProjectOwner").value
 let projectNotes = document.getElementById("editProjectNotes").value

 // assign the object keys and values
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
 * Function to validate the form
 * @param {Object} project project object with project details
 * @return {Boolean} return true if no errors, otherwise false
 */
const validateForm = (project) => {

 // notify the user of missing required fields, if any
 if (!project.projectName || !project.projectStartDate || !project.projectEndDate || !project.projectOwner) {
  let msg = 'Error. Please provide a project name, dates, and owner.'
  const errorMsgSpan = document.getElementById("editFormErrorMsg")
  errorMsgSpan.style.color = 'red'
  errorMsgSpan.innerText = 'Error. Please make sure you have provided a project name, dates, and owner.'
  event.preventDefault()
  return false
 } else {
  // check for valid dates and names
  validDate = validateStartEndDates(project.projectStartDate, project.projectEndDate, "editFormErrorMsg")
  validName = validateName(project.projectName, "editFormErrorMsg")
  // if the name and dates are valid, add project to database
  if (validDate && validName) {
   // get all the saved projects
   let savedProjects = getAllProjects()
   const errorMsgSpan = document.getElementById("editFormErrorMsg")
   errorMsgSpan.innerText = ""
   // alert to notify success
   msg = `Success! Your project ${project.projectID} has been edited and saved.`
   setFeedbackMsg(msg)
   event.preventDefault()
   return true
  }
 }

}

/**
 * Funtion to set the message to display
 * @param msg message to display
 * Returns nothing
 */
const setFeedbackMsg = (msg) => {
 localStorage.setItem("feedbackMsg", msg)
}

/**
 * Funtion to remove feedback message
 * Takes no pramters
 * Returns nothing
 */
const removefeedbackMsg = () => {
 localStorage.removeItem("feedbackMsg")
}

/**
 * Function to submit the edit to update the record in the database
 * Takes no parameters
 * Returns nothing
 */
const submitEdit = () => {

 // Fetch all the forms we want to apply custom Bootstrap validation styles to
 const forms = document.querySelectorAll('.needs-validation')
 const editProjForm = document.getElementById("editForm")

 // ccreate the edited project object and check for validation (i.e. no missing fields)
 let project = editProjObj()
 let validated = validateForm(project)

 // stop the default for the form action if boostrap validation or internal validation fails
 editProjForm.addEventListener("click", event => {
  if (!editProjForm.checkValidity() || !validated) {
   event.preventDefault()
   event.stopPropagation()
  }
  editProjForm.classList.add('was-validated')

  // if the form passes validation then make the edits in the database
  if (validated) {

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

 // remove the key reflecting index from local storage
 localStorage.removeItem("editProjIndex")

 // prevent the default and navigate back
 event.preventDefault()
 window.location.href = "./dashboard.html"
   
  }
 }, false)
}

/**
 * Function to validate dates
 * @param {String} start project start date
 * @param {String} end project end date
 * @param {String} elementID id of error msg element
 * @return {Boolean} true or false representing if valid or not
 */
const validateStartEndDates = (start, end, elementID) => {
 // if end date is before start date display error
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

 // get the current project id
 let currentProjID = document.getElementById("editProjectID").value

 // if there are projects, see if there is project with provided name
 if (projects.length !== 0) {
  // get the project names
  for (const key in projects) {
   if (Object.hasOwnProperty.call(projects, key)) {
    let projName = projects[key].projectName
    let projID = projects[key].projectID
    // if the updated name matches with another existing project then display error
    if (name.toLowerCase() === projName.toLowerCase() && currentProjID !== projID) {
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

/**
 * Function to go to the navDashboard
 * Takes no parameters
 * Returns nothing
 */
const navDashboard = () => {
 window.location.href = "./dashboard.html"
}

/**
 * Function to set all input values to null
 * Takes no parameters
 * Returns nothing
 */
const resetFormValues = () => {
 const editForm = document.getElementById("editForm")
 editForm.reset()
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

 // populate edit form with current project details
 populateEditForm()

 // remove any exisitng feedback
 removefeedbackMsg()

 // enable boostrap popover
 enablePopover()

}

/*
Event Listeners
*/

// submit the updated details
let editProjectBtn = document.getElementById("editProjectBtn")
editProjectBtn.addEventListener("click", submitEdit)

// reset form values
let editProjectResetBtn = document.getElementById("editProjectResetBtn")
editProjectResetBtn.addEventListener("click", resetFormValues)

// Event listener to cancel form entry
let editProjectCancelBtn = document.getElementById("editProjectCancelBtn")
editProjectCancelBtn.addEventListener("click", navDashboard)

// Display project details for editing
document.addEventListener("DOMContentLoaded", displayFormPage)