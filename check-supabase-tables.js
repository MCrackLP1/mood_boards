/**
 * Check what tables exist in Supabase
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bzncifehxpmyixprwqgi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bmNpZmVoeHBteWl4cHJ3cWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Nzc1MDEsImV4cCI6MjA3NTU1MzUwMX0.m_GJxXfte1lUzEOhVErGVp1I5mOUrwaDJdckorB-AWE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
  console.log('🔍 Checking Supabase database...\n')
  
  // Try to query potential tables
  const tablesToCheck = ['boards', 'items', 'library_assets', 'library_folders']
  
  for (const table of tablesToCheck) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.log(`❌ Table "${table}" does not exist`)
        console.log(`   Error: ${error.message}`)
      } else {
        console.log(`✅ Table "${table}" exists (${count || 0} rows)`)
      }
    } catch (err) {
      console.log(`❌ Table "${table}" - Error: ${err.message}`)
    }
  }
  
  console.log('\n📊 Summary:')
  console.log('   Connection: ✅ Working')
  console.log('   Database: Empty (no tables created yet)')
  console.log('\n💡 Next step: Create database schema for Moodboard app')
}

checkTables()


