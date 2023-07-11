console.log('connected')

// local storage serves as database
const localStorage = window.localStorage

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
  // get the saved projects, if empty start with empty array
  const savedProjects = JSON.parse(localStorage.getItem('projects')) || []
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

// add event listener for the button to genereate seed data
let genSeedDataBtn = document.getElementById("genSeedDataBtn")
genSeedDataBtn.addEventListener("click", generateSeedData)
