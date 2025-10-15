import { useState, useEffect } from "react";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
    };

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => {
        setAccessToken(data.access_token);
      })
      .catch((error) => {
        setError("Failed to authenticate with Spotify");
        console.error("Auth error:", error);
      });
  }, []);

  async function search() {
    if (!searchInput.trim()) return;

    setIsLoading(true);
    setError("");
    setAlbums([]);

    try {
      let artistParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      // Get Artist
      const artistResponse = await fetch(
        "https://api.spotify.com/v1/search?q=" +
          encodeURIComponent(searchInput) +
          "&type=artist",
        artistParams,
      );

      const artistData = await artistResponse.json();

      if (!artistData.artists.items.length) {
        setError("No artist found. Try a different search term.");
        setIsLoading(false);
        return;
      }

      const artistID = artistData.artists.items[0].id;

      // Get Artist Albums
      const albumsResponse = await fetch(
        "https://api.spotify.com/v1/artists/" +
          artistID +
          "/albums?include_groups=album&market=US&limit=50",
        artistParams,
      );

      const albumsData = await albumsResponse.json();
      setAlbums(albumsData.items || []);
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Search error:", error);
    }

    setIsLoading(false);
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      search();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white-80 backdrop-blur-md shadow-soft border-b border-gray-200-50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center gradient-text mb-2">
            Spotify Music Finder 🎧
          </h1>
          <p className="text-center text-gray-500 text-sm sm:text-base">
            Discover albums from your favorite artists
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search Section */}
        <div className="bg-white-90 backdrop-blur-sm shadow-soft rounded-2xl p-6 mb-8 border border-gray-200-50 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 rounded-full text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all duration-300 text-base shadow-sm"
              placeholder="Search for an artist..."
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
            />
            <button
              className="bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              onClick={search}
              disabled={isLoading || !searchInput.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </div>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-gray-500 text-lg font-medium">
              <div className="w-6 h-6 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              Searching for music...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
            <div className="text-red-600 font-medium mb-2">😔 Oops!</div>
            <div className="text-red-500 text-sm">{error}</div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && albums.length === 0 && searchInput && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No albums found
            </h3>
            <p>Try searching for a different artist</p>
          </div>
        )}

        {/* Welcome State */}
        {!searchInput && albums.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6 float-animation">🎶</div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-4">
              Welcome to Spotify Music Finder
            </h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Search for any artist to discover their albums and explore their
              music
            </p>
          </div>
        )}

        {/* Albums Grid */}
        {albums.length > 0 && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-2">
                Found {albums.length} album{albums.length !== 1 ? "s" : ""}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {albums.map((album, index) => (
                <div
                  key={album.id}
                  className="bg-white-95 backdrop-blur-sm rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 p-6 border border-gray-200-50 opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  {album.images && album.images.length > 0 && (
                    <div className="rounded-xl overflow-hidden shadow-md mb-4 transform transition-transform duration-300 hover:scale-105">
                      <img
                        src={album.images[0].url}
                        alt={`${album.name} album cover`}
                        className="w-full h-48 sm:h-56 object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <h3
                      className="text-lg font-semibold text-gray-800 line-clamp-2 leading-tight"
                      title={album.name}
                    >
                      {album.name}
                    </h3>

                    <div className="text-sm text-gray-500 font-medium">
                      <span className="inline-flex items-center gap-2">
                        📅 Released:{" "}
                        {new Date(album.release_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>

                    {album.total_tracks && (
                      <div className="text-xs text-gray-400 font-medium">
                        🎵 {album.total_tracks} track
                        {album.total_tracks !== 1 ? "s" : ""}
                      </div>
                    )}

                    <a
                      href={album.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-300 text-sm inline-block w-full text-center"
                    >
                      Open in Spotify
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white-80 backdrop-blur-sm border-t border-gray-200-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p className="mb-2">Powered by Spotify Web API</p>
            <p>Built with ❤️ using React & Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
