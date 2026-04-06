-- Execute this block in your Supabase SQL Editor to create the queue_data table

CREATE TABLE queue_data (
    id SERIAL PRIMARY KEY,
    patients INTEGER NOT NULL,
    doctors INTEGER NOT NULL,
    avg_time FLOAT NOT NULL,
    wait_time FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
