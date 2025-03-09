import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Monetize Your Idle Computing Power
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Share your CPU/GPU resources and earn cryptocurrency rewards through instant micropayments.
            Join our decentralized computing marketplace today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
            >
              Start Sharing
            </Link>
            <Link
              href="/marketplace"
              className="px-6 py-3 border border-blue-600 hover:bg-blue-600/10 text-blue-400 font-medium rounded-lg transition-colors text-center"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
        <div className="relative w-full max-w-md aspect-square bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('/cpu-gpu-illustration.svg')] bg-contain bg-center bg-no-repeat opacity-70"></div>
          <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-2xl blur-xl -z-10"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-400 text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Register Your Resources</h3>
            <p className="text-gray-400">
              Sign up and register your CPU/GPU resources. Set your pricing, availability schedule, and resource limits.
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-purple-400 text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Share Computing Power</h3>
            <p className="text-gray-400">
              Our platform automatically allocates tasks to your resources based on demand and your specifications.
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-green-400 text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Earn Rewards</h3>
            <p className="text-gray-400">
              Receive instant micropayments in cryptocurrency for every computation task your resources complete.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Why Choose ComputeShare</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-3">For Resource Providers</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Monetize idle computing resources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Set your own rates and availability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Receive instant payments with near-zero fees</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Secure and transparent resource monitoring</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-3">For Resource Consumers</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Access on-demand computing power</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Pay only for what you use</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Scale resources up or down instantly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>No upfront costs or long-term commitments</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join our growing community of resource providers and consumers. Start sharing your computing power or find the resources you need today.
        </p>
        <Link
          href="/dashboard"
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors inline-block"
        >
          Create Your Account
        </Link>
      </section>
    </div>
  );
}
