# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pet Manager ("Pet's Life") — a React Native (Expo managed workflow) mobile app for managing dog profiles, health records, schedules, and expenses. Uses Firebase for auth, database, and storage.

## Common Commands

```bash
npm run start        # Start Expo dev server
npm run android      # Run on Android
npm run ios          # Run on iOS
```

No test or lint scripts are configured. Builds are managed through EAS (`eas.json`).

## Architecture

### Tech Stack
- React Native 0.79 / Expo 53 / TypeScript (React 19, New Architecture)
- Firebase: Auth (email/password), Firestore (database), Storage (images)
- React Navigation v6 (bottom tabs + nested stacks)
- styled-components/native for styling
- Phosphor React Native + Vector Icons for icons

### Navigation Structure
- **AuthStack**: InitialScreen → SignIn / SignUp / ForgotPassword
- **Main (Bottom Tabs)**: Profile | Health | Schedule | Expenses | Settings
- Each tab has a nested stack navigator for detail/add/edit screens

### State Management
- `DogProfileContext` (React Context) holds the selected dog profile globally
- AsyncStorage persists the selected dog ID across sessions
- Screen-level state via useState hooks

### Data Layer
- `src/firebase/FirestoreService.tsx` — centralized CRUD utilities (`addDocument`, `updateDocument`, `getUserDocuments`, `deleteUserDocument`); auto-appends userId
- `src/firebase/Firestore.tsx` — Firebase instance export
- Firestore collections: `dogProfiles`, `schedules`, `healthRecords`, `expenses` (all scoped by userId or dogId)

### Folder Structure
```
src/
  assets/        — Static images
  components/    — Shared components (GlobalAlert)
  context/       — DogProfileContext
  firebase/      — Firebase config and service utilities
  hooks/         — Custom hooks (colocated near screens that use them)
  screens/       — Feature-based screen folders, each with styles.ts
  types/         — TypeScript type definitions
  utils/         — Utilities (dateFormatter)
```

## Conventions

- **Styling**: styled-components/native with colocated `styles.ts` files per screen. Color palette: purple (#41245C), blue (#7289DA), white (#fff). Font: Poppins.
- **Screen pattern**: Each screen folder contains the main component + `styles.ts`. Add/Edit screens are separate folders.
- **Firebase queries**: Always scope by userId (from Firebase Auth) or dogId. Use FirestoreService utilities when possible.
- **Android package**: `com.petmanager.cat`
- **TypeScript**: strict mode enabled, extends `expo/tsconfig.base`
