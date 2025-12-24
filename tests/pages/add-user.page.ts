export class AddUserPage {
  constructor(private page) {}

  async goto() {
    await this.page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers"
    );
  }

  async clickAddButton() {
    await this.page.getByRole("button", { name: "Add" }).click();
    await this.page.waitForLoadState("networkidle");
  }

  async selectEmployee(employeeName: string) {
    const employeeInput = this.page
      .locator(".oxd-input-group")
      .filter({ hasText: "Employee Name" })
      .getByPlaceholder("Type for hints...");

    await employeeInput.fill(employeeName);
    await this.page.waitForTimeout(1500);

    // Esperar a que aparezcan las opciones y seleccionar la primera
    await this.page.waitForSelector(".oxd-autocomplete-option", {
      state: "visible",
    });
    await this.page.locator(".oxd-autocomplete-option").first().click();
  }

  async fillUsername(username: string) {
    await this.page
      .locator(".oxd-input-group")
      .filter({ hasText: "Username" })
      .getByRole("textbox")
      .fill(username);
  }

  async fillPassword(password: string) {
    const passwordInputs = this.page
      .locator(".oxd-input-group")
      .filter({ hasText: "Password" })
      .getByRole("textbox");

    await passwordInputs.first().fill(password);
  }

  async confirmPassword(password: string) {
    await this.page
      .locator(".oxd-input-group")
      .filter({ hasText: "Confirm Password" })
      .getByRole("textbox")
      .fill(password);
  }

  async selectStatus(status: "Enabled" | "Disabled") {
    await this.page
      .locator(".oxd-input-group")
      .filter({ hasText: "Status" })
      .getByRole("combobox")
      .click();

    await this.page.waitForSelector(".oxd-select-option", {
      state: "visible",
    });
    await this.page.getByRole("option", { name: status }).click();
  }

  async clickSave() {
    await this.page.getByRole("button", { name: "Save" }).click();
    await this.page.waitForLoadState("networkidle");
  }

  async addUser(
    employeeName: string,
    username: string,
    password: string,
    status: "Enabled" | "Disabled" = "Enabled"
  ) {
    await this.clickAddButton();
    await this.selectEmployee(employeeName);
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.confirmPassword(password);
    await this.selectStatus(status);
    await this.clickSave();
  }

  async verifySuccessMessage() {
    await this.page.waitForSelector(".oxd-toast-container", {
      state: "visible",
      timeout: 10000,
    });
    return await this.page
      .locator(".oxd-toast-container")
      .getByText("Successfully Saved")
      .isVisible();
  }
}
