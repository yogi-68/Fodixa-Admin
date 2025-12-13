import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// =====================================================
// ADMIN AUTH
// =====================================================

export const adminSignIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Verify user is admin
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (userError || userData.role !== 'ADMIN') {
    await supabase.auth.signOut();
    throw new Error('Unauthorized: Admin access only');
  }

  return data;
};

// =====================================================
// DASHBOARD STATS
// =====================================================

export const getDashboardStats = async () => {
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  const { count: totalRestaurants } = await supabase
    .from('restaurants')
    .select('*', { count: 'exact', head: true });

  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { count: activeRiders } = await supabase
    .from('riders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'AVAILABLE');

  const { data: revenueData } = await supabase
    .from('orders')
    .select('total')
    .eq('payment_status', 'COMPLETED');

  const totalRevenue = revenueData?.reduce((sum: number, order: any) => sum + Number(order.total), 0) || 0;

  return {
    totalUsers,
    totalRestaurants,
    totalOrders,
    activeRiders,
    totalRevenue,
  };
};

// =====================================================
// USER MANAGEMENT
// =====================================================

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateUserStatus = async (userId: string, isActive: boolean) => {
  const { error } = await supabase
    .from('users')
    .update({ is_active: isActive })
    .eq('id', userId);

  if (error) throw error;
};

export const deleteUser = async (userId: string) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) throw error;
};

// =====================================================
// RESTAURANT MANAGEMENT
// =====================================================

export const getAllRestaurants = async () => {
  const { data, error } = await supabase
    .from('restaurants')
    .select(`
      *,
      owner:users(name, email, phone)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const approveRestaurant = async (restaurantId: string) => {
  const { error } = await supabase
    .from('restaurants')
    .update({ status: 'ACTIVE' })
    .eq('id', restaurantId);

  if (error) throw error;
};

export const rejectRestaurant = async (restaurantId: string) => {
  const { error } = await supabase
    .from('restaurants')
    .update({ status: 'INACTIVE' })
    .eq('id', restaurantId);

  if (error) throw error;
};

// =====================================================
// ORDER MANAGEMENT
// =====================================================

export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:customers(user:users(name, phone)),
      restaurant:restaurants(name),
      rider:riders(user:users(name, phone))
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;
  return data;
};

export const getOrdersByStatus = async (status: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// =====================================================
// RIDER MANAGEMENT
// =====================================================

export const getAllRiders = async () => {
  const { data, error } = await supabase
    .from('riders')
    .select(`
      *,
      user:users(name, email, phone)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const verifyRider = async (riderId: string) => {
  const { error } = await supabase
    .from('riders')
    .update({ is_verified: true })
    .eq('id', riderId);

  if (error) throw error;
};

// =====================================================
// REALTIME SUBSCRIPTIONS
// =====================================================

export const subscribeToNewOrders = (callback: (order: any) => void) => {
  return supabase
    .channel('admin-new-orders')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
      },
      (payload: any) => callback(payload.new),
    )
    .subscribe();
};

export const subscribeToAllOrders = (callback: (order: any) => void) => {
  return supabase
    .channel('admin-all-orders')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
      },
      (payload: any) => callback(payload.new),
    )
    .subscribe();
};

// Export common auth functions
export const signOut = async () => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
