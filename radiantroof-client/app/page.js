import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    
     <div className="max-w-7xl mx-auto p-4 space-y-6 text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to Radiant Roof Investments</h1>
      <p className="text-lg text-gray-700 mb-8">
        Find your next profitable fix & flip property in 60 seconds!
      </p>
      <Link 
        href="/properties" 
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
      >
        Browse Properties
      </Link>
    <div className="p-8 bg-blue-100 text-blue-900 font-bold">
      Tailwind is working! 🎉
    </div>
  );
    </div>
  );
}
