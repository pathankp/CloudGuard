# ServerSentryAgent

This is a lightweight Rust-based agent, ServerSentryAgent, for a Data Center Infrastructure Management (DCIM) system. It collects (currently mock) server resource usage data and sends it to a central backend.

## Features

*   Collects mock data for CPU, RAM, disk, and network usage.
*   Sends data periodically to a configurable backend API endpoint.
*   Configurable via `agent.toml` file or environment variables.
*   Uses token-based authentication.

## Configuration

The agent can be configured in two ways:

1.  **`agent.toml` file (Recommended):**
    Create an `agent.toml` file in the same directory as the ServerSentryAgent executable (or the project root when running with `cargo run`).

    **Sample `agent.toml`:**
    ```toml
    agent_id = "agent-001-prod"
    server_unique_id = "server-xyz-789-prod"
    api_endpoint = "http://your-dcim-backend.com/api/resource-usage/" # Target API endpoint
    auth_token = "your_secret_api_token_here"
    heartbeat_interval_seconds = 60 
    ```

2.  **Environment Variables:**
    You can override or provide configuration options using environment variables prefixed with `DCIM_AGENT__`.

    *   `DCIM_AGENT__AGENT_ID`
    *   `DCIM_AGENT__SERVER_UNIQUE_ID`
    *   `DCIM_AGENT__API_ENDPOINT`
    *   `DCIM_AGENT__AUTH_TOKEN`
    *   `DCIM_AGENT__HEARTBEAT_INTERVAL_SECONDS`

    **Example (Linux/macOS):**
    ```bash
    export DCIM_AGENT__AGENT_ID="agent-env-002"
    export DCIM_AGENT__API_ENDPOINT="http://localhost:8000/api/resource-usage/"
    export DCIM_AGENT__AUTH_TOKEN="env_token_123"
    # ... and other variables
    ```
    The ServerSentryAgent prioritizes environment variables over the `agent.toml` file if both are present for a given setting.

## Building and Running

### Prerequisites
*   Rust and Cargo (latest stable version recommended). Install from [rustup.rs](https://rustup.rs/).

### Build
Navigate to the `dcim_agent` project directory and run:
```bash
cargo build
```
For a release build (optimized):
```bash
cargo build --release
```
The executable will be located at `target/debug/ServerSentryAgent` or `target/release/ServerSentryAgent`.

### Run
After building, you can run the agent directly:
```bash
./target/debug/ServerSentryAgent 
```
Or, if you have a release build:
```bash
./target/release/ServerSentryAgent
```
Alternatively, you can run directly using Cargo (useful for development):
```bash
cargo run
```
Ensure your `agent.toml` is correctly configured in the project root when using `cargo run`, or that environment variables are set.

## JSON Payload Structure

The ServerSentryAgent sends a JSON payload to the `api_endpoint` with the following structure:

```json
{
  "agent_id": "agent-001-dev",
  "server_unique_id": "server-abc-123-dev",
  "timestamp": "2023-10-27T10:30:00Z", // ISO 8601 format
  "cpu_usage": 75.5, // Percentage
  "ram_usage": 60.2, // Percentage
  "disk_usage": {
    "/": {
      "total_gb": 500,
      "used_gb": 250
    }
    // Potentially other mount points
  },
  "bandwidth_usage": {
    "incoming_mbps": 150.75,
    "outgoing_mbps": 45.5
  }
}
```

## Dependencies

The ServerSentryAgent relies on the following main Rust crates:

*   `tokio`: Asynchronous runtime.
*   `reqwest`: HTTP client for sending data.
*   `serde` & `serde_json`: For JSON serialization and deserialization.
*   `config`: For managing configuration from files and environment variables.
*   `chrono`: For timestamp generation.
*   `rand`: For generating mock data.
*   `dotenv`: For loading environment variables from a `.env` file (though `config` crate handles direct env var reading).

See `Cargo.toml` for a full list of dependencies and versions.
