-- Create additional databases if needed
CREATE DATABASE quickvendor_test_db;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE quickvendor_db TO quickvendor_user;
GRANT ALL PRIVILEGES ON DATABASE quickvendor_test_db TO quickvendor_user;

-- Create extensions
\c quickvendor_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c quickvendor_test_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";