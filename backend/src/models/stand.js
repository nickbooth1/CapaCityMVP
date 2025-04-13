const { supabase } = require('../utils/supabase');

const TABLE_NAME = 'stands';

/**
 * Stand model for Supabase interactions
 */
class Stand {
  /**
   * Get all stands, optionally filtered by airport
   */
  static async getAll(airportId = null) {
    let query = supabase.from(TABLE_NAME).select('*');
    
    if (airportId) {
      query = query.eq('airport_id', airportId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }

  /**
   * Get stand by ID
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
   * Create new stand
   */
  static async create(standData) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(standData)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Update stand
   */
  static async update(id, standData) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(standData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Delete stand
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

module.exports = Stand; 