import { DatabaseService } from './db'

export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...')
    
    // Test fetching producers
    const producers = await DatabaseService.getProducers()
    console.log('✅ Successfully connected to database')
    console.log('📊 Found producers:', producers?.length || 0)
    
    return {
      success: true,
      producersCount: producers?.length || 0,
      producers: producers
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}