# Spotify Music Finder 🎵

A React application that allows users to search for artists and discover their albums using the Spotify Web API.

## Features ✨

- **Artist Search**: Search for any artist by name
- **Album Discovery**: View all albums by the searched artist
- **Rich Album Display**: See album artwork, release dates, and direct links to Spotify
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Real-time Search**: Press Enter or click the search button to find albums instantly

## Prerequisites 📋

Before running this project, you'll need:

- Node.js (v16 or higher)
- npm or yarn package manager
- A Spotify Developer Account

## Installation 🚀

1. Clone the repository:
   ```bash
   git clone https://github.com/TracyK10/spotify-music-finder
   cd spotify-music-finder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Setup 🔐

1. Create a Spotify App on the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Get your Client ID and Client Secret from the app settings
3. Create a `.env` file in the root directory:
   ```env
   VITE_CLIENT_ID=your_spotify_client_id_here
   VITE_CLIENT_SECRET=your_spotify_client_secret_here
   ```

## Running the Project 🏃‍♂️

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production 🔨

```bash
npm run build
```

## Project Structure 📁

```
spotify-music-finder/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables (gitignored)
├── package.json         # Project dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## Technologies Used 🛠️

- **React 18** - UI framework
- **Vite** - Build tool and development server
- **Bootstrap** - CSS framework for styling
- **React Bootstrap** - React components for Bootstrap
- **Spotify Web API** - Music data source
- **Environment Variables** - Secure API credential management

## How It Works 🔍

1. The app authenticates with Spotify using the Client Credentials flow
2. When a user searches for an artist, it queries the Spotify Search API
3. It retrieves the artist's ID from the search results
4. Using the artist ID, it fetches all albums from the Spotify Albums API
5. Albums are displayed in a responsive grid with artwork and details

## API Rate Limits ⚠️

The Spotify Web API has rate limits:
- Client Credentials flow: Appropriate for server-to-server authentication
- Be mindful of request frequency to avoid hitting rate limits

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is for educational purposes as part of a [Codedex tutorial](https://www.codedex.io/projects/build-an-album-finder-with-spotify-api).

---

Built with ❤️ using React and the Spotify Web API
