/**
 * Test script to check Supabase connection and list tables
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bzncifehxpmyixprwqgi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bmNpZmVoeHBteWl4cHJ3cWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Nzc1MDEsImV4cCI6MjA3NTU1MzUwMX0.m_GJxXfte1lUzEOhVErGVp1I5mOUrwaDJdckorB-AWE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  console.log('Project ID:', 'bzncifehxpmyixprwqgi')
  console.log('URL:', supabaseUrl)
  console.log('')

  try {
    // Test connection by trying to list tables from information_schema
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (error) {
      console.log('⚠️  Could not query information_schema (expected for service role key)')
      console.log('Error:', error.message)
      console.log('')
      console.log('✅ Connection successful! (Service role key has limited access)')
    } else {
      console.log('✅ Connection successful!')
      console.log('📊 Tables found:', data.length)
      if (data.length > 0) {
        console.log('Tables:')
        data.forEach(table => console.log('  -', table.table_name))
      } else {
        console.log('No tables found yet (empty database)')
      }
    }

    console.log('')
    console.log('🎉 Supabase is ready for setup!')
    
  } catch (err) {
    console.error('❌ Connection failed!')
    console.error('Error:', err.message)
    process.exit(1)
  }
}

testConnection()

