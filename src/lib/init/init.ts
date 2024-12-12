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

export async function handleInit(options: { readonly debug?: boolean }) {
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
  console.log('-------\n')
  console.log(`🚀 Your new project has been initialized!\n`)
  console.log('-------\n')
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

  // fse.copySync(templateDir, targetDir, {
  //   overwrite: false,
  //   errorOnExist: true,
  // })

  console.log(chalkTheme.code(`npm run dev`))

  return null
}

function getDirs() {
  const targetDir = process.cwd()

  return { targetDir }
}
