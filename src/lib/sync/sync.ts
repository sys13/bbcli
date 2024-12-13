import { Command } from 'commander'
import fs from 'fs'
import path from 'path'
import { z } from 'zod'
import { debugOption } from '../commonOptions.js'

// const URL = 'https://www.brainbuildai.com'
const BASE_URL = 'http://localhost:3000'

const BB_CONFIG_SCHEMA = z.object({
  projectId: z.string(),
  secret: z.string(),
})

const RESPONSE_SCHEMA = z.object({
  pages: z.array(
    z.object({
      fileText: z.string(),
      route: z.string(),
    })
  ),
})

export function getSyncCommand() {
  const command = new Command('sync')

  command
    .summary('sync with BrainBuild')
    // .description('initialize a new bildengine web app')
    // .option('-n, --name <name>', 'app name')
    .addOption(debugOption)
    .action(handleSync)

  return command
}

// interface PagesResponse {
// 	pages: {
// 		fileText: string
// 		route: string
// 	}[]
// }

export async function handleSync() {
  const { targetDir } = getDirs()
  // todo: read the .brainbuild file to get the secret and projectId
  const brainbuildConfigPath = path.join(targetDir, '.brainbuild')
  if (!fs.existsSync(brainbuildConfigPath)) {
    throw new Error('Missing .brainbuild configuration file')
  }

  const fileContents = fs.readFileSync(brainbuildConfigPath, 'utf-8')
  const brainbuildConfig = JSON.parse(fileContents) as unknown

  const results = BB_CONFIG_SCHEMA.safeParse(brainbuildConfig)
  if (!results.success) {
    throw new Error(
      'Invalid .brainbuild configuration file, run `npx brainbuild init` to reinitialize'
    )
  }

  const { secret, projectId } = results.data

  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const response = await fetch(BASE_URL + '/resources/get-code-files', {
    method: 'POST',
    body: JSON.stringify({ secret, projectId }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    console.error('Failed to fetch code files:', response.statusText)
    return
  }

  const responseData = await response.json()
  const parsedResponse = RESPONSE_SCHEMA.safeParse(responseData)
  if (!parsedResponse.success) {
    console.error('Invalid response from server:', parsedResponse.error)
    return
  }

  console.log('Fetched code files:', responseData)
}

function getDirs() {
  const targetDir = process.cwd()

  return { targetDir }
}

// fse.copySync(templateDir, targetDir, {
//   overwrite: false,
//   errorOnExist: true,
// })

// console.log(chalkTheme.code(`npm run dev`))
