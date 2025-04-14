import { AuthProvider } from "@/lib/authcontext";
import "../globals.css"

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <AuthProvider>
      <div className="">
        { children }
      </div>
    </AuthProvider>
  );
}
