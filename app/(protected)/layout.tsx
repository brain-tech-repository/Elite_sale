import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface PageProps {
  children: React.ReactNode;
}

export default function Page({ children }: PageProps) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="sticky top-0 z-50 flex h-14 items-center gap-1 border-b bg-[#022235] text-white">
          <SidebarTrigger />

          <Separator orientation="vertical" className="h-4" />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block text-white">
                <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator className="hidden md:block" />

              <BreadcrumbItem className="text-white">
                <BreadcrumbPage className="text-white">
                  Dashboard
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-2">
          <div className="">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
