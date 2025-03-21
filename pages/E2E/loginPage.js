export default class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.errorMessage = page.locator('[data-test="error"]');
        this.errorField = page.getByText('Required').first(); 
    }

    async goto() {
        await this.page.goto(`${process.env.BASE_URL}/`);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.page.waitForLoadState('networkidle'); 
    }

    async getErrorMessage() {
        return this.errorMessage.isVisible() ? await this.errorMessage.textContent() : null;
    }

    async geterrorfield() {
        await this.errorField.waitFor({ timeout: 5000 }); 
        return await this.errorField.textContent();
    }
}