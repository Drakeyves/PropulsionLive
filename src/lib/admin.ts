import { supabaseAdmin } from './supabase-admin';

export async function createTestAdmin() {
  try {
    // Create the user account
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@admin.com',
      password: 'admin',
      email_confirm: true,
      user_metadata: {
        username: 'admin',
        full_name: 'Test Admin',
      },
    });

    if (authError) throw authError;

    if (authData.user) {
      // Add admin privileges
      const { error: adminError } = await supabaseAdmin.from('admin_users').insert({
        id: authData.user.id,
        role: 'super_admin',
        permissions: ['*'],
      });

      if (adminError) throw adminError;
    }

    return { success: true, message: 'Test admin user created successfully' };
  } catch (error) {
    console.error('Error creating test admin:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create test admin user',
    };
  }
}

export async function deleteTestAdmin() {
  try {
    // Find the admin user
    const { data: userData, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('username', 'admin')
      .single();

    if (userError) throw userError;

    if (userData) {
      // Delete from admin_users first (due to foreign key constraint)
      await supabaseAdmin.from('admin_users').delete().eq('id', userData.id);

      // Delete the user account (this will cascade to profiles due to foreign key)
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userData.id);

      if (deleteError) throw deleteError;
    }

    return { success: true, message: 'Test admin user deleted successfully' };
  } catch (error) {
    console.error('Error deleting test admin:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete test admin user',
    };
  }
}
