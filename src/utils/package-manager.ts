export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun'

export function buildInstallCommand(pm: PackageManager, packages: string[]): string {
  const pkgList = packages.join(' ')
  switch (pm) {
    case 'npm':
      return `npm install -D ${pkgList}`
    case 'yarn':
      return `yarn add -D ${pkgList}`
    case 'pnpm':
      return `pnpm add -D ${pkgList}`
    case 'bun':
      return `bun add -D ${pkgList}`
  }
}
