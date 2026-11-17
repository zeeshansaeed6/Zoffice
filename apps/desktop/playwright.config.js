import { defineConfig } from '@playwright/test'

// Inherited from some IDE hosts; makes Electron run as plain Node and fail to launch.
delete process.env.ELECTRON_RUN_AS_NODE
export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  expect: {
    timeout: 15000,
  },
  workers: 1,
  reporter: 'list',
})
