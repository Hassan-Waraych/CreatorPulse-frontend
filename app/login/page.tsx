import Link from "next/link"
import { Zap } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#8a0d23] to-[#14061e] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="h-10 w-10 rounded-md bg-[#c31432] flex items-center justify-center mr-3">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Client Portal</h1>
        </div>

        <div className="bg-black rounded-xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Sign In</h2>
            <p className="text-gray-400 mt-1">Access your creator discovery dashboard</p>
          </div>

          <div className="p-6">
            <form>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300 block">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c31432] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-gray-300 block">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-[#e04c6c] hover:text-[#f06c8c] transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c31432] focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-700 bg-black/30 text-[#c31432] focus:ring-[#c31432] focus:ring-offset-black"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#c31432] hover:bg-[#a01029] text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#c31432] focus:ring-offset-2 focus:ring-offset-black"
                >
                  Sign In
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[#e04c6c] hover:text-[#f06c8c] font-medium transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>© 2023 Client Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}