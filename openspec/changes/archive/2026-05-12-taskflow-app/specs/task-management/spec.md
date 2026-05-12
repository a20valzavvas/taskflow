## ADDED Requirements

### Requirement: Create task
The system SHALL allow users to create tasks with title (required), description (optional), priority (high/medium/low) and due date (optional).

#### Scenario: Successful task creation
- **WHEN** user fills the title field and submits the form
- **THEN** a new task appears at the top of the list with status "active"

#### Scenario: Task creation with all fields
- **WHEN** user fills title, description, priority and due date and submits
- **THEN** task is created with all provided data and persisted to localStorage

#### Scenario: Empty title submission
- **WHEN** user submits the form with an empty title
- **THEN** form validation prevents submission

### Requirement: Complete task
The system SHALL allow users to toggle task completion status.

#### Scenario: Mark as completed
- **WHEN** user clicks the circle button on an active task
- **THEN** task status changes to "completed" and card shows strikethrough text and reduced opacity

#### Scenario: Reactivate task
- **WHEN** user clicks the check button on a completed task
- **THEN** task status returns to "active"

### Requirement: Delete task
The system SHALL allow users to permanently delete a task.

#### Scenario: Task deletion
- **WHEN** user clicks the trash icon on a task
- **THEN** task is removed from the list and from localStorage

### Requirement: Filter tasks
The system SHALL allow filtering tasks by status and priority simultaneously.

#### Scenario: Filter by status
- **WHEN** user selects "Actives" filter
- **THEN** only tasks with status "active" are shown

#### Scenario: Filter by priority
- **WHEN** user selects "Alta" priority filter
- **THEN** only tasks with priority "high" are shown

#### Scenario: Combined filter
- **WHEN** user selects both a status and a priority filter
- **THEN** only tasks matching both criteria are shown

### Requirement: Persist tasks
The system SHALL persist tasks to localStorage and restore them on page reload.

#### Scenario: Persistence across reload
- **WHEN** user creates tasks and reloads the page
- **THEN** all tasks are restored from localStorage
