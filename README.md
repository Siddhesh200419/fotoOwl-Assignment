# FotoOwl

A React Native photo gallery app built with Expo. Browse images from the [Picsum Photos](https://picsum.photos/) API, save favourites per account, view image details, and manage a user profile with light/dark theme support.

## Features

### Authentication
- Register with name, email, gender, mobile, address, and city
- Login with email and password
- Session persists across app restarts (AsyncStorage)
- Logout from the Profile tab

### Gallery (Home)
- Infinite-scroll image grid powered by Picsum Photos API
- Search images by photographer name
- Filter by author name: All, A–M, N–Z
- Pull to refresh
- Tap an image to open the detail screen

### Favourites
- Tap the heart icon on any image to save it
- Favourites are stored **per user account** — each login sees only their own saved photos
- Search within saved favourites

### Image Details
- Full-size image preview with loading placeholder
- Save image to device gallery
- Share image via the system share sheet
- Add or remove from favourites

### Profile
- View and edit personal details
- Choose from preset avatars
- Toggle dark mode
- Log out

## Tech Stack

| Layer | Tools |
|-------|-------|
| Framework | React Native 0.81, Expo 54 |
| Language | TypeScript |
| Navigation | React Navigation (native stack + bottom tabs) |
| State | Zustand with AsyncStorage persistence |
| Data fetching | TanStack React Query (infinite query) |
| Images | expo-image |
| Storage | @react-native-async-storage/async-storage |

## Project Structure

```
FotoOwl/
├── index.js                 # App entry point
├── app.json                 # Expo config
├── src/
│   ├── App.tsx              # Root providers (SafeArea, React Query)
│   ├── app/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthStack.tsx
│   │   └── MainTabs.tsx
│   ├── screens/
│   │   ├── auth/            # Login, Register
│   │   ├── home/            # Gallery, Image details
│   │   ├── favorites/
│   │   └── profile/
│   ├── components/          # Reusable UI (ImageCard, SearchBar, etc.)
│   ├── store/               # Zustand stores (auth, favourites, theme)
│   ├── services/            # API, storage, media download, haptics
│   ├── hooks/
│   ├── utils/
│   ├── theme/
│   └── types/
└── assets/                  # App icons and splash screen
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm or yarn
- [Expo Go](https://expo.dev/go) on a physical device, **or**
- Android Studio (Android emulator) / Xcode (iOS simulator)

## Installation

1. Clone or download the project and open the `FotoOwl` folder:

   ```bash
   cd FotoOwl
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Run on a device or emulator:

   ```bash
   npm run android   # Android emulator or connected device
   npm run ios       # iOS simulator (macOS only)
   ```

   You can also scan the QR code shown in the terminal using **Expo Go** on your phone.

## Usage

1. **Register** — Create an account on the Register screen. You will be redirected to Login after signup.
2. **Login** — Sign in with your registered email and password.
3. **Browse** — Scroll the Gallery tab to load more photos. Use search and filters to narrow results.
4. **Favourite** — Tap the heart on a gallery tile or on the image detail screen.
5. **Profile** — Tap Edit to update your details or change your avatar. Use the dark mode switch under Preferences.

> **Note:** User accounts and favourites are stored locally on the device. Clearing app data will remove them. This is intentional for the assignment/demo setup.

## Permissions

The app requests the following permissions when needed:

| Permission | Used for |
|------------|----------|
| Media Library | Saving photos to the device gallery |

Sharing uses the system share sheet and does not require extra permissions beyond file access during the share flow.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Start on Android |
| `npm run ios` | Start on iOS |
| `npm run lint` | Run ESLint |

## Architecture Notes

- **Auth state** — `authStore` (Zustand + persist). User records are saved in AsyncStorage keyed by email.
- **Favourites** — `favoritesStore` keeps a separate favourites map for each user email. Logging in loads that user's list; logging out clears the active list.
- **Gallery data** — Fetched from `https://picsum.photos/v2/list` via React Query infinite query with pagination.
- **Theming** — Central `theme.ts` palette; `themeStore` toggles light/dark mode with persistence.

## Known Limitations

- Authentication is local-only (no backend server)
- Passwords are stored in plain text on device storage — suitable for demo/assignment use only
- Requires an internet connection to load gallery images from Picsum

## License

Private — assignment project.
