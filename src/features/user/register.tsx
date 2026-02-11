import React, { useMemo, useState } from "react";
import { Shield, ArrowRight, Loader2, Eye, EyeOff, Check } from "lucide-react";

/* --- TYPES --- */
type Strength = 0 | 1 | 2 | 3 | 4;

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const passwordStrength = useMemo((): Strength => {
    const pass = formData.password;
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[!@#$%^&*]/.test(pass)) score++;
    return score as Strength;
  }, [formData.password]);

  const passwordsMatch =
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const canSubmit =
    !isLoading &&
    formData.name.trim().length >= 2 &&
    formData.email.trim().length > 3 &&
    formData.phone.trim().length >= 10 &&
    formData.password.length >= 8 &&
    passwordsMatch &&
    formData.agreeTerms;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const setField = (key: keyof typeof formData, value: any) =>
    setFormData((p) => ({ ...p, [key]: value }));

  return (
    <div className="min-h-screen bg-white text-black antialiased flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-[420px]">
        {/* Brand line */}
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase text-gray-500">
          <Shield size={16} strokeWidth={2.6} className="text-gray-700" />
          Protocol
        </div>

        {/* Card */}
        <div className="mt-4 rounded-2xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.06)] bg-white">
          <div className="px-6 pt-7 pb-6">
            <h1 className="text-[26px] leading-tight font-semibold tracking-tight">
              Create account
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Minimal setup. Just the essentials.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              {/* Name */}
              <Field label="Full name">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Eg. Muhammed Midlaj"
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition
                             focus:border-black focus:ring-4 focus:ring-black/5 placeholder:text-gray-300"
                />
              </Field>

              {/* Email */}
              <Field label="Email">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition
                             focus:border-black focus:ring-4 focus:ring-black/5 placeholder:text-gray-300"
                />
              </Field>

              {/* Phone */}
              <Field label="Phone">
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition
                             focus:border-black focus:ring-4 focus:ring-black/5 placeholder:text-gray-300"
                />
              </Field>

              {/* Password */}
              <Field
                label="Password"
                right={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="p-2 -mr-2 text-gray-500 hover:text-black transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              >
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 pr-10 text-sm outline-none transition
                               focus:border-black focus:ring-4 focus:ring-black/5 placeholder:text-gray-300"
                  />
                </div>

                {/* Minimal strength */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {([1, 2, 3, 4] as const).map((n) => (
                      <span
                        key={n}
                        className={[
                          "h-1.5 w-7 rounded-full transition",
                          passwordStrength >= n ? "bg-black" : "bg-gray-200",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-500">
                    {passwordStrength === 0
                      ? "—"
                      : passwordStrength <= 1
                      ? "Weak"
                      : passwordStrength === 2
                      ? "Okay"
                      : passwordStrength === 3
                      ? "Strong"
                      : "Very strong"}
                  </span>
                </div>
              </Field>

              {/* Confirm */}
              <Field
                label="Confirm password"
                right={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="p-2 -mr-2 text-gray-500 hover:text-black transition"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                hint={
                  formData.confirmPassword.length > 0 ? (
                    passwordsMatch ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-600">
                        <Check size={14} className="text-black" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500">
                        Passwords don’t match
                      </span>
                    )
                  ) : null
                }
              >
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setField("confirmPassword", e.target.value)}
                  placeholder="Repeat password"
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 pr-10 text-sm outline-none transition
                             focus:border-black focus:ring-4 focus:ring-black/5 placeholder:text-gray-300"
                />
              </Field>

              {/* Terms */}
              <label className="flex items-start gap-3 pt-1 cursor-pointer select-none">
                <span className="relative mt-0.5 h-4 w-4 rounded-[6px] border border-gray-300 flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer absolute inset-0 opacity-0 cursor-pointer"
                    checked={formData.agreeTerms}
                    onChange={(e) => setField("agreeTerms", e.target.checked)}
                  />
                  <Check
                    size={12}
                    strokeWidth={3}
                    className="opacity-0 peer-checked:opacity-100 transition-opacity"
                  />
                </span>
                <span className="text-xs text-gray-500 leading-relaxed">
                  I agree to the <span className="text-black">Terms</span> and{" "}
                  <span className="text-black">Privacy Policy</span>.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full h-11 rounded-xl bg-black text-white text-[11px] font-semibold uppercase tracking-[0.22em]
                           flex items-center justify-center gap-2 transition
                           hover:opacity-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    Create <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Divider + Social */}
            <div className="mt-7">
              <div className="flex items-center gap-3 text-gray-200">
                <div className="h-px flex-1 bg-current" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                  or
                </span>
                <div className="h-px flex-1 bg-current" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="h-11 rounded-xl border border-gray-200 text-[11px] font-semibold uppercase tracking-[0.18em]
                                   hover:border-black transition">
                  Google
                </button>
                <button className="h-11 rounded-xl border border-gray-200 text-[11px] font-semibold uppercase tracking-[0.18em]
                                   hover:border-black transition">
                  Apple
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <p className="text-center text-xs text-gray-500">
              Already a member?{" "}
              <button type="button" className="text-black font-semibold underline underline-offset-4">
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Tiny note */}
        <p className="mt-4 text-center text-[11px] text-gray-400">
          Minimal UI. Better focus. Faster conversion.
        </p>
      </div>
    </div>
  );
};

export default Register;

/* --- Small field wrapper --- */
function Field({
  label,
  children,
  right,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  right?: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gray-500">
          {label}
        </span>
        {right}
      </div>
      {children}
      {hint ? <div>{hint}</div> : null}
    </div>
  );
}
