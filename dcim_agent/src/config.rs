use serde::Deserialize;
use std::env;

#[derive(Debug, Deserialize, Clone)]
pub struct AgentConfig {
    pub agent_id: String,
    pub server_unique_id: String,
    pub api_endpoint: String,
    pub auth_token: String,
    pub heartbeat_interval_seconds: u64,
}

impl AgentConfig {
    pub fn load() -> Result<Self, config::ConfigError> {
        // Attempt to load from agent.toml first
        let builder = config::Config::builder()
            .add_source(config::File::with_name("agent.toml").required(false));

        // Override with environment variables if they exist
        let s = builder.add_source(
            config::Environment::with_prefix("DCIM_AGENT")
                .separator("__") // e.g., DCIM_AGENT__AGENT_ID
                .try_parsing(true)
        ).build()?;

        s.try_deserialize()
    }
}

// Helper function to get environment variable or use default
#[allow(dead_code)] // Keep for potential direct env usage if config file fails entirely
fn env_var_or_default(key: &str, default: String) -> String {
    env::var(key).unwrap_or(default)
}

// Example of how to load specific vars if not using config::Environment source
// pub fn load_from_env() -> Result<Self, String> {
//     Ok(AgentConfig {
//         agent_id: env::var("DCIM_AGENT_ID").map_err(|e| format!("Missing DCIM_AGENT_ID: {}", e))?,
//         server_unique_id: env::var("DCIM_AGENT_SERVER_UNIQUE_ID").map_err(|e| format!("Missing DCIM_AGENT_SERVER_UNIQUE_ID: {}", e))?,
//         api_endpoint: env::var("DCIM_AGENT_API_ENDPOINT").map_err(|e| format!("Missing DCIM_AGENT_API_ENDPOINT: {}", e))?,
//         auth_token: env::var("DCIM_AGENT_AUTH_TOKEN").map_err(|e| format!("Missing DCIM_AGENT_AUTH_TOKEN: {}", e))?,
//         heartbeat_interval_seconds: env::var("DCIM_AGENT_HEARTBEAT_INTERVAL_SECONDS")
//             .map_err(|e| format!("Missing DCIM_AGENT_HEARTBEAT_INTERVAL_SECONDS: {}", e))?
//             .parse::<u64>()
//             .map_err(|e| format!("Invalid DCIM_AGENT_HEARTBEAT_INTERVAL_SECONDS: {}", e))?,
//     })
// }
