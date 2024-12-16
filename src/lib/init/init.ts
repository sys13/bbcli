import { input } from '@inquirer/prompts'
import { Command } from 'commander'
import { chalkTheme } from '../chalkTheme.js'
import { debugOption } from '../commonOptions.js'
import createConfigFiles from './createConfigFiles.js'

// const exec = util.promisify(baseExec)
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// const DO_NOTHING = false

export function getInitCommand() {
  const init = new Command('init')

  init
    .summary('create a new app')
    // .description('initialize a new bildengine web app')
    // .option('-n, --name <name>', 'app name')
    .addOption(debugOption)
    .action(handleInit)

  return init
}

export async function handleInit() {
  const { targetDir } = getDirs()

  const secret = await input({
    message: 'Enter your secret key',
    required: true,
  })
  const projectId = await input({
    message: 'Enter your project id',
    required: true,
  })

  await createConfigFiles({ targetDir, secret, projectId })
  console.log(`\n🚀 Your new project has been initialized!\n`)
  console.log(`Next, run:\n${chalkTheme.code('npx brainbuild sync')} `)
}

function getDirs() {
  const targetDir = process.cwd()

  return { targetDir }
}
