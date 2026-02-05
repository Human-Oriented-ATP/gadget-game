CREATE TABLE bug_reports (
    id SERIAL PRIMARY KEY,
    user_message TEXT NOT NULL,
    player_id VARCHAR(255) NOT NULL,
    config VARCHAR(255),
    problem_id VARCHAR(255),
    history JSONB,
    environment JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
