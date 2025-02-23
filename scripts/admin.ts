import { config } from 'dotenv';
import { createTestAdmin, deleteTestAdmin } from '../src/lib/admin';

// Load environment variables
config();

async function main() {
  const action = process.argv[2]?.toLowerCase();

  if (!action || !['create', 'delete'].includes(action)) {
    console.log('Usage: npm run admin [create|delete]');
    process.exit(1);
  }

  try {
    if (action === 'create') {
      const result = await createTestAdmin();
      console.log(result.message);
    } else {
      const result = await deleteTestAdmin();
      console.log(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
