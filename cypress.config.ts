import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        table(message) {
          console.table(message)
          return null
        },
      })
    },
    supportFile: 'cypress/e2e/support.ts',
  },
})
