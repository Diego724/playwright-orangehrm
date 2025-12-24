export class LoginPage {
  constructor(private page) {}

  async goto() {
    await this.page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
  }

  async login(user: string, pass: string) {
    await this.page.getByPlaceholder("Username").fill(user);
    await this.page.getByPlaceholder("Password").fill(pass);
    await this.page.getByRole("button", { name: "Login" }).click();
  }
}
