import { program } from 'commander'
import { getInitCommand } from './init/init.js'

export default async function () {
  const program = createProgram()
  await program.parseAsync(process.argv)
}

export function createProgram() {
  program.name('brainbuild').description('CLI to rapidly create web apps')

  program.addCommand(getInitCommand())

  return program
}
