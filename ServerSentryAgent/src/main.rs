use chrono::{DateTime, Utc};
use rand::Rng;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::collections::HashMap;
use std::time::Duration;
use tokio::time;

mod config; // Declare the config module
use config::AgentConfig;

#[derive(Debug, Serialize, Deserialize)]
struct DiskUsageInfo {
    total_gb: u64,
    used_gb: u64,
}

#[derive(Debug, Serialize, Deserialize)]
struct BandwidthUsageInfo {
    incoming_mbps: f64,
    outgoing_mbps: f64,
}

#[derive(Debug, Serialize)]
struct ResourceData {
    agent_id: String,
    server_unique_id: String,
    timestamp: String,
    cpu_usage: f64,
    ram_usage: f64, // Percentage
    disk_usage: HashMap<String, DiskUsageInfo>,
    bandwidth_usage: BandwidthUsageInfo,
}

fn generate_mock_cpu_usage() -> f64 {
    let mut rng = rand::thread_rng();
    rng.gen_range(0.0..100.0)
}

fn generate_mock_ram_usage() -> f64 {
    let mut rng = rand::thread_rng();
    rng.gen_range(0.0..100.0) // As percentage
}

fn generate_mock_disk_usage() -> HashMap<String, DiskUsageInfo> {
    let mut rng = rand::thread_rng();
    let mut usage = HashMap::new();
    let total_gb = rng.gen_range(100..1000);
    usage.insert(
        "/".to_string(),
        DiskUsageInfo {
            total_gb,
            used_gb: rng.gen_range(0..total_gb),
        },
    );
    // Add more mount points if needed
    // usage.insert("/mnt/data".to_string(), DiskUsageInfo { total_gb: 500, used_gb: rng.gen_range(0..500) });
    usage
}

fn generate_mock_bandwidth_usage() -> BandwidthUsageInfo {
    let mut rng = rand::thread_rng();
    BandwidthUsageInfo {
        incoming_mbps: rng.gen_range(0.0..1000.0),
        outgoing_mbps: rng.gen_range(0.0..500.0),
    }
}

#[tokio::main]
async fn main() {
    // Load configuration
    let agent_config = match AgentConfig::load() {
        Ok(cfg) => cfg,
        Err(e) => {
            eprintln!("Failed to load configuration: {}", e);
            // Fallback to environment variables if agent.toml is missing or incomplete
            // This part can be enhanced based on how strictly we want to enforce agent.toml
            // For now, we'll try to load directly from env if file fails.
            // Note: The current config.rs setup already tries to merge env vars.
            // This explicit fallback might be redundant or for cases where agent.toml is entirely absent.
            eprintln!("Attempting to load purely from environment variables as a fallback.");
            match AgentConfig::load() { // This will re-attempt, potentially re-showing error if env also insufficient
                Ok(cfg_env) => cfg_env,
                Err(env_e) => {
                     eprintln!("Failed to load configuration from environment variables as well: {}", env_e);
                     std::process::exit(1);
                }
            }
        }
    };

    println!("Configuration loaded: {:?}", agent_config);
    println!("ServerSentryAgent starting...");
    println!("API Endpoint: {}", agent_config.api_endpoint);
    println!("Agent ID: {}", agent_config.agent_id);
    println!("Server Unique ID: {}", agent_config.server_unique_id);
    println!(
        "Heartbeat Interval: {} seconds",
        agent_config.heartbeat_interval_seconds
    );

    let http_client = Client::new();
    let mut interval = time::interval(Duration::from_secs(agent_config.heartbeat_interval_seconds));

    loop {
        interval.tick().await;
        let now: DateTime<Utc> = Utc::now();

        let data = ResourceData {
            agent_id: agent_config.agent_id.clone(),
            server_unique_id: agent_config.server_unique_id.clone(),
            timestamp: now.to_rfc3339(),
            cpu_usage: generate_mock_cpu_usage(),
            ram_usage: generate_mock_ram_usage(),
            disk_usage: generate_mock_disk_usage(),
            bandwidth_usage: generate_mock_bandwidth_usage(),
        };

        println!("Collected data: {:?}", data);

        let payload = match serde_json::to_value(&data) {
            Ok(p) => p,
            Err(e) => {
                eprintln!("Failed to serialize data: {}", e);
                continue;
            }
        };
        
        println!("Sending payload: {}", payload.to_string());

        match http_client
            .post(&agent_config.api_endpoint)
            .header(
                "Authorization",
                format!("Token {}", agent_config.auth_token),
            )
            .json(&payload)
            .send()
            .await
        {
            Ok(response) => {
                if response.status().is_success() {
                    println!("Data sent successfully. Status: {}", response.status());
                    // Potentially log response body if needed for debugging
                    // let response_body = response.text().await;
                    // println!("Response body: {:?}", response_body);
                } else {
                    eprintln!("Failed to send data. Status: {}", response.status());
                    // Log more details if available
                    // let error_body = response.text().await;
                    // eprintln!("Error body: {:?}", error_body);
                }
            }
            Err(e) => {
                eprintln!("Error sending HTTP request: {}", e);
            }
        }
    }
}
