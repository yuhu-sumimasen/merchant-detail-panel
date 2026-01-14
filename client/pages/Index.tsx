import { useState } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";


export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [loginError, setLoginError] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* -------------------- LOGIN -------------------- */

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoginError("");

  if (!email || !password) {
    setLoginError("Please enter both email and password");
    return;
  }

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    setIsLoggedIn(true);
    setEmail("");
    setPassword("");
    setSubmissionMessage(null);
  } catch {
    setLoginError("Invalid email or password");
  }
};


  /* -------------------- SUBMIT MERCHANT -------------------- */

  const handleSubmitMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionMessage(null);

    if (!merchantId.trim()) {
      setSubmissionMessage({
        type: "error",
        text: "Please enter a merchant ID",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ merchantId }),
      });

      if (!res.ok) {
        throw new Error("API request failed");
      }

      setSubmissionMessage({
        type: "success",
        text: "Merchant ID successfully sent",
      });

      setMerchantId("");

      setTimeout(() => {
        setSubmissionMessage(null);
      }, 3000);
    } catch (error) {
      setSubmissionMessage({
        type: "error",
        text: "Failed to submit merchant ID. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -------------------- LOGOUT -------------------- */

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setMerchantId("");
    setLoginError("");
    setSubmissionMessage(null);
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {!isLoggedIn ? (
        /* -------------------- LOGIN UI -------------------- */
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
                Login
              </h1>
              <p className="text-center text-gray-500 text-sm mb-8">
                Enter your credentials to access the dashboard
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {loginError && (
                  <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-sm text-red-700">{loginError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg"
                >
                  Login
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-6">
                Internal use only dont share to your boyfriend or even your family
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* -------------------- DASHBOARD -------------------- */
        <div className="bg-gradient from-slate-900 via-purple-900 to-slate-900">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-1">
            <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between">
              <h1 className="text-xl font-bold text-gray-900">
                Merchant Data Trigger Panel
              </h1>
              <button
                onClick={handleLogout}
                className="bg-red px-4 py-2 text-sm border rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="bg-white border rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-6">
                Merchant Input Form
              </h2>

              <form onSubmit={handleSubmitMerchant} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Merchant ID
                  </label>
                  <input
                    type="text"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 border rounded-lg"
                  />
                </div>

                {submissionMessage && (
                  <div
                    className={`flex gap-3 p-4 rounded-lg ${
                      submissionMessage.type === "success"
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    {submissionMessage.type === "success" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <p className="text-sm">{submissionMessage.text}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2.5 rounded-lg flex justify-center gap-2"
                >
                  {isSubmitting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Sending..." : "Continue"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
