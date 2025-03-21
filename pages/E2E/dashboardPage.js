class DashboardPage {
    constructor(page) {
        if (!page) throw new Error("Page instance is required!");
        this.page = page;
        this.dashboardHeader    = page.locator('.app_logo');
        this.inventoryList      = page.locator('.inventory_list');
        this.isOnDashboard      = page.url() === 'https://www.saucedemo.com/inventory.html';
    
    }

    async isDashboardVisible() {
        try {
            await this.dashboardHeader.isVisible();
            await this.inventoryList.isVisible();

        } catch (error) {
            console.error("❌ Error checking dashboard visibility:", error);
            return false; // Pastikan return false jika terjadi error
        }
    }
}

export default DashboardPage;