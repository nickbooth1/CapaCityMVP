const { supabase } = require('../utils/supabase');

const TABLE_NAME = 'organizations';

/**
 * Organization model for airport clients
 */
class Organization {
  /**
   * Get all organizations
   */
  static async getAll() {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*, airports(*)')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  /**
   * Get organization by ID
   */
  static async getById(id) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*, airports(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Create new organization
   */
  static async create(orgData) {
    // Ensure required fields
    if (!orgData.name || !orgData.airport_id) {
      throw new Error('Organization name and airport_id are required');
    }
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        ...orgData,
        created_at: new Date().toISOString()
      })
      .select('*, airports(*)');
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Update organization
   */
  static async update(id, orgData) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        ...orgData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*, airports(*)');
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Delete organization
   */
  static async delete(id) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  /**
   * Get users belonging to an organization
   */
  static async getUsers(orgId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('organization_id', orgId);
    
    if (error) throw error;
    return data;
  }
}

module.exports = Organization; 