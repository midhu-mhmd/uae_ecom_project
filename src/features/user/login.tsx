import React, { useState } from 'react';
import { 
  ArrowRight, Loader2, Lock, Mail, 
  Fingerprint, Command, ShieldCheck 
} from 'lucide-react';

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1800);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#18181B] font-sans antialiased flex items-center justify-center p-6 selection:bg-black selection:text-white">
      
      {/* Decorative background element: A very subtle gradient 'wash' */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-200/50 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-200/50 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[380px] relative z-10">
        
        {/* Main Card: Elevated White Bento Style */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-10 md:p-12 space-y-10">
          
          <header className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Command size={16} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Protocol</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-medium tracking-tight text-zinc-900">Welcome Back</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Identity Verification</p>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-1">
              
              {/* Field: Email */}
              <div className={`group relative border-b transition-all duration-500 py-3 ${focused === 'email' ? 'border-black' : 'border-zinc-100'}`}>
                <div className="flex items-center gap-3">
                  <Mail size={14} className={`${focused === 'email' ? 'text-black' : 'text-zinc-300'} transition-colors`} />
                  <input 
                    type="email" 
                    required
                    placeholder="Email Address"
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-transparent outline-none text-sm font-medium tracking-tight placeholder:text-zinc-200"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Field: Password */}
              <div className={`group relative border-b transition-all duration-500 py-3 ${focused === 'pass' ? 'border-black' : 'border-zinc-100'}`}>
                <div className="flex items-center gap-3">
                  <Lock size={14} className={`${focused === 'pass' ? 'text-black' : 'text-zinc-300'} transition-colors`} />
                  <input 
                    type="password" 
                    required
                    placeholder="Security Key"
                    onFocus={() => setFocused('pass')}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-transparent outline-none text-sm font-medium tracking-tight placeholder:text-zinc-200"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <button 
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-zinc-300 hover:text-black transition-colors"
                >
                  Forgot?
                </button>
              </div>
            </div>

            {/* Primary Action */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="group relative w-full bg-black text-white py-5 rounded-2xl overflow-hidden transition-all active:scale-[0.98] hover:shadow-xl hover:shadow-black/10 disabled:opacity-30"
            >
              <div className="relative flex items-center justify-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">
                  {isLoading ? 'Verifying...' : 'Sign In'}
                </span>
                {!isLoading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}
                {isLoading && <Loader2 size={16} className="animate-spin" />}
              </div>
            </button>
          </form>

          {/* Alternatives */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-zinc-100" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300">Auth Options</span>
              <div className="h-[1px] flex-1 bg-zinc-100" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 border border-zinc-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-50 hover:text-black hover:border-zinc-200 transition-all">
                Google
              </button>
              <button className="py-3 border border-zinc-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-50 hover:text-black hover:border-zinc-200 transition-all">
                Apple
              </button>
            </div>
          </div>
        </div>

        {/* Outer Footer */}
        <footer className="text-center mt-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            No account?{' '}
            <button className="text-black font-black border-b-2 border-zinc-100 hover:border-black transition-all ml-1 pb-0.5">
              Join the Network
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;