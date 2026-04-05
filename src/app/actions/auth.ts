"use server";

import { redirect } from "next/navigation";

export async function register() {
  redirect("/dashboard/profile");
}

export async function login() {
  redirect("/dashboard/profile");
}

export async function logout() {
  redirect("/");
}

