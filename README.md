# TopFive

**TopFive** is a full-stack social ranking app that allows users to create, share, and discover personalized "top five" lists across various categories (movies, books, music, games, etc.). It's a cross-platform application available as a mobile app (iOS/Android) and web version, built with React Native and Expo, with a backend powered by Supabase.

![logo](assets/adaptive-icon.png)

## Stack

* **Language(s):** Primarily TypeScript, JavaScript.
* **Framework / runtime:** Expo 54 (React Native 0.81.5) + Next.js-style routing (expo-router 6)
* **Backend**: Currently run using Python FastAPI
* **Notable libraries:** Supabase (authentication & database), React Context API (state management), NativeWind (Tailwind CSS for React Native), react-native-google-mobile-ads (monetization), i18next (internationalization)

## Directory Structure

```text
app/                    Expo Router file-based routing (screens & pages)
├── (auth)/             Authentication flows (login, signup)
├── (tabs)/             Main tabbed navigation interface
├── details/            Top Five item detail view
├── editProfile/        User profile editing
├── followers/          Follower management
├── form/               Create/edit top five form
├── frameSelector/      Frame/template selection for sharing
├── group/              Group or collection management
├── notifications/      Notifications display
├── search/             Search functionality
├── settings/           User settings
└── topFiveSelector/    Selection of top five entries

components/             Reusable UI components
├── AdBanner* Google Mobile Ads components (.web variant for web builds)
├── AppText/Input       Custom form elements
├── CategoryTarBar      Tab navigation for categories
├── CollectionStructure Visual structure for collections
├── NotificationModal   In-app notification display
├── Icons.jsx           SVG/Vector icon library
└── NativeAdCard* Native ad rendering (platform-specific)

context/                React Context for global state
├── AuthContext.js      User authentication state
├── CollectionContext   Top Five collection state & operations
├── ThemeContext        Light/dark mode & theming
├── NotificationContext In-app notifications
├── SearchContext       Search query & results
└── FontSizeContext     Accessibility font sizing

hooks/                  Custom React hooks
├── useCollapsibleHeader Collapsible header scroll behavior
└── useResource         Data fetching & caching logic

lib/                    Utility & integration libraries
├── supabase.js         Supabase client initialization
├── pushNotifications   Push notification setup
├── adsConsent* GDPR/privacy consent handling (.web variant)
└── rewarderAd* Rewarded ad integration (.web variant)

api/                    Serverless functions (Vercel)
└── og-profile.js       Open Graph image generation for profile sharing

src/                    Older/alternate page structure (appears to mirror app/ for web)
├── Collection/, Home/, Profile/, etc.

constants/              App constants & configuration
translations/           i18n translation files
public/                 Static assets (web)
```

## How it fits together

Users authenticate via AuthContext (Google/Apple/email), which persists state in Supabase. The app uses expo-router to handle navigation across tabs (feed, categories, profile). Collections and search queries are managed by their own contexts. Components leverage NativeWind for styling (Tailwind CSS compiled to React Native), and the code splits rendering between mobile (.tsx) and web (.web.tsx) variants. Monetization runs through Google Mobile Ads, with consent handling via context. The web version is deployed to Vercel (vercel.json routes SPA requests).

## How to run it
### Development
```text
# Install dependencies
pnpm install

# Start development server (interactive selection of platform)
pnpm start

# Run on specific platform
pnpm ios        # iOS simulator
pnpm android    # Android emulator
pnpm web        # Web browser
```

### Linting and formating
```text
pnpm lint       # Check code
pnpm format     # Auto-fix & format
```

### Building
```
pnpm prebuild
```

Required env vars: Supabase project URL and API key (in Supabase client config), Google Mobile Ads app IDs (in app.json).

### Developer build
You can install the developer build [here](https://expo.dev/accounts/leftjoiners/projects/topfive/builds/4516b2f0-32c9-4ac5-a283-c87f11b29a85). Once installed, you can run it on a local-hosted server with `npx expo start`.
