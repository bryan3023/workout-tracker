const
  fs = require("fs"),
  path = require("path"),
  { execFileSync, spawnSync } = require("child_process"),
  stream = require('stream'),
  inquirer = require("inquirer")


/*
  Get local MySQL root credentials so users are not prompted for each script.
 */
async function getMySqlRootCredentials() {
  const credentials = await inquirer.prompt([
    {
      message: "MySQL local instance root username:",
      default: "root",
      name: "username"
    },
    {
      type: "password",
      message: "MySQL local instance root password:",
      mask: true,
      name: "password"
    }
  ])
  return credentials
}


/*
  Run a SQL script as root with the provided password. If a database
  name is provided, run the script under that schema.
 */
function runMySqlScript(scriptName, credentials, databaseName) {
  const passwordWarning = "[Warning] Using a password on the command line interface can be insecure."

  const
    mySqlCommand = mySqlExecutable[process.platform](),
    script = getMySqlScript(scriptName),
    stdout = new stream.Writable(),
    stderr = new stream.Writable()

  if (!mySqlCommand) return console.error("MySQL not found. Aborting.")
  if (!script) return console.log(`Script '${scriptName}' not found. Skipping.`)

  const stdin = fs.readFileSync(script, {encoding: "utf8"})

  stdout._write = data => console.log(data.toString())
  stderr._write = data => console.log(data.toString())

  let arguments = [
    '-u',
    credentials.username,
    `--password=${credentials.password}`
  ]

  if (databaseName) arguments = [...arguments, databaseName]

  console.log(`Running: '${script}'`)

  const mySql = execFileSync(mySqlCommand, arguments, {
    input: stdin,
    stdio: [null, 'inherit', 'inherit']
  })  
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
  getMySqlRootCredentials,
  runMySqlScript
}
