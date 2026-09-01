import { Navbar } from "@/components/common/Navbar";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar locale={locale} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
