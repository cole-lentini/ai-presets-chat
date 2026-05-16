import { supabase } from "./lib/supabase";

export async function loginWithUsername(username: string) {
  const clean = username.trim();

  // 1. try to find user (SAFE: no crash if not found)
  const { data: existingUser, error: findError } = await supabase
    .from("users")
    .select("*")
    .eq("username", clean)
    .maybeSingle();

  if (findError) {
    console.error("User lookup error:", findError);
    return null;
  }

  let user = existingUser;

  // 2. if not found → create user
  if (!user) {
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({ username: clean })
      .select()
      .maybeSingle();

    if (createError) {
      console.error("User creation error:", createError);
      return null;
    }

    user = newUser;
  }

  // 3. store session
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