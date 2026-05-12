## Purpose

Enables TaskFlow to be installed as a Progressive Web App (PWA) on any device. Provides a valid web app manifest with branding assets so the app can run in standalone mode.

## Requirements

### Requirement: PWA installable
The system SHALL be installable as a native app on any device.

#### Scenario: Install prompt
- **WHEN** user visits the app in a supported browser
- **THEN** the browser shows an install prompt

#### Scenario: Standalone display
- **WHEN** user opens the installed PWA
- **THEN** app runs in standalone mode without browser UI

### Requirement: PWA manifest
The system SHALL provide a valid web app manifest with name, icons and theme color.

#### Scenario: Manifest present
- **WHEN** browser fetches the app manifest
- **THEN** manifest includes name "TaskFlow", short_name, theme_color "#6F7356" and icon paths for 192x192 and 512x512
