import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  // Initialize the navigate function
  const navigate = useNavigate();

  const handleExploreClick = () => {
    // This will take the user to the admin dashboard
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex flex-col gap-12 pb-12 bg-white">
      {/* 1. Hero Section */}
      <section className="relative h-[500px] w-full bg-gray-900 flex items-center justify-center text-white overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600" 
          alt="Hero Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight uppercase">
            THE NEXT GEN STORE
          </h1>
          <p className="text-lg md:text-2xl mb-8 text-gray-300 font-light">
            Elegance meets performance. Shop the new collection.
          </p>
          
          <button 
            onClick={handleExploreClick}
            className="bg-white text-black px-10 py-4 rounded-md font-bold uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
          >
            Explore Collection
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;