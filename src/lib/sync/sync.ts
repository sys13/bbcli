import { Command } from 'commander'
import fs from 'fs'
import path from 'path'
import { z } from 'zod'
import { debugOption } from '../commonOptions.js'

const BASE_URL = 'https://www.brainbuildai.com'
// const BASE_URL = 'http://localhost:3000'

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
  standardFiles: z.array(
    z.object({
      content: z.string(),
      name: z.string(),
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

export async function handleSync() {
  const { targetDir } = getDirs()

  // read the .brainbuild file to get the secret and projectId
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
  const { pages, standardFiles } = parsedResponse.data

  for (const page of pages) {
    const pageDir = path.join(targetDir, 'app', page.route)
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true })
    }
    const filePath = path.join(pageDir, 'page.tsx')

    // todo: check if the file already exists and prompt the user to overwrite

    fs.writeFileSync(filePath, page.fileText)
  }

  for (const page of standardFiles) {
    const pageDir = path.join(targetDir, 'components')
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true })
    }
    const filePath = path.join(pageDir, page.name)

    fs.writeFileSync(filePath, page.content)
  }

  console.log('Synced with BrainBuild')
}

function getDirs() {
  const targetDir = process.cwd()

  return { targetDir }
}
