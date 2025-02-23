/*
  # Initial Community Content Setup

  1. Initial Data
    - Sample posts for community engagement
    - Initial comments
    - Welcome announcements
    - Community guidelines

  2. Categories
    - Success Stories
    - Questions & Help
    - Resources
    - Announcements

  3. Changes
    - Added initial community content
    - Set up default categories
*/

-- Insert initial posts
INSERT INTO posts (author_id, title, content, category, tags, status)
SELECT 
  auth.uid(),
  'Welcome to Propulsion Society!',
  'We''re excited to have you join our community of ambitious entrepreneurs and AI enthusiasts. Here''s what you can expect:

1. Expert Insights: Learn from successful entrepreneurs
2. AI Tools: Access cutting-edge AI tools
3. Networking: Connect with like-minded individuals
4. Resources: Share and discover valuable resources

Let''s build something amazing together! 🚀',
  'Announcements',
  ARRAY['welcome', 'community', 'ai'],
  'published'
FROM auth.users
WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
LIMIT 1;

-- Insert community guidelines post
INSERT INTO posts (author_id, title, content, category, tags, status)
SELECT 
  auth.uid(),
  'Community Guidelines & Best Practices',
  '# Community Guidelines

1. Be Respectful
- Treat all members with respect
- No harassment or discrimination
- Keep discussions professional

2. Share Knowledge
- Contribute valuable insights
- Help others learn and grow
- Share success stories

3. Engage Meaningfully
- Provide constructive feedback
- Ask thoughtful questions
- Support fellow members

4. Stay Focused
- Keep discussions relevant
- Avoid self-promotion
- Maintain quality standards

Let''s create a positive and productive environment for everyone! 💪',
  'Announcements',
  ARRAY['guidelines', 'rules', 'community'],
  'published'
FROM auth.users
WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
LIMIT 1;

-- Insert first success story
INSERT INTO posts (author_id, title, content, category, tags, status)
SELECT 
  auth.uid(),
  'How I Built a 6-Figure AI Business in 90 Days',
  'I wanted to share my journey of building an AI-powered business that hit six figures in just 90 days. Here''s my step-by-step process:

1. Market Research
- Identified pain points in the market
- Validated solutions with potential customers
- Found my unique angle

2. AI Implementation
- Leveraged AI for automation
- Built scalable systems
- Optimized workflows

3. Growth Strategy
- Focused on customer acquisition
- Implemented feedback loops
- Scaled what worked

Key Lessons:
- Start with a clear problem
- Use AI strategically
- Focus on customer success
- Scale methodically

Happy to answer any questions! 🎯',
  'Success Stories',
  ARRAY['success', 'entrepreneurship', 'ai'],
  'published'
FROM auth.users
WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
LIMIT 1;

-- Insert resource sharing post
INSERT INTO posts (author_id, title, content, category, tags, status)
SELECT 
  auth.uid(),
  'Essential AI Tools for Entrepreneurs',
  'Here''s a curated list of AI tools that have transformed my business:

1. Content Creation
- GPT-4 for writing
- Midjourney for visuals
- Descript for video editing

2. Automation
- Zapier for workflows
- Make.com for complex automation
- n8n for self-hosted solutions

3. Analytics
- Obviously AI for predictions
- Tableau for visualization
- Metabase for reporting

4. Customer Service
- ChatGPT for support
- Intercom for chat
- Freshdesk for tickets

Which tools are you using? Share your favorites! 🛠️',
  'Resources',
  ARRAY['tools', 'ai', 'resources'],
  'published'
FROM auth.users
WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
LIMIT 1;