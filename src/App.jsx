import React, { useState, useEffect } from "react";

// Spotify API configuration
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

// Dynamically choose the redirect URI (local vs production)
const REDIRECT_URI =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000/"
    : import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

function App() {
  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [albums, setAlbums] = useState([]);

  // Handle Spotify authentication token
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  // Search albums using Spotify Web API
  const searchAlbums = async (e) => {
    e.preventDefault();
    if (!searchKey.trim()) return;

    try {
      const result = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchKey,
        )}&type=album&limit=20`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await result.json();
      setAlbums(data.albums?.items || []);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  // Construct login URL
  const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-emerald-50 text-neutral-900 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 mt-10 backdrop-blur-md border border-gray-100">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 text-emerald-700 tracking-tight">
          🎵 Spotify Music Finder
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Discover albums from your favorite artists
        </p>

        {!token ? (
          <div className="flex justify-center">
            <a
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              href={loginUrl}
            >
              Login to Spotify
            </a>
          </div>
        ) : (
          <>
            <form
              onSubmit={searchAlbums}
              className="flex flex-col sm:flex-row gap-3 items-center mb-6"
            >
              <input
                className="flex-1 border border-gray-200 rounded-full p-3 px-5 focus:ring-2 focus:ring-emerald-400 focus:outline-none shadow-sm"
                type="text"
                placeholder="Search for an album..."
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Search
              </button>
              <button
                onClick={logout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-3 rounded-full font-semibold transition-all duration-300"
              >
                Logout
              </button>
            </form>

            {albums.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 text-center transform hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    <img
                      src={album.images[0]?.url}
                      alt={album.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <h2 className="font-semibold text-lg text-gray-800 truncate">
                      {album.name}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">
                      {album.artists[0].name}
                    </p>
                    <a
                      href={album.external_urls.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-2 text-emerald-600 font-medium hover:underline"
                    >
                      Open on Spotify
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 mt-6">
                No albums found yet — try searching for your favorite artist 🎧
              </p>
            )}
          </>
        )}
      </div>

      <footer className="text-sm text-gray-500 mt-10 text-center">
        <p>Built with ❤️ using React, Tailwind & Spotify API</p>
        <p className="mt-1">
          <a
            href="https://developer.spotify.com"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-600 hover:underline"
          >
            Spotify Developer Platform
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
