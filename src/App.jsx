import React, { useState, useEffect } from "react";

const CLIENT_ID = "YOUR_SPOTIFY_CLIENT_ID";
const REDIRECT_URI =
  window.location.hostname === "localhost"
    ? "http://localhost:5173/"
    : "https://spotify-music-finder-eta.vercel.app/";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

function App() {
  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [albums, setAlbums] = useState([]);

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

  const searchAlbums = async (e) => {
    e.preventDefault();
    const result = await fetch(
      `https://api.spotify.com/v1/search?q=${searchKey}&type=album`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await result.json();
    setAlbums(data.albums?.items || []);
  };

  const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-6 mt-8">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-emerald-700 tracking-tight">
          🎵 Spotify Music Finder
        </h1>

        {!token ? (
          <div className="flex justify-center">
            <a
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition duration-200"
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
                className="flex-1 border border-neutral-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                type="text"
                placeholder="Search for an album..."
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition duration-200"
              >
                Search
              </button>
              <button
                onClick={logout}
                className="bg-neutral-300 hover:bg-neutral-400 text-neutral-800 px-4 py-3 rounded-xl font-semibold transition duration-200"
              >
                Logout
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-lg transition duration-200 p-3 text-center"
                >
                  <img
                    src={album.images[0]?.url}
                    alt={album.name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h2 className="font-semibold text-lg text-neutral-800">
                    {album.name}
                  </h2>
                  <p className="text-sm text-neutral-500">
                    {album.artists[0].name}
                  </p>
                  <a
                    href={album.external_urls.spotify}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-3 text-emerald-600 font-medium hover:underline"
                  >
                    Open on Spotify
                  </a>
                </div>
              ))}
            </div>

            {albums.length === 0 && (
              <p className="text-center text-neutral-500 mt-6">
                No albums found. Try searching something else 🎧
              </p>
            )}
          </>
        )}
      </div>

      <footer className="text-sm text-neutral-500 mt-10">
        Built with ❤️ using Spotify API
      </footer>
    </div>
  );
}

export default App;
