import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Admin Portal | chocii 4 u",
  description: "Private operations and kitchen dashboard for chocii 4 u",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
