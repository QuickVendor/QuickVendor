-- Create user if it doesn't exist
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles 
      WHERE  rolname = 'quickvendor_user') THEN
      
      CREATE ROLE quickvendor_user LOGIN PASSWORD 'quickvendor_password';
   END IF;
END
$do$;

-- Make sure the user is a superuser for development
ALTER USER quickvendor_user WITH SUPERUSER;

