const { supabase } = require('../utils/supabase');

const TABLE_NAME = 'maintenance_requests';

/**
 * Maintenance request model for Supabase interactions
 */
class MaintenanceRequest {
  /**
   * Get all maintenance requests, optionally filtered by status
   */
  static async getAll(filters = {}) {
    let query = supabase.from(TABLE_NAME).select('*');
    
    // Apply filters if provided
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.standId) {
      query = query.eq('stand_id', filters.standId);
    }
    
    if (filters.airportId) {
      query = query.eq('airport_id', filters.airportId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }

  /**
   * Get maintenance request by ID
   */
  static async getById(id) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Create new maintenance request
   */
  static async create(requestData) {
    // Add default status if not provided
    const data = {
      status: 'pending',
      ...requestData,
      created_at: new Date().toISOString()
    };
    
    const { data: result, error } = await supabase
      .from(TABLE_NAME)
      .insert(data)
      .select();
    
    if (error) throw error;
    return result[0];
  }

  /**
   * Update maintenance request
   */
  static async update(id, requestData) {
    // Add updated_at timestamp
    const data = {
      ...requestData,
      updated_at: new Date().toISOString()
    };
    
    const { data: result, error } = await supabase
      .from(TABLE_NAME)
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return result[0];
  }

  /**
   * Delete maintenance request
   */
  static async delete(id) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}

module.exports = MaintenanceRequest; 