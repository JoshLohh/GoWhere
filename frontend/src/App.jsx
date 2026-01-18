import { useState } from 'react'
import { MapPin, Clock, Sparkles, Coffee, Heart, UtensilsCrossed, TrendingUp, Star, Navigation, ArrowRight, ThumbsUp, Bookmark, ChevronLeft, AlertCircle } from 'lucide-react'
import StartPage from './StartPage'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function App() {
  const [showStartPage, setShowStartPage] = useState(true)
  const [selectedVibe, setSelectedVibe] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [selectedStops, setSelectedStops] = useState(5) // Default to 5 stops
  const [location, setLocation] = useState('')
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)

  // New state for API data
  const [stops, setStops] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const vibes = [
    { id: 'chill', label: 'Chill', icon: Coffee, color: 'bg-blue-400', desc: 'Relaxed cafes & parks' },
    { id: 'date', label: 'Date', icon: Heart, color: 'bg-pink-400', desc: 'Romantic spots' },
    { id: 'foodcrawl', label: 'Food Crawl', icon: UtensilsCrossed, color: 'bg-orange-400', desc: 'Best eats in town' },
    { id: 'trendy', label: 'Trending', icon: TrendingUp, color: 'bg-purple-400', desc: 'Viral on socials' }
  ]

  const popularLocations = [
    'Orchard Road', 'Marina Bay Sands', 'Clarke Quay', 'Chinatown', 'Little India',
    'Bugis', 'Sentosa', 'Raffles Place', 'Tiong Bahru', 'Kampong Glam', 'Haji Lane',
    'Dhoby Ghaut', 'Somerset', 'Tanjong Pagar', 'Holland Village', 'East Coast Park',
    'Changi Airport', 'Jewel Changi', 'VivoCity', 'Gardens by the Bay'
  ]

  const filteredLocations = location
    ? popularLocations.filter(loc => loc.toLowerCase().includes(location.toLowerCase()))
    : popularLocations

  const handleGenerateRoute = async () => {
    if (!selectedVibe || !location) {
      setError("Please select a vibe and a location.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        vibe: selectedVibe,
        location: location,
        stops: selectedStops,
      });
      
      const response = await fetch(`${API_URL}/api/places?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred.");
      }
      
      const data = await response.json();
      setStops(data.stops || []);
      setShowResults(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = () => {
    setShowStartPage(false)
  }

  if (showStartPage) {
    return <StartPage onStart={handleStart} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-custom p-2 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-custom bg-clip-text text-transparent">
                GoWhere
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-custom-orange transition">My Routes</button>
              <button className="bg-gradient-custom text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showResults ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                What's Your Vibe Today?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Tell us your mood, location, and time. We'll plan the perfect route with the best spots in Singapore.
              </p>
            </div>

            {/* Vibe Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                Choose Your Vibe
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {vibes.map((vibe) => {
                  const Icon = vibe.icon
                  return (
                    <button
                      key={vibe.id}
                      onClick={() => setSelectedVibe(vibe.id)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        selectedVibe === vibe.id
                          ? 'border-custom-yellow bg-yellow-50 shadow-lg scale-105'
                          : 'border-gray-200 bg-white hover:border-yellow-200 hover:shadow-md'
                      }`}
                    >
                      <div className={`${vibe.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{vibe.label}</h4>
                      <p className="text-sm text-gray-600">{vibe.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Input Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Starting Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onFocus={() => setShowLocationSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                    placeholder="e.g., Orchard Road, Clarke Quay"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-yellow focus:border-transparent outline-none"
                  />
                  {showLocationSuggestions && filteredLocations.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredLocations.slice(0, 8).map((loc, index) => (
                        <button
                          key={index}
                          onClick={() => { setLocation(loc); setShowLocationSuggestions(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-yellow-50 transition flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{loc}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time Available
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-yellow focus:border-transparent outline-none">
                    <option>2-3 hours</option>
                    <option>3-4 hours</option>
                    <option>4-5 hours</option>
                    <option>Half day</option>
                    <option>Full day</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Stops
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={selectedStops}
                  onChange={(e) => setSelectedStops(Number(e.target.value))}
                  placeholder="e.g., 5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-yellow focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 3-10 stops for best experience</p>
              </div>

              {error && (
                <div className="my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg" role="alert">
                  <div className="flex">
                    <div className="py-1"><AlertCircle className="w-5 h-5 text-red-500 mr-3" /></div>
                    <div>
                      <p className="font-bold">Oops! Something went wrong.</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerateRoute}
                disabled={!selectedVibe || !location || isLoading}
                className="w-full bg-gradient-custom text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate My Route</span>
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Results View */}
            <div className="mb-6">
              <button
                onClick={() => { setShowResults(false); setError(null); }}
                className="mb-4 flex items-center gap-2 text-custom-orange hover:text-custom-orange font-medium transition"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Search
              </button>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 capitalize">Your {selectedVibe} Route</h2>
                  <p className="text-gray-600">{stops.length} suggested stops</p>
                </div>
                <button
                  onClick={() => { setShowResults(false); setError(null); }}
                  className="px-6 py-3 border-2 border-custom-yellow text-custom-orange rounded-lg font-semibold hover:bg-yellow-50 transition"
                >
                  New Route
                </button>
              </div>
            </div>

            {/* Route Cards */}
            <div className="space-y-6">
              {stops.map((stop, index) => (
                <div key={stop.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-custom text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{stop.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{stop.type.replace(/_/g, ' ')}</p>
                        <div className="flex items-center gap-4 my-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold text-gray-900">{stop.rating}</span>
                            <span className="text-sm text-gray-500">({stop.reviews} reviews)</span>
                          </div>
                        </div>
                        <div className="bg-yellow-50 border-l-4 border-custom-yellow p-4 rounded-r-lg mb-4">
                          <p className="text-sm text-gray-700 flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-custom-orange flex-shrink-0 mt-0.5" />
                            <span><strong>Why this spot:</strong> {stop.explanation}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}