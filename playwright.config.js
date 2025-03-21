import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config(); 

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.test.js', '**/*.test.api.js'],
  retries: 2,
  timeout: 30000,
  reporter: [
    ['list'], 
    ['allure-playwright']
  ],
  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',  
    trace: 'on',
    headless: false, 
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    }
  }

});