import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

test("Login Exitoso con Credenciales válidas", async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();
  await login.login("Admin", "admin123");

  await expect(page).toHaveURL(/dashboard/);
});
