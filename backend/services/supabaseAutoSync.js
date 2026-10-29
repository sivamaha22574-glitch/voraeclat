// Supabase auto-sync service is disconnected.
// All operations now directly use MongoDB Atlas and Express MVC endpoints.

export async function syncOrderToMongo() {
  return null;
}

export async function syncAllFromSupabase() {
  return null;
}

export function startSupabaseAutoSync() {
  console.log('[Notice] Supabase connection is disabled. Running purely on MongoDB Atlas backend.');
}
