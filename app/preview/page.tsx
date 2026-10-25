import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function PreviewPage() {
  // Activate whole-website preview mode via cookie
  const cookieStore = cookies();
  cookieStore.set("cravings_preview_mode", "true", {
    path: "/",
    maxAge: 604800, // 7 days
  });

  // Redirect to homepage with preview flag so the entire website operates in preview mode
  redirect("/?preview=1");
}
