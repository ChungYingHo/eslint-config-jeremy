export interface ConfigOptions {
  typescript: boolean
  frameworks: Array<'vue' | 'astro'>
  absolutePath: boolean
  fileExtension: 'js' | 'mjs'
}
