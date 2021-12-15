import { createClient } from "@supabase/supabase-js";
import { Constants } from "./constants";
import { User } from "../types/common";
import { isDev } from "./utils";

/**
 * Supabase client to access auth
 */
export const supabase = createClient(
  Constants.SUPABASE.URL,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY
);

// Sign in with GitHub
export async function signIn() {
  await supabase.auth.signIn(
    { provider: "github" },
    {
      scopes: "repo:status read:user",
      redirectTo: isDev() ? "http://localhost:3000" : "https://wrapped.run",
    }
  );
}

// Sign out
export async function signOut() {
  await supabase.auth.signOut();
}

/**
 * Get the signed-in user
 */
export async function isSignedIn() {
  return await supabase.auth.user();
}

/**
 * Add a row to a Supabase table
 * @param table name of the database table in which to insert a row
 * @param payload data to be inserted into the table, matching its columns
 * @returns error or inserted data
 */
export async function addRow(table: string, payload: object) {
  let { error, data } = await supabase
    .from(table)
    .upsert(payload, { onConflict: "username" });
  if (error) throw error;
  else return data;
}

/**
 * Get details of a database row by a search query
 * @param table name of the database table eg. "users"
 * @param column name of the column to search eg. "username"
 * @param value value to search by eg. "natfriedman"
 * @returns object with columns as fields eg. `data.commits`
 */
export async function getRow(table: string, column: string, value: string) {
  let { data, error } = await supabase
    .from(table)
    .select()
    .eq(column, value)
    .limit(1)
    .single();
  if (error) throw error;
  else return data;
}

/**
 * Uploads an image to Supabase storage and returns its URL
 * @param blob PNG blob to upload
 * @param username user's username as filename
 * @returns uploaded file URL
 */
export async function uploadImage(blob: Blob, username: string) {
  const { data, error } = await supabase.storage
    .from("link-previews")
    .upload(`public/${username}.png`, blob, {
      cacheControl: "3600",
      upsert: true,
    });
  if (error) console.error(error);
  return data;
}

/**
 * Uploads an image to Supabase storage and returns its URL
 * @param blob PNG blob to upload
 * @param username user's username as filename
 * @returns uploaded file URL
 */
export async function getImageURL(username: string): Promise<string> {
  const { publicURL, error } = await supabase.storage
    .from("link-previews")
    .getPublicUrl(`public/${username}.png`);
  if (error) console.error(error);
  return publicURL;
}

/**
 * Updates an existing value
 * @param  {string} table table to be updated
 * @param  {keyof User} column column to be updated
 * @param  {any} value the updated value
 * @param  {string} username
 */
export async function updateValue(
  table: string,
  column: keyof User,
  value: any,
  username: string
) {
  let { data, error } = await supabase
    .from(table)
    .update({ [column]: value })
    .eq("username", username);
  if (error) throw error;
  else return data;
}
