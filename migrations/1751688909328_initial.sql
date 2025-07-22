CREATE TABLE study_data (
    player_id VARCHAR(255) NOT NULL,
    problem_id VARCHAR(255) NOT NULL,
    config VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL,
    start TIMESTAMP NOT NULL,
    latest TIMESTAMP NOT NULL,
    history JSONB NOT NULL,
    CONSTRAINT study_data_player_id_problem_id_start_key UNIQUE (player_id, problem_id, start)
);

CREATE TABLE questionnaire_responses (
    respondent_id VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    education_level INTEGER,
    math_training INTEGER,
    math_regularity INTEGER,
    specialty TEXT,
    first_language VARCHAR(255),
    prolific_id VARCHAR(255),
    feedback TEXT,
    difficulty INTEGER,
    enjoyableness INTEGER,
    strategies TEXT,
    feedback2 TEXT,
    skipped TEXT
);