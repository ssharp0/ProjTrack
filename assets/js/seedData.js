// Test for a connection to the html page
console.log('connected')

// enable JS strict mode to enforce stricter parsing
'use strict';

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
 * Funtion to get a random value from a provided array
 * @param {Array} randomList array with random values
 * @return {String} random value
 */
const getRandom = (randomList) => {
 // calcualte a random number and then get a random value from array
 let randomNum = Math.floor(Math.random() * randomList.length)
 let randomValue = randomList[randomNum]
 return randomValue
}

/**
 * Funtion to create a random number of projects
 * Takes no parameters
 * Returns nothing
 */
const generateRandomSeedData = () => {

 // the number of projects to generate
 const numberOfProj = 10

 // create a random project until all projects created
 for (let i = 0; i < numberOfProj; i++) {

  // get all current projects and random start and end dates
  let savedProjects = getAllProjects()
  let randomDates = getRandomDates()

  // create random project with random details
  const project = {
   "projectID": assignID(),
   "projectName": getRandomProjName(),
   "projectStartDate": randomDates["randomStartDate"],
   "projectEndDate": randomDates["randomEndDate"],
   "projectPriority": getRandomPriority(),
   "projectStatus": getRandomStatus(),
   "projectAtRisk": getRandomRisk(),
   "projectOwner": getRandomOwner(),
   "projectNotes": getRandomNotes()
  }

  // push the project to the saved projects and set in the database
  savedProjects.push(project)
  localStorage.setItem('projects', JSON.stringify(savedProjects))

 }

 // reload the window to display all projects
 msg = `${numberOfProj} projects have been randomly created!`
 localStorage.setItem("feedbackMsg", msg)
 location.reload()

}

/**
 * Function to get a random project name
 * Takes no parameters
 * @return {String} random value
 */
const getRandomProjName = () => {

 // array of random project names
 const randomProjNamesList = [
  "Create",
  "Repo",
  "Setup",
  "Server",
  "DB",
  "Test",
  "CRUD",
  "Configure",
  "Testing",
  "Update",
  "Document",
  "Review",
  "Findings",
  "Tracker",
  "Fix",
  "Bugs",
  "B2B",
  "Integration",
  "Connect",
  "Modules",
  "Prepare",
  "Sprint",
  "Code",
  "Audit",
  "Ship",
  "Product",
  "IDE"
 ]

 // initialize the random length
 let randomValue = ''
 let tempValue = ''
 let minLen = 1
 let maxLen = 4
 let randLen = Math.floor(Math.random() * (maxLen - minLen + 1) + minLen)

 // generate the random string of words
 for (let i = 0; i < randLen; i++) {
  tempValue = getRandom(randomProjNamesList)
  if (i!= 0) {
   randomValue = randomValue + ' ' + tempValue
  } else {
   randomValue = tempValue
  }
 }

 // check if name exists to adjust it, return the random value
 randomValue = checkDuplicateName(randomValue)
 return randomValue

}

/**
 * Function to check if random name already exists, add random digit if so
 * @param {String} randomValue random value string
 * @return {String} random value
 */
const checkDuplicateName = (randomValue) => {
 // get all the saved projects
 let savedProjects = getAllProjects()
 // for each project see if the name already exists, if so add random number to end
 savedProjects.forEach(project => {
  if (project.projectName === randomValue) {
   while (project.projectName === randomValue) {    
    let minNum = 1
    let maxNum = 1000
    let randLen = Math.floor(Math.random() * (maxNum - minNum + 1) + minNum)
    randomValue += randLen
   }
  }
 })
 // return the random value
 return randomValue
}


/**
 * Function to get random dates
 * Takes no parameters
 * @return {Object} random values
 */
const getRandomDates = () => {

 // initalize the start and end dates
 const start = new Date(2023, 0, 1)
 const end = new Date(2024, 0, 1)

 // create random start and end dates such that end is after start
 let randomStartDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
 let randomEndDate = new Date(randomStartDate.getTime() + Math.random() * (end.getTime() - randomStartDate.getTime()))

 // set the object and return it in the proper format YYYY-MM-DD
 const dates = {
  'randomStartDate': randomStartDate.toISOString().split('T')[0],
  'randomEndDate': randomEndDate.toISOString().split('T')[0]
 }

 // return the dates object
 return dates

}

/**
 * Function to get random priority
 * Takes no parameters
 * @return {String} random value
 */
const getRandomPriority = () => {

 // priority array options
 const priorityList = [
  "Low",
  "Medium",
  "High"
 ]

 // get a random value and return it
 let randomValue = getRandom(priorityList)
 return randomValue

}

/**
 * Function to get random status
 * Takes no parameters
 * @return {String} random value
 */
const getRandomStatus = () => {

 // status array options
 const statusList = [
  "Not Started",
  "In Progress",
  "Completed"
 ]

 // get a random value and return it
 let randomValue = getRandom(statusList)
 return randomValue

}

/**
 * Function to get random risk
 * Takes no parameters
 * @return {String} random value
 */
const getRandomRisk = () => {

 // Function to get random risk
 const riskList = [
  "Yes",
  "No"
 ]

 // get a random value and return it
 let randomValue = getRandom(riskList)
 return randomValue

}

/**
 * Function to get random owner
 * Takes no parameters
 * @return {String} random value
 */
const getRandomOwner = () => {

 // array containing random names
 const randomNamesList = [
  "Abby",
  "Bobby",
  "Dakota",
  "Johnny",
  "Mateo",
  "Sammy",
  "Zackary"
 ]

 // get random value and return it
 let randomValue = getRandom(randomNamesList)
 return randomValue

}

/**
 * Function to get random notes
 * Takes no parameters
 * @return {String} random value
 */
const getRandomNotes= () => {

 // array containing random notes
 const randomNotesList = [
  "Validate everything.",
  "Initialize the setup.",
  "Connect with the project team.",
  "Review with members.",
  "Revisit soon.",
  "Layout next steps.",
  "Check meeting notes."
 ]

 // get random value and return it
 let randomValue = getRandom(randomNotesList)
 return randomValue

}


/*
Event Listeners
*/

// add event listener for the button to genereate random seed data
let genSeedDataBtn = document.getElementById("genSeedDataBtn")
genSeedDataBtn.addEventListener("click", generateRandomSeedData)