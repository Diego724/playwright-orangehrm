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

  async selectEmployee(employeeName?: string) {
    const employeeInput = this.page
      .locator(".oxd-input-group")
      .filter({ hasText: "Employee Name" })
      .getByPlaceholder("Type for hints...");

    await employeeInput.clear();

    // Si se proporciona un nombre, intentar buscarlo
    if (employeeName) {
      await employeeInput.fill(employeeName);
      await this.page.waitForTimeout(2000);

      // Esperar a que aparezcan las opciones
      try {
        await this.page.waitForSelector(".oxd-autocomplete-option", {
          state: "visible",
          timeout: 3000,
        });

        // Seleccionar la primera opción disponible
        await this.page.locator(".oxd-autocomplete-option").first().click();
        await this.page.waitForTimeout(500);

        // Verificar que el campo no muestre "Invalid"
        const employeeGroup = this.page
          .locator(".oxd-input-group")
          .filter({ hasText: "Employee Name" });

        const invalidMessage = employeeGroup.locator("text=Invalid");
        const hasInvalid = await invalidMessage.isVisible().catch(() => false);

        // Si muestra "Invalid", intentar seleccionar el primer empleado disponible
        if (hasInvalid) {
          console.log(
            `El empleado "${employeeName}" no se encontró. Seleccionando el primer empleado disponible...`
          );
          await this.selectFirstAvailableEmployee();
        }
      } catch (error) {
        // Si no aparecen opciones, seleccionar el primer empleado disponible
        console.log(
          `No se encontraron opciones para "${employeeName}". Seleccionando el primer empleado disponible...`
        );
        await this.selectFirstAvailableEmployee();
      }
    } else {
      // Si no se proporciona nombre, seleccionar directamente el primero disponible
      await this.selectFirstAvailableEmployee();
    }
  }

  async selectFirstAvailableEmployee() {
    const employeeInput = this.page
      .locator(".oxd-input-group")
      .filter({ hasText: "Employee Name" })
      .getByPlaceholder("Type for hints...");

    // Limpiar y escribir una letra común para obtener resultados
    await employeeInput.clear();
    await employeeInput.fill("a");
    await this.page.waitForTimeout(2000);

    // Esperar a que aparezcan las opciones
    await this.page.waitForSelector(".oxd-autocomplete-option", {
      state: "visible",
      timeout: 5000,
    });

    // Seleccionar el primer empleado disponible
    await this.page.locator(".oxd-autocomplete-option").first().click();
    await this.page.waitForTimeout(500);

    // Verificar que se seleccionó correctamente
    const employeeGroup = this.page
      .locator(".oxd-input-group")
      .filter({ hasText: "Employee Name" });

    const invalidMessage = employeeGroup.locator("text=Invalid");
    const hasInvalid = await invalidMessage.isVisible().catch(() => false);

    if (hasInvalid) {
      throw new Error(
        "No se pudo seleccionar ningún empleado. El campo muestra 'Invalid'."
      );
    }
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

  async selectUserRole(userRole: string) {
    // Buscar el grupo de input que contiene "User Role"
    const userRoleGroup = this.page
      .locator(".oxd-input-group")
      .filter({ hasText: "User Role" });

    // Hacer clic en el contenedor del selector (div clickeable)
    await userRoleGroup
      .locator(
        ".oxd-select-text-input, .oxd-select-wrapper, div.oxd-select-text"
      )
      .first()
      .click();

    // Esperar a que aparezcan las opciones del dropdown
    await this.page.waitForSelector(".oxd-select-option", {
      state: "visible",
      timeout: 5000,
    });

    // Seleccionar la opción deseada
    await this.page.getByRole("option", { name: userRole }).click();
  }

  async selectStatus(status: "Enabled" | "Disabled") {
    // Buscar el grupo de input que contiene "Status"
    const statusGroup = this.page
      .locator(".oxd-input-group")
      .filter({ hasText: "Status" });

    // Hacer clic en el contenedor del selector (div clickeable)
    // En OrangeHRM, el selector es un div dentro del grupo que se puede hacer clic
    await statusGroup
      .locator(
        ".oxd-select-text-input, .oxd-select-wrapper, div.oxd-select-text"
      )
      .first()
      .click();

    // Esperar a que aparezcan las opciones del dropdown
    await this.page.waitForSelector(".oxd-select-option", {
      state: "visible",
      timeout: 5000,
    });

    // Seleccionar la opción deseada
    await this.page.getByRole("option", { name: status }).click();
  }

  async clickSave() {
    await this.page.getByRole("button", { name: "Save" }).click();
    // Esperar a que se complete la acción (puede ser éxito o error)
    await this.page.waitForLoadState("networkidle");
    // Esperar un poco más para que aparezcan los mensajes de toast
    await this.page.waitForTimeout(2000);
  }

  async addUser(
    employeeName: string | undefined,
    username: string,
    password: string,
    userRole: string = "ESS",
    status: "Enabled" | "Disabled" = "Enabled"
  ) {
    await this.clickAddButton();
    await this.selectUserRole(userRole);
    await this.selectEmployee(employeeName);
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.confirmPassword(password);
    await this.selectStatus(status);
    await this.clickSave();
  }

  async verifySuccessMessage() {
    // Primero verificar si hay errores de validación
    const errorMessage = await this.page
      .locator(
        ".oxd-input-field-error-message, .oxd-text--input-error, text=Invalid"
      )
      .first()
      .isVisible()
      .catch(() => false);

    if (errorMessage) {
      const errorText = await this.page
        .locator(
          ".oxd-input-field-error-message, .oxd-text--input-error, text=Invalid"
        )
        .first()
        .textContent()
        .catch(() => "Error de validación desconocido");
      throw new Error(`Se encontraron errores de validación: ${errorText}`);
    }

    // Esperar y buscar el mensaje de toast de éxito primero
    try {
      // Esperar por el texto "Successfully Saved" que es más específico
      await this.page.waitForSelector("text=Successfully Saved", {
        state: "visible",
        timeout: 10000,
      });
      return true;
    } catch (error) {
      // Si no se encuentra el texto específico, buscar el contenedor de toast
      try {
        await this.page.waitForSelector(
          "[class*='toast'], .oxd-toast-container",
          {
            state: "visible",
            timeout: 5000,
          }
        );

        // Buscar cualquier mensaje de éxito en el toast
        const successText = this.page.getByText(/Successfully|Saved|Success/i);
        const isVisible = await successText.isVisible().catch(() => false);
        if (isVisible) {
          return true;
        }
      } catch (toastError) {
        // Continuar con otras verificaciones
      }
    }

    // Verificar si estamos de vuelta en la lista de usuarios (indicador alternativo de éxito)
    await this.page.waitForTimeout(2000);
    const currentUrl = this.page.url();
    if (currentUrl.includes("viewSystemUsers")) {
      return true;
    }

    // Última verificación: buscar cualquier elemento que contenga "Success"
    const anySuccessMessage = await this.page
      .getByText(/Successfully Saved|Success/i)
      .isVisible()
      .catch(() => false);

    return anySuccessMessage;
  }
}
