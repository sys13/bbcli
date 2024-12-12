import path from 'node:path'
import fse from 'fs-extra'

export default async function ({
  targetDir,
  appName,
}: {
  readonly targetDir: string
  readonly appName: string
}) {
  const mainFile = `
${appName}
    `

  fse.writeFileSync(path.join(targetDir, '.brainbuild'), mainFile)
}
