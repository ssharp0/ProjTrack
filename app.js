console.log('connected')

// local storage serves as database
const localStorage = window.localStorage

/*
READ (cRud) operation and helper functions
*/

// Function to get and return all projects from local storage db
const getAllProjects = () => {
 const savedProjects = JSON.parse(localStorage.getItem('projects')) || []
 return savedProjects
}

// Function to read and display all projects
const displayAllProjects = () => {
 // get all projects from db
 const savedProjects = getAllProjects()
 // if there are projects, insert the record in the table for display
 if (savedProjects.length !== 0) {
  savedProjects.forEach(project => {
   insertProjectRecord(project)
  })
 }
}

// function to insert a row into the projects table with the provided project details
const insertProjectRecord = (project) => {

 // get the project table element and insert a row at the end
 const projectTable = document.getElementById("projectsTable")
 let row = projectTable.insertRow(-1)

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

}

/*
Seed Hard Coded Data for Testing
*/

// Function to generate seed data from hardcoded information
const generateSeedData = () => {

 // arrays to store project details
 let projectIDs = ["001","002","003"]
 let projectNames = ["Create Repo", "Setup Server","Setup DB"]
 let projectStartDates = ["06/08/23", "06/23/23", "06/29/23"]
 let projectEndDates = ["06/21/23", "06/28/23", "07/08/23"]
 let projectPriorities = ["Low", "High", "Medium"]
 let projectStatuses = ["Completed", "In Progress", "In Progress"]
 let projectAtRisk = ["No", "Yes", "No"]
 let projectOwner = ["Myself", "Joe", "Myself"]
 let projectNotes = ["Initialize Setup", "Test Config", "Create Fields"]
 let numberOfProjects = projectIDs.length

 // for each project, create object and set it to local storage database
 for (let i = 0; i < numberOfProjects; i++) {
  // get all current projects to add current project
  const savedProjects = getAllProjects()
  // create the object
  const project = {
   "projectID": projectIDs[i],
   "projectName": projectNames[i],
   "projectStartDate" : projectStartDates[i],
   "projectEndDate" : projectEndDates[i],
   "projectPriority": projectPriorities[i],
   "projectStatus": projectStatuses[i],
   "projectAtRisk": projectAtRisk[i],
   "projectOwner": projectOwner[i],
   "projectNotes": projectNotes[i]
  }
  // push the project to the saved projects and set in the database
  savedProjects.push(project)
  localStorage.setItem('projects', JSON.stringify(savedProjects))
 }
}

/*
Event Listeners
*/

// add event listener for the button to genereate seed data
let genSeedDataBtn = document.getElementById("genSeedDataBtn")
genSeedDataBtn.addEventListener("click", generateSeedData)

// READ and display all project on the HTML
document.addEventListener("DOMContentLoaded", displayAllProjects())
