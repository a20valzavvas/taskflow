## ADDED Requirements

### Requirement: Switch color theme
The system SHALL allow users to switch between two color palettes (earthy and rose).

#### Scenario: Switch to rose theme
- **WHEN** user clicks the rose color swatch
- **THEN** all components update to the rose palette instantly without page reload

#### Scenario: Switch to earthy theme
- **WHEN** user clicks the earthy color swatch
- **THEN** all components update to the earthy palette instantly without page reload

### Requirement: Persist selected theme
The system SHALL persist the user's theme preference across sessions.

#### Scenario: Theme persistence
- **WHEN** user selects a theme and reloads the page
- **THEN** the previously selected theme is restored

### Requirement: SSR-safe theme initialization
The system SHALL initialize the theme without causing server-side rendering errors.

#### Scenario: Safe localStorage access
- **WHEN** the app initializes
- **THEN** localStorage is only accessed on the client side via import.meta.client guard
