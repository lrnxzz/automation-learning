// cypress/support/e2e.ts

// Importando comandos customizados
import './commands';

// Configurações globais
Cypress.on('uncaught:exception', (err, runnable) => {
  // Impede que Cypress falhe nos testes devido a exceções não capturadas
  return false;
});
