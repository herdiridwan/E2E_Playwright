import { test, expect } from '@playwright/test';
import LoginPage from '../pages/E2E/loginPage.js';
import DashboardPage from '../pages/E2E/dashboardPage.js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

test.describe('Technical Login Tests', () => {
    test.beforeEach(async ({ page }) => {
        console.log('Starting Test test case...');
    });

    test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status !== 'passed') {
            console.error(`❌ Test failed: ${testInfo.title}`);
            await page.screenshot({ path: `screenshots/${testInfo.title}.png`, fullPage: true });
        }
    });

    test('TC.001 - Login with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);

        try {
            await loginPage.goto();
            await loginPage.login(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
            console.log("Verifying dashboard visibility...");
            const isDashboardVisible = await dashboardPage.isDashboardVisible();
        } catch (error) {
            console.error('Test failed:', error);
            fs.writeFileSync('error.log', error.toString()); 
            throw error; 
        }
    });

    test('TC.002 - Login with invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        try {
            await loginPage.goto();
            await loginPage.login('invalidUser1', 'wrongPass1');

            const errorMsg = await loginPage.getErrorMessage();
            expect(errorMsg).toContain('Username and password do not match any user in this service');
        } catch (error) {
            fs.writeFileSync('error.log', error.toString()); 
            throw error; 
        }
    });

    test('TC.003 - Login with wrong password', async ({ page }) => {
        const loginPage = new LoginPage(page);

        try {
            await loginPage.goto();
            await loginPage.login(process.env.ADMIN_USERNAME, 'wrongPassword123');

            const errorMsg = await loginPage.getErrorMessage();
            expect(errorMsg).toContain('Username and password do not match any user in this service');
        } catch (error) {
            fs.writeFileSync('error.log', error.toString()); 
            throw error; 
        }
    });

    test('TC.004 - Login with wrong username', async ({ page }) => {
        const loginPage = new LoginPage(page);

        try {
            await loginPage.goto();
            await loginPage.login('wrongUsername', process.env.ADMIN_PASSWORD);

            const errorMsg = await loginPage.getErrorMessage();
            expect(errorMsg).toContain('Username and password do not match any user in this service');
        } catch (error) {
            fs.writeFileSync('error.log', error.toString()); 
            throw error; 
        }
    });

    test('TC.005 - Login with empty username', async ({ page }) => {
        const loginPage = new LoginPage(page);

        try {
            await loginPage.goto();
            await loginPage.login('', process.env.ADMIN_PASSWORD);

            const errorMsg = await loginPage.geterrorfield();
            expect(errorMsg).toContain('Username is required');
        } catch (error) {
            fs.writeFileSync('error.log', error.toString()); 
            throw error; 
        }
    });

    test('TC.006 - Login with empty password', async ({ page }) => {
        const loginPage = new LoginPage(page);

        try {
            await loginPage.goto();
            await loginPage.login(process.env.ADMIN_USERNAME, '');

            const errorMsg = await loginPage.geterrorfield();
            expect(errorMsg).toContain('Password is required');
        } catch (error) {
            fs.writeFileSync('error.log', error.toString()); 
            throw error; 
        }
    });

    test('TC.007 - Login with empty username and password', async ({ page }) => {
        const loginPage = new LoginPage(page);

        try {
            await loginPage.goto();
            await loginPage.login('', '');

            const errorMsg = await loginPage.geterrorfield();
            expect(errorMsg).toEqual('Username is required');
        } catch (error) {
            fs.writeFileSync('error.log', error.toString()); 
            throw error; 
        }
    });

    test('TC.008 - Login with special character in username', async ({ page }) => {
        const loginPage = new LoginPage(page);

        try {
            await loginPage.goto();
            await loginPage.login('admin@#$', process.env.ADMIN_PASSWORD);

            const errorMsg = await loginPage.getErrorMessage();
            expect(errorMsg).toContain('Username and password do not match any user in this service');
        } catch (error) {
            fs.writeFileSync('error.log', error.toString()); 
            throw error; 
        }
    });

    test('TC.009 - Login with special character in password', async ({ page }) => {
        const loginPage = new LoginPage(page);

        try {
            await loginPage.goto();
            await loginPage.login(process.env.ADMIN_USERNAME, 'P@ssw0rd!@#$%^&*');

            const errorMsg = await loginPage.getErrorMessage();
            expect(errorMsg).toContain('Username and password do not match any user in this service');
        } catch (error) {
            fs.writeFileSync('error.log', error.toString()); 
            throw error; 
        }
    });

    test('TC.010 - Login with SQL Injection', async ({ page }) => {
        const loginPage = new LoginPage(page);

        try {
            await loginPage.goto();
            await loginPage.login("admin' OR 1=1 --", 'password');

            const errorMsg = await loginPage.getErrorMessage();
            expect(errorMsg).toContain('Username and password do not match any user in this service');
        } catch (error) {
            fs.writeFileSync('error.log', error.toString()); 
            throw error; 
        }
    });

    test('TC.011 - Login Looping invalid Password (Brute Force)', async ({ page }) => {
        const loginPage = new LoginPage(page);
        try {
            await loginPage.goto();

            for (let i = 0; i < 6; i++) {
                await loginPage.login(process.env.ADMIN_USERNAME, `wrongPass${i}`);
            }

            const errorMsg = await loginPage.getErrorMessage();
            expect(errorMsg).toContain('Username and password do not match any user in this service');
        } catch (error) {
            fs.writeFileSync('error.log', error.toString()); 
            throw error; 
        }
    });

    test('TC.012 - Login until get expired token', async ({ page }) => {
        const loginPage = new LoginPage(page);

        try {
            await loginPage.goto();
            await loginPage.login(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

            await page.waitForTimeout(3600000); 

            await page.reload();
            const errorMsg = await loginPage.getErrorMessage();
            expect(errorMsg).toContain('Session expired. Please login again.');
        } catch (error) {
            fs.writeFileSync('error.log', error.toString()); 
            throw error; 
        }
    });
});