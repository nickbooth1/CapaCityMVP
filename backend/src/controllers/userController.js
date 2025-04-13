const { supabase, supabaseAdmin } = require('../utils/supabase');

/**
 * User controller
 */
const userController = {
  /**
   * Create or update user profile
   * Uses supabaseAdmin to bypass RLS for creating/updating profile rows.
   */
  createOrUpdateProfile: async (req, res, next) => {
    try {
      // Remove organization_id and airport_id from destructuring
      const { id, email, name, role } = req.body; 
      
      if (!id || !email) {
        return res.status(400).json({ error: 'User ID and email are required' });
      }

      // NOTE: These permission checks might need refinement depending on how auth (req.user) is populated
      // when calling this potentially unauthenticated endpoint.
      if (req.user) {
        // Regular users can only update their own profile
        if (req.user.id !== id && req.user.role === 'user') {
          return res.status(403).json({ error: 'Unauthorized access' });
        }
        
        // Client admins role check - simplified for now
        if (req.user.role === 'admin') {
          // Prevent creating or promoting to superadmin
          if (role === 'superadmin') { 
            return res.status(403).json({ error: 'Client administrators cannot create or promote to CapaCity administrator role' });
          }
        }

        // Superadmins have fewer restrictions
        if (req.user.role === 'superadmin') {
           // Superadmin specific logic if needed
        }
      } else {
         // If no req.user, this is likely the initial signup call. 
         // We proceed assuming the caller (frontend) has verified the auth user creation.
         // Using supabaseAdmin below handles the permissions needed for insert.
      }
      
      // Check if user already exists using ADMIN client
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('*') // Select basic fields
        .eq('id', id)
        .single();
      
      let result;
      
      // Prepare update/insert data without org/airport IDs
      const userData = {
        email,
        name,
        ...(role && { role }), // Use provided role if available
      };

      if (existingUser) {
        // Update existing user using ADMIN client
        const { data, error } = await supabaseAdmin
          .from('users')
          .update({
             ...userData, 
             role: role || existingUser.role, // Use new role or keep existing
             updated_at: new Date().toISOString() 
            })
          .eq('id', id)
          .select('*'); // Select basic fields
        
        if (error) throw error;
        result = data[0];
      } else {
        // Create new user using ADMIN client
        const insertData = {
            id,
            email,
            name: name || '',
            role: role || 'user', // Default to 'user'
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabaseAdmin
          .from('users')
          .insert([insertData])
          .select('*'); // Select basic fields
        
        if (error) throw error;
        result = data[0];
      }
      
      res.status(201).json(result);
    } catch (error) {
       // Log the specific error 
       console.error("Error in createOrUpdateProfile:", error); 
       // Send a generic error or specific one based on type
       if (error.code === '23505') { // Handle unique constraint violation (e.g., email already exists)
            return res.status(409).json({ error: 'User with this email already exists.' });
       }
      next(error); // Pass to generic error handler
    }
  },
  
  /**
   * Get user profile by ID
   */
  getProfile: async (req, res, next) => {
    try {
      // Get user from request object (set by auth middleware)
      const userId = req.params.id || req.user.id; 
      const requestingUser = req.user; 

      // Fetch the profile being requested just to check existence and ID
      // Use regular supabase client here, assuming RLS applies for reads
      const { data: targetUser, error: targetUserError } = await supabase
        .from('users')
        .select('id, role') // Only need ID and role for basic checks now
        .eq('id', userId)
        .single();

      if (targetUserError && targetUserError.code !== 'PGRST116') { 
        throw targetUserError;
      }

      if (!targetUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Permission checks - simplified without organization
      if (requestingUser.id !== targetUser.id) { 
        // Regular users cannot access others' profiles
        if (requestingUser.role === 'user') {
          return res.status(403).json({ error: 'Unauthorized access' });
        }
        
        // Admin/Superadmin checks (simplified for now, no org check)
        // Superadmins can access anyone
        // Admins might have restrictions later, but not based on non-existent org_id
      }
      
      // Select only basic user fields as relations don't exist
      // Use regular supabase client here, assuming RLS applies for reads
      const { data, error } = await supabase
        .from('users')
        .select('*') // Select basic fields
        .eq('id', userId)
        .single(); 
      
      if (error) {
         console.error("Error fetching profile:", error); 
         throw error; 
       }
      
      // Existence check already done
      res.json(data);
    } catch (error) {
       console.error("Error in getProfile:", error); 
      next(error);
    }
  },
  
  /**
   * Get all users (filtered by organization for client admins) - REMOVING ORG FILTER FOR NOW
   */
  getAllUsers: async (req, res, next) => {
    try {
      // Role check remains
      if (req.user.role === 'user') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      
      // Use regular supabase client here, assuming RLS applies for reads
      let query = supabase.from('users').select('*');
      
      // Removed organization filter as the column doesn't exist
      // if (req.user.role === 'admin') {
      //   query = query.eq('organization_id', req.user.organization_id);
      // }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController; 