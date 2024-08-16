Feature: PrestaShop Demo Site Loading
  As a potential PrestaShop user
  I want to visit the PrestaShop demo site
  So that I can explore the features of a PrestaShop store

  Scenario: User visits the PrestaShop demo site
    Given the user navigates to the PrestaShop demo site
    When the loading screen appears
    Then the demo store should be visible
    And the user should see the fully loaded PrestaShop demo site
