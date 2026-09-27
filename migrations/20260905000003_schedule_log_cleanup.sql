CREATE OR REPLACE PROCEDURE delete_old_logs()
LANGUAGE SQL
AS $$
 DELETE FROM log WHERE created_at < now() - INTERVAL '3 months';
$$;

DO $$
BEGIN
 IF EXISTS (SELECT 1 FROM pg_available_extensions WHERE name = 'pg_cron') THEN
  EXECUTE 'CREATE EXTENSION IF NOT EXISTS pg_cron';
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'delete-old-logs') THEN
   PERFORM cron.schedule('delete-old-logs', '0 0 * * *', 'CALL delete_old_logs()');
  END IF;
 END IF;
END
$$;
