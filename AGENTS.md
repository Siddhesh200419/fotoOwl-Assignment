## Project

FotoOwl.ai React Native intern assignment — Expo app with mock auth, an infinite-scroll image gallery (picsum), search/filter, favorites, image detail + download-to-gallery, and a profile screen. No real backend; everything persists to AsyncStorage. Full spec lives in `FotoOwl_RN_Assignment_PRD.md` in the repo root — treat it as the source of truth for scope and acceptance criteria.

## Status

- **Expo SDK 54** project scaffolded and running. Phase 0 (folder structure, navigation shell, `QueryClientProvider`) is done.
- Everything from Phase 1 onward (auth, gallery, search, favorites, details/download, profile, polish) is **not yet built**. Check the PRD's phase list and this repo's git log to see what's actually landed before assuming a phase is complete — don't re-scaffold Phase 0 work.

## Commands

```bash
npx expo start              # start dev server
npx expo start -c           # start with cache cleared (use if metro acts up after adding deps)
npx expo install <package>  # ALWAYS use this, not npm/yarn add, for Expo-managed deps (resolves SDK-compatible versions)
npx tsc --noEmit            # typecheck
npx jest                    # run tests (once Phase 8 test setup exists)
eas build -p android --profile preview   # produce the submission APK
```

Test on a real Android device via Expo Go, not an emulator, for anything touching `expo-media-library` / `expo-file-system` (permission prompts and gallery writes don't reliably behave the same on emulators).

## Stack & non-negotiables

- **State:** Zustand + `persist` (AsyncStorage). Don't introduce Redux/Context-as-state-store — one state pattern for the whole app.
- **Data fetching:** TanStack Query (`useInfiniteQuery`) for the gallery. Don't hand-roll fetch/pagination logic outside of it.
- **Forms:** the custom `useForm` hook in `hooks/useForm.ts`, reused across Register/Login/Profile-edit. Don't pull in a form library.
- **Images:** `expo-image`, not `Image` from `react-native` — needed for caching behavior.
- **TypeScript:** strict, no `any` in new code. Type shared shapes in `types/index.ts` rather than inlining duplicate interfaces per screen.
- **No real backend.** All "server" behavior is AsyncStorage reads/writes through `services/storage.ts`. Don't add fetch calls to fake endpoints.

## Folder structure

```
src/
  app/            # RootNavigator, AuthStack, MainTabs
  screens/        # auth/, home/, favorites/, profile/
  components/     # ImageCard, SearchBar, FilterChips, FormField, RadioGroup, Dropdown, EmptyState, LoadingSpinner
  store/          # authStore, favoritesStore, themeStore (Zustand)
  hooks/          # useForm, useDebouncedValue, useAuth, useGalleryImages
  services/       # api.ts (picsum), storage.ts (AsyncStorage wrapper), mediaDownload.ts
  types/
  theme/
assets/avatars/   # bonus avatar picker images
```

New files go where this structure implies — a new screen under `screens/<domain>/`, a new store under `store/`, etc. Don't invent a parallel structure.

## Working in phases

This project is built phase-by-phase per the PRD (Phase 0 done → Phase 8 remaining). When asked to do "the next phase" or a specific phase number:

1. Only touch the files that phase's PRD entry calls for. Don't jump ahead and wire up later-phase features "while you're in there."
2. Confirm the phase's acceptance criteria (in the PRD) before considering it done.
3. Don't invent scope the PRD doesn't mention (extra screens, extra libraries) without flagging it first.
4. After a phase is verified working, it gets committed as its own commit — `git commit -m "phase N: <short description>"`. Don't bundle multiple phases into one commit.

## Known assumptions (keep consistent with these)

- Passwords are stored in AsyncStorage as **plain text** — intentional simplification for a no-backend assignment, not a bug to "fix" by adding hashing.
- Search/filter apply only to **already-fetched pages** from `useGalleryImages`, not the full picsum set. Scrolling further extends what's searchable. Don't silently change this to a full upfront fetch.
- City list, avatar set, and A–M/N–Z filter buckets are hardcoded — no need to make them dynamic/configurable.

## Testing

Jest + `@testing-library/react-native`, added in Phase 8. Scope is intentionally narrow: validators (email/mobile/password), `favoritesStore` add/remove, one `ImageCard` render test. Don't expand into full coverage unless asked — this is a time-boxed assignment, not a production codebase.