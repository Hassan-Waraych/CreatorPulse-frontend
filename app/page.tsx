export default function Home() {
  return (
    <div className="bg-[#240b36]">
      {/* Main gradient background */}
      <div className="fixed inset-0 bg-gradient-to-r from-[#c31432] to-[#240b36] opacity-70" />

      {/* Content wrapper */}
      <div className="relative">
        <header className="absolute inset-x-0 top-0 z-50">
          <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">CreatorPulse</span>
                <svg className="h-8 w-auto text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </a>
            </div>
            <div className="flex lg:hidden">
              <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200">
                <span className="sr-only">Open main menu</span>
                <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              <a href="#" className="text-sm font-semibold leading-6 text-gray-200 hover:text-white transition-colors">How It Works</a>
              <a href="#" className="text-sm font-semibold leading-6 text-gray-200 hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-sm font-semibold leading-6 text-gray-200 hover:text-white transition-colors">Blog</a>
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <a href="/login" className="text-sm font-semibold leading-6 text-gray-200 hover:text-white transition-colors">
                Dashboard <span aria-hidden="true">→</span>
              </a>
            </div>
          </nav>

          {/* Mobile menu */}
          <div className="lg:hidden" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-50 bg-black/80" />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#240b36] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">CreatorPulse</span>
                  <svg className="h-8 w-auto text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </a>
                <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-200">
                  <span className="sr-only">Close menu</span>
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-200 hover:bg-white/10">
                      How It Works
                    </a>
                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-200 hover:bg-white/10">
                      Pricing
                    </a>
                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-200 hover:bg-white/10">
                      Blog
                    </a>
                  </div>
                  <div className="py-6">
                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-200 hover:bg-white/10">
                      Sign up
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero section */}
        <div className="relative isolate px-6 pt-14 lg:px-8">
          {/* Top gradient decoration */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-r from-[#c31432] to-[#240b36] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" 
              style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
          </div>
          
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-200 ring-1 ring-white/20 hover:ring-white/30">
                AI-Powered Talent Acquisition Platform.{' '}
                <a href="#" className="font-semibold text-white">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Learn how <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Scale Your Brand with AI-Powered Creator Scanning
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-200">
                Connect with high-performing content creators without ads, brokers, or agencies. Let us do your dirty work.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a href="#" className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-[#240b36] hover:bg-gray-100 transition-colors">
                  Get started
                </a>
                <a href="#" className="text-sm font-semibold leading-6 text-gray-200 hover:text-white transition-colors">
                  <span aria-hidden="true"></span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom gradient decoration */}
          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-2xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
            <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-r from-[#c31432] to-[#240b36] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" 
              style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}