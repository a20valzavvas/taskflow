## ADDED Requirements

### Requirement: Chat with AI assistant
The system SHALL provide a chat panel where users can send messages to an AI assistant.

#### Scenario: Send message
- **WHEN** user types a message and submits the chat form
- **THEN** message appears in the chat history and a loading indicator is shown

#### Scenario: Receive response
- **WHEN** the API call to Groq completes
- **THEN** assistant response appears in the chat history and loading indicator disappears

#### Scenario: API error
- **WHEN** the Groq API call fails
- **THEN** an error message is shown in the chat without breaking the UI

### Requirement: Task context injection
The system SHALL automatically include the user's active tasks in every request to the AI assistant.

#### Scenario: Context sent with message
- **WHEN** user sends a message with active tasks present
- **THEN** the server receives the full list of active tasks alongside the message

#### Scenario: No active tasks
- **WHEN** user sends a message with no active tasks
- **THEN** assistant receives "No hi ha tasques actives" as context

### Requirement: Secure API key handling
The system SHALL never expose the Groq API key to the client.

#### Scenario: API key on server only
- **WHEN** a chat request is made
- **THEN** the API key is read from server-side runtimeConfig and never included in client responses

### Requirement: Conversation history
The system SHALL maintain conversation history within a session.

#### Scenario: Multi-turn conversation
- **WHEN** user sends multiple messages in the same session
- **THEN** each request includes the full prior conversation history so the assistant can refer to previous context
