import fse from 'fs-extra'
import path from 'node:path'

export async function createPage({
  route,
  contents,
  targetDir,
}: {
  route: string
  contents: string
  targetDir: string
}) {
  const appDir = path.join(targetDir, 'app')
  const pageDir = path.join(appDir, route)
  const pagePath = path.join(pageDir, 'index.tsx')
  return fse.writeFile(pagePath, contents)
}
