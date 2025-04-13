const { supabase } = require('../utils/supabase');

const TABLE_NAME = 'airports';

/**
 * Airport model for Supabase interactions
 */
class Airport {
  /**
   * Get all airports
   */
  static async getAll() {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*');
    
    if (error) throw error;
    return data;
  }

  /**
   * Get airport by ID
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
   * Create new airport
   */
  static async create(airportData) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(airportData)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Update airport
   */
  static async update(id, airportData) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(airportData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Delete airport
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

module.exports = Airport; 