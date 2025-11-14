import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const ssr = false;
export const load: LayoutServerLoad = async ({ url, fetch }) => {
  const res = await fetch("/api/auth", {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();

  if (!data.success) {
    redirect(302, "/");
    return;
  }

  if (url.pathname != '/main') {
    redirect(302, '/main');
  }
};
