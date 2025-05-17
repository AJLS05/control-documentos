// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iqmktmholojhshzqdtvo.supabase.co' // reemplaza esto
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbWt0bWhvbG9qaHNoenFkdHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODU4NDQsImV4cCI6MjA2Mjc2MTg0NH0.Y5LjTxIJPuvQp3ucIBO_DJ8RkmUZTYbeeYja7wqJQQs'              // reemplaza esto

export const supabase = createClient(supabaseUrl, supabaseKey)
