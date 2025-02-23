import { execSync } from 'child_process';

const filesToFix = [
  'src/components/posts/PostPreview.tsx',
  'src/components/Sidebar.tsx',
  'src/components/threads/ThreadEditor.tsx',
  'src/components/threads/ThreadList.tsx',
  'src/components/tools/ToolLayout.tsx',
  'src/components/ui/LoadingSpinner.tsx',
  'src/contexts/CourseContext.tsx',
  'src/pages/AdminDashboard.tsx',
  'src/pages/Community.tsx',
  'src/pages/CourseModule.tsx',
  'src/pages/Courses.tsx',
  'src/pages/Messages.tsx',
  'src/pages/Profile.tsx',
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
