import path from 'node:path'
import fse from 'fs-extra'

export default async function ({
  targetDir,
  secret,
  projectId,
}: {
  secret: string
  projectId: string
  targetDir: string
}) {
  const mainFile = `{
    "projectId": "${projectId}",
    "secret": "${secret}"
}
`

  fse.writeFileSync(path.join(targetDir, '.brainbuild'), mainFile)

  // todo: add to .gitignore
  try {
    // console.error('Error writing to .gitignore')
    const gitignorePath = path.join(targetDir, '.gitignore')
    let gitignoreContent = ''

    if (fse.existsSync(gitignorePath)) {
      gitignoreContent = fse.readFileSync(gitignorePath, 'utf-8')
    }

    if (!gitignoreContent.includes('.brainbuild')) {
      gitignoreContent += '\n.brainbuild\n'
      fse.writeFileSync(gitignorePath, gitignoreContent)
    }
  } catch (_error) {
    console.error('Error writing to .gitignore')
  }
}
