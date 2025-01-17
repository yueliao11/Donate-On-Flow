import { LoginButton } from './auth/LoginButton';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0f1011]">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-purple-500/20 bg-[#0f1011]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo and other left items */}
          </div>
          
          <LoginButton />
        </div>
      </header>
      
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}; 