import { createClient } from '@supabase/supabase-js';

// ==============================================================================
// SUPABASE CONFIGURATION
// Enter your Supabase Base Project URL (e.g. "https://xyz.supabase.co")
// Do NOT include "/rest/v1/" in the URL.
// ==============================================================================

const RAW_SUPABASE_URL = "https://ptspdkcudvvjnlvhkclm.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_qP_0aRdvmo-iKH3J_6W2xQ_WkhvaHrJ";

// Clean and sanitize the URL (strip /rest/v1/ and trailing slashes if present)
const SUPABASE_URL = RAW_SUPABASE_URL
  ? RAW_SUPABASE_URL.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '')
  : '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
