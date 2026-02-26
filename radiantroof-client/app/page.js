// app/page.js
export default function Home() {
  return (
   <div className="bg-gradient-to-r from-blue-100 via-white to-blue-100 min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
      
      {/* Hero Section */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-6 drop-shadow-lg">
        Welcome to <span className="text-blue-600">RadiantRoof Realty</span>
      </h1>
      
      <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl">
        Explore properties, discover new homes, and find your perfect space — all without logging in.
      </p>
      
      {/* Call-to-action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="#properties"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300"
        >
          Browse Properties
        </a>
        <a
          href="#contact"
          className="bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-md border border-blue-600 transition-all duration-300"
        >
          Contact Us
        </a>
      </div>

      {/* Decorative Section */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:scale-105 transform transition duration-300">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Modern Homes</h2>
          <p className="text-gray-600">Stylish and modern properties designed for comfort and elegance.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:scale-105 transform transition duration-300">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Verified Listings</h2>
          <p className="text-gray-600">Every property is verified so you can trust your investment.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:scale-105 transform transition duration-300">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Easy Navigation</h2>
          <p className="text-gray-600">Find your dream property quickly with our intuitive interface.</p>
        </div>
      </div>

    </div>
  );
}