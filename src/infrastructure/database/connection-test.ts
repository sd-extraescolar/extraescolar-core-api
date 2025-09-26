import { AppDataSource } from './data-source';

export async function testDatabaseConnection(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection successful');
    
    const result = await AppDataSource.query('SELECT 1 as test');
    console.log('✅ Database query test successful:', result);
    
    await AppDataSource.destroy();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}
