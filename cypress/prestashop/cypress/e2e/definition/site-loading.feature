Feature: PrestaShop Demo Site Loading
  As a PrestaShop user
  I want to visit the PrestaShop demo site
  So that I can explore its features
  
  Scenario: User visits the PrestaShop demo site
    Given the user navigates to the PrestaShop demo site
    When the loading screen element appears
    Then the loading screen element should disappear after the site finishes loading