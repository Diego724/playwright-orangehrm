import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { AddUserPage } from "../pages/add-user.page";

test("Agregar usuario y guardar exitosamente", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const addUserPage = new AddUserPage(page);

  // Login primero
  await loginPage.goto();
  await loginPage.login("Admin", "admin123");
  await expect(page).toHaveURL(/dashboard/);

  // Navegar a la página de agregar usuario
  await addUserPage.goto();

  // Generar un username único usando timestamp
  const timestamp = Date.now();
  const username = `testuser${timestamp}`;
  const password = "Test123!@#";
  const employeeName = "Odis Adalwin"; // Empleado por defecto en la demo

  // Agregar usuario
  await addUserPage.addUser(employeeName, username, password, "Enabled");

  // Verificar que el usuario se guardó exitosamente
  const successMessage = await addUserPage.verifySuccessMessage();
  expect(successMessage).toBeTruthy();

  // Verificar que estamos de vuelta en la lista de usuarios
  await expect(page).toHaveURL(/viewSystemUsers/);
});

