import { exec as baseExec } from 'child_process'
import path from 'node:path'
import { fileURLToPath } from 'url'
import * as util from 'util'
import chalk from 'chalk'
import { Command } from 'commander'
import fse from 'fs-extra'
import { input } from '@inquirer/prompts'
import _ from 'lodash'
import { chalkTheme } from '../chalkTheme.js'
import { debugOption } from '../commonOptions.js'
import createConfigFiles from './createConfigFiles.js'

const exec = util.promisify(baseExec)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DO_NOTHING = false

export function getInitCommand() {
  const init = new Command('init')

  init
    .summary('create a new app')
    .description('initialize a new bildengine web app')
    .option('-n, --name <name>', 'app name')
    .addOption(debugOption)
    .option('--no-install-packages', 'install npm packages', true)
    .action(_.partial(handleInit, _, DO_NOTHING))

  return init
}

export async function handleInit(
  options: {
    readonly name?: string
    readonly debug?: boolean
    readonly installPackages?: boolean
  },
  doNothing = false,
  installPackages: boolean
) {
  let appName = ''

  if (options.name) {
    appName = options.name
  } else {
    console.log('You are about to initialize a webapp with bildengine 🚀')

    appName = await input({
      required: true,
      message: 'What do you want to name your app?',
      default: 'Prototype App',
    })
  }

  const { targetDir } = getDirs()

  await createConfigFiles({ targetDir, appName })
  // await createApp({
  //   appName,
  //   currentDir: process.env.INIT_CWD ?? process.cwd(),
  //   targetDir,
  //   doNothing,
  //   installPackages: options.installPackages ?? installPackages ?? true,
  // });
}

async function createApp({
  appName,
  currentDir,
  templateDir,
  targetDir,
  doNothing = false,
  installPackages = true,
}: {
  readonly appName: string
  readonly currentDir: string
  readonly templateDir: string
  readonly targetDir: string
  readonly doNothing: boolean
  readonly installPackages: boolean
}) {
  if (doNothing) {
    return null
  }
  console.log('Copying template files...')

  fse.copySync(templateDir, targetDir, {
    overwrite: false,
    errorOnExist: true,
  })

  console.log('-------\n')
  console.log(`🚀 Your new project has been initialized!\n`)
  console.log('-------\n')

  console.log('📋 ' + chalk.underline('Next Steps'))

  console.log(chalk('\n1. Navigate to your project folder:'))
  console.log(chalkTheme.code(`cd ${path.relative(currentDir, targetDir)}`))

  console.log(
    `\n2. Customize config files in the ${chalk.bold(
      'bildengine'
    )} folder (add models, pages, etc.)`
  )

  console.log(chalk(`\n3. Run your project locally`))
  console.log(chalkTheme.code(`npm run dev`))

  await createConfigFiles({ targetDir, appName })
  return null
}

async function remixInit() {
  console.log('Calling remix init...')
  const { stderr } = await exec('npx remix init')
  if (!stderr) {
    console.log('✅ Remix init successful')
  }
  return stderr
}

function getDirs() {
  const targetDir = process.cwd()

  return { targetDir }
}
