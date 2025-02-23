import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const filesToFix = [
  'src/components/chat/ChatList.tsx',
  'src/components/courses/ModuleList.tsx',
  'src/components/posts/PostEditor.tsx',
  'src/components/posts/PostPreview.tsx',
  'src/components/Sidebar.tsx',
  'src/components/threads/ThreadEditor.tsx',
  'src/components/threads/ThreadList.tsx',
  'src/components/tools/ToolLayout.tsx',
  'src/components/ui/LoadingSpinner.tsx',
  'src/pages/AdminDashboard.tsx',
  'src/pages/Community.tsx',
  'src/pages/Messages.tsx',
  'src/pages/Profile.tsx',
  'src/pages/Settings.tsx',
  'src/pages/Tools.tsx',
];

// Run ESLint fix on each file
filesToFix.forEach(file => {
  try {
    console.log(`Fixing imports in ${file}...`);
    execSync(`npx eslint --fix ${file}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error fixing ${file}:`, error);
  }
});

console.log('Import fixes completed!');
