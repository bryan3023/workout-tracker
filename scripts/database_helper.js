const
  fs = require("fs"),
  path = require("path"),
  { execFileSync } = require("child_process"),
  inquirer = require("inquirer")


/*
  Get the MySQL root password so users are not prompted for each script.
 */
async function getMySqlRootPassword() {
  const {root} = await inquirer.prompt([
    {
      message: "MySQL local instance root password:",
      type: "password",
      mask: true,
      name: "root"
    }
  ])
  return root
}


/*
  Run a SQL script as root with the provided password. If a database
  name is provided, run the script under that schema.
 */
function runMySqlScript(scriptName, rootPassword, databaseName) {
  const
    mySqlCommand = mySqlExecutable[process.platform](),
    script = getMySqlScript(scriptName)

  if (!mySqlCommand) return console.error("MySQL not found. Aborting.")
  if (!script) return console.log(`Script '${scriptName} not found. Skipping.`)

  const stdin = fs.readFileSync(script, {encoding: "utf8"})

  let arguments = [
    '-u',
    'root',
    `--password=${rootPassword}`
  ]

  if (databaseName) arguments = [...arguments, databaseName]

  execFileSync(mySqlCommand, arguments, {input: stdin})
}


/*
  Get the full path of the SQL script. Return null if it doesn't exist.
 */
function getMySqlScript(scriptName) {
  const
    scriptRoot = path.join(__dirname, "../db"),
    scriptFile = path.join(scriptRoot, scriptName),
    scriptExists = fs.existsSync(scriptFile)

  return scriptExists ? scriptFile : false
}



/*
  Lookup the MySQL command executable by platform.
 */
const mySqlExecutable = {
  'darwin': getMySqlExecutableMac,
  'win32': getMySqlExecutableWindows
}


/*
  Get the path of MySQL on a Mac. Return false if not found.
 */
function getMySqlExecutableMac() {
  const
    mySqlPath = "/usr/local/mysql/bin/mysql",
    mySqlInstalled = fs.existsSync(mySqlPath)

  return mySqlInstalled ? mySqlPath : false
}


/*
  Get the path of MySQL on Windwos. Return false if not found.
  TODO: this path is (major?) version specific. Need to support wildcards.
 */
function getMySqlExecutableWindows() {
  const
    mySqlPath = "C://Program Files//MySQL//MySQL Server 8.0//bin//mysql.exe",
    mySqlInstalled = fs.existsSync(mySqlPath)

  return mySqlInstalled ? mySqlPath : false
}


module.exports = {
  getMySqlRootPassword,
  runMySqlScript
}
