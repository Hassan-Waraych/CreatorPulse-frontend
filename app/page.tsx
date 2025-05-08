import Link from "next/link";
import { ArrowRight, CheckCircle, Zap, Search, Users, Send, Headphones } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-white">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="h-8 w-8 text-[#ff4d8d] drop-shadow-[0_0_20px_rgba(255,77,141,0.7)]" />
        </Link>
        <Link href="/login" className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white transition-colors">
          Dashboard <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-56 pb-32 text-center mb-32">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#ff4d8d]/20 text-white text-sm font-medium mb-8">
          <span>AI-Powered Talent Acquisition Platform</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto">
          Why Choose Our AI-Powered Creator Platform
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
          We're revolutionizing how brands connect with creators through advanced AI technology and data-driven matching.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <a href="#how-we-help-creators" className="inline-block px-8 py-3 rounded-lg bg-[#ff4d8d] text-white font-semibold text-lg shadow-[0_0_20px_rgba(255,77,141,0.7)] hover:bg-[#ff1a6c] transition-colors">For Creators</a>
          <a href="#how-we-work" className="inline-block px-8 py-3 rounded-lg bg-white/10 text-white font-semibold text-lg border border-[#ff4d8d] hover:bg-[#ff4d8d] hover:text-white transition-colors">For Brands</a>
        </div>
      </section>

      {/* About Us Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-white/80 mb-6">
              We've been on both sides. As creators and as content managers, we've helped generate over 100M views. We know how tough it is to find the right talent, so we built something that actually helps.
            </p>
            <p className="text-white/80 mb-8"></p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/schedule-demo" className="inline-flex items-center justify-center px-6 py-3 bg-[#ff4d8d] text-white font-medium rounded-lg hover:bg-[#ff1a6c] transition-colors shadow-[0_0_20px_rgba(255,77,141,0.7)]">
                Schedule a Demo
              </Link>
            </div>
          </div>
          <div>
            <div className="bg-black/20 rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-6">What Sets Us Apart</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-[#ff4d8d] flex-shrink-0 mt-0.5 drop-shadow-[0_0_10px_rgba(255,77,141,0.5)]" />
                  <div>
                    <h4 className="font-semibold mb-1">AI-Powered Creator Matching</h4>
                    <p className="text-white/70 text-sm">
                      Our system scans thousands of creators and filters them using over 50 data points to surface the ones that actually fit.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-[#ff4d8d] flex-shrink-0 mt-0.5 drop-shadow-[0_0_10px_rgba(255,77,141,0.5)]" />
                  <div>
                    <h4 className="font-semibold mb-1">No Guessing Around Here</h4>
                    <p className="text-white/70 text-sm">
                      You get a curated list of creators tailored to your needs. No random picks.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-[#ff4d8d] flex-shrink-0 mt-0.5 drop-shadow-[0_0_10px_rgba(255,77,141,0.5)]" />
                  <div>
                    <h4 className="font-semibold mb-1">Reliable Communication</h4>
                    <p className="text-white/70 text-sm">
                      We're quick to respond, open to feedback, and always ready to adjust based on your needs.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-[#ff4d8d] flex-shrink-0 mt-0.5 drop-shadow-[0_0_10px_rgba(255,77,141,0.5)]" />
                  <div>
                    <h4 className="font-semibold mb-1">Transparent Pricing</h4>
                    <p className="text-white/70 text-sm">
                      Simple subscription model with no hidden fees or surprise costs.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="how-we-work" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-6">How We'll Help Your Brand</h2>
        <p className="text-center text-white/80 max-w-2xl mx-auto mb-16">
          Our streamlined process is designed to get you connected with the perfect creators quickly and efficiently.
        </p>
        <div className="relative max-w-5xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#ff4d8d] to-[#ff1a6c] -translate-x-1/2" />
          {/* Step 1 */}
          <div className="relative flex flex-col md:flex-row items-start mb-16 md:mb-24">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-10 h-10 bg-[#ff4d8d] rounded-full z-10 flex items-center justify-center shadow-[0_0_20px_rgba(255,77,141,0.7)]">
              <span className="font-bold">1</span>
            </div>
            <div className="pl-24 md:pl-0 md:pr-12 md:w-1/2 md:text-right">
              <div className="bg-black/30 rounded-xl p-6 border border-white/10 md:ml-auto md:mr-0 transform transition-all hover:border-[#ff4d8d]/50">
                <div className="flex items-center mb-4 md:justify-end">
                  <Search className="h-6 w-6 text-[#ff4d8d] mr-2 md:order-2 md:ml-2 md:mr-0 drop-shadow-[0_0_10px_rgba(255,77,141,0.5)]" />
                  <h3 className="text-xl font-bold">Research</h3>
                </div>
                <p className="text-white/70">
                  We research your brand, understanding your values, target audience, and campaign goals to ensure perfect creator matches.
                </p>
              </div>
            </div>
            <div className="hidden md:block md:w-1/2" />
          </div>
          {/* Step 2 */}
          <div className="relative flex flex-col md:flex-row items-start mb-16 md:mb-24">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-10 h-10 bg-[#ff4d8d] rounded-full z-10 flex items-center justify-center shadow-[0_0_20px_rgba(255,77,141,0.7)]">
              <span className="font-bold">2</span>
            </div>
            <div className="hidden md:block md:w-1/2" />
            <div className="pl-24 md:pl-12 md:w-1/2">
              <div className="bg-black/30 rounded-xl p-6 border border-white/10 transform transition-all hover:border-[#ff4d8d]/50">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-[#ff4d8d] mr-2 drop-shadow-[0_0_10px_rgba(255,77,141,0.5)]" />
                  <h3 className="text-xl font-bold">Match</h3>
                </div>
                <p className="text-white/70">
                  We match you with however many creators you need from our database, picked with precision using our AI-powered algorithm.
                </p>
              </div>
            </div>
          </div>
          {/* Step 3 */}
          <div className="relative flex flex-col md:flex-row items-start mb-16 md:mb-24">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-10 h-10 bg-[#ff4d8d] rounded-full z-10 flex items-center justify-center shadow-[0_0_20px_rgba(255,77,141,0.7)]">
              <span className="font-bold">3</span>
            </div>
            <div className="pl-24 md:pl-0 md:pr-12 md:w-1/2 md:text-right">
              <div className="bg-black/30 rounded-xl p-6 border border-white/10 md:ml-auto md:mr-0 transform transition-all hover:border-[#ff4d8d]/50">
                <div className="flex items-center mb-4 md:justify-end">
                  <Send className="h-6 w-6 text-[#ff4d8d] mr-2 md:order-2 md:ml-2 md:mr-0 drop-shadow-[0_0_10px_rgba(255,77,141,0.5)]" />
                  <h3 className="text-xl font-bold">Deliver</h3>
                </div>
                <p className="text-white/70">
                  We send them over to you with all the relevant information you need to make contact and start your collaboration.
                </p>
              </div>
            </div>
            <div className="hidden md:block md:w-1/2" />
          </div>
          {/* Step 4 */}
          <div className="relative flex flex-col md:flex-row items-start">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-10 h-10 bg-[#ff4d8d] rounded-full z-10 flex items-center justify-center shadow-[0_0_20px_rgba(255,77,141,0.7)]">
              <span className="font-bold">4</span>
            </div>
            <div className="hidden md:block md:w-1/2" />
            <div className="pl-24 md:pl-12 md:w-1/2">
              <div className="bg-black/30 rounded-xl p-6 border border-white/10 transform transition-all hover:border-[#ff4d8d]/50">
                <div className="flex items-center mb-4">
                  <Headphones className="h-6 w-6 text-[#ff4d8d] mr-2 drop-shadow-[0_0_10px_rgba(255,77,141,0.5)]" />
                  <h3 className="text-xl font-bold">Support</h3>
                </div>
                <p className="text-white/70">
                  We stay listening and cater to all your needs, providing ongoing support throughout your campaign.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Help Creators Section */}
      <section id="how-we-help-creators" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-6">How We Help Creators</h2>
        <p className="text-center text-white/80 max-w-2xl mx-auto mb-16">
          Our process is designed to help creators grow, get discovered, and earn guaranteed pay by connecting with top brands.
        </p>
        <div className="relative max-w-5xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#ff4d8d] to-[#ff1a6c] -translate-x-1/2" />
          {/* Step 1 */}
          <div className="relative flex flex-col md:flex-row items-start mb-16 md:mb-24">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-10 h-10 bg-[#ff4d8d] rounded-full z-10 flex items-center justify-center shadow-[0_0_20px_rgba(255,77,141,0.7)]">
              <span className="font-bold">1</span>
            </div>
            <div className="pl-24 md:pl-0 md:pr-12 md:w-1/2 md:text-right">
              <div className="bg-black/30 rounded-xl p-6 border border-white/10 md:ml-auto md:mr-0 transform transition-all hover:border-[#ff4d8d]/50">
                <h3 className="text-xl font-bold mb-2">Add you to our database</h3>
                <p className="text-white/70">
                  Get discovered by top brands as soon as you join. We make sure your profile is seen by the right people.
                </p>
              </div>
            </div>
            <div className="hidden md:block md:w-1/2" />
          </div>
          {/* Step 2 */}
          <div className="relative flex flex-col md:flex-row items-start mb-16 md:mb-24">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-10 h-10 bg-[#ff4d8d] rounded-full z-10 flex items-center justify-center shadow-[0_0_20px_rgba(255,77,141,0.7)]">
              <span className="font-bold">2</span>
            </div>
            <div className="hidden md:block md:w-1/2" />
            <div className="pl-24 md:pl-12 md:w-1/2">
              <div className="bg-black/30 rounded-xl p-6 border border-white/10 transform transition-all hover:border-[#ff4d8d]/50">
                <h3 className="text-xl font-bold mb-2">Find your speciality</h3>
                <p className="text-white/70">
                  We analyze your strengths and style to match you with brands that fit your unique talents and audience.
                </p>
              </div>
            </div>
          </div>
          {/* Step 3 */}
          <div className="relative flex flex-col md:flex-row items-start">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-10 h-10 bg-[#ff4d8d] rounded-full z-10 flex items-center justify-center shadow-[0_0_20px_rgba(255,77,141,0.7)]">
              <span className="font-bold">3</span>
            </div>
            <div className="pl-24 md:pl-0 md:pr-12 md:w-1/2 md:text-right">
              <div className="bg-black/30 rounded-xl p-6 border border-white/10 md:ml-auto md:mr-0 transform transition-all hover:border-[#ff4d8d]/50">
                <h3 className="text-xl font-bold mb-2">Connect you with brands</h3>
                <p className="text-white/70">
                  We connect you with brands and ensure you get paid for your work—no matter your niche or experience.
                </p>
              </div>
            </div>
            <div className="hidden md:block md:w-1/2" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto bg-black/30 rounded-2xl p-10 border border-white/10">
          <h2 className="text-3xl font-bold mb-4">Ready to Kill?</h2>
          <p className="text-white/80 mb-8 text-lg">
            Join top brands using our service, and start crushing your campaign today.
          </p>
          <div className="flex justify-center">
            <Link href="/schedule-demo" className="inline-flex items-center justify-center px-8 py-3 bg-[#ff4d8d] text-white font-medium rounded-lg hover:bg-[#ff1a6c] transition-colors shadow-[0_0_20px_rgba(255,77,141,0.7)]">
              Schedule a Demo <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/10 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Zap className="h-6 w-6 text-[#ff4d8d] drop-shadow-[0_0_15px_rgba(255,77,141,0.7)]" />
            <span className="font-semibold">Creator Pulse</span>
          </div>
          <div className="text-sm text-white/60">© 2025 CreatorPulse. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}