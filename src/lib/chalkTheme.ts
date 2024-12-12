import chalk from 'chalk'

export const chalkTheme = {
  code: (input: string) => chalk.grey('$ ') + chalk(input),
}
