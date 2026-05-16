import { supabase } from "./lib/supabase";

export async function loginWithUsername(username: string) {
  // 1. check if user exists
  let { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  // 2. if not, create it
  if (!user) {
    const { data: newUser } = await supabase
      .from("users")
      .insert({ username })
      .select()
      .single();

    user = newUser;
  }

  // 3. store "session" locally
  localStorage.setItem("user", JSON.stringify(user));

  return user;
}

export function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem("user");
}