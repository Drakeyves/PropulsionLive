/*
  # Update Test User Password

  1. Changes
    - Update test user password to meet minimum requirements (6 characters)
*/

-- Update test user password to 'testtest'
UPDATE auth.users
SET encrypted_password = crypt('testtest', gen_salt('bf'))
WHERE email = 'test@test.com'; 