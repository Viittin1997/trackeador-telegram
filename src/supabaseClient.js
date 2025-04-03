import { createClient } from '@supabase/supabase-js';

// Atualizando para usar as mesmas credenciais que estão no App.js
const supabaseUrl = 'https://apidb.meumenu2023.uk';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzAzMzg2ODAwLAogICJleHAiOiAxODYxMjM5NjAwCn0.kU_d1xlxfuEgkYMC0mYoiZHQpUvRE2EnilTZ7S0bfIM';

export const supabase = createClient(supabaseUrl, supabaseKey);
