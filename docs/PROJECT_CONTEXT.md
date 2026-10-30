# Project Context and Architecture

## Project purpose

Firebase Sensor is a browser-based dashboard for temperature, humidity, light,
and other readings collected from sensors. Sensor readings and metadata are
stored in Firebase Realtime Database. The UI is intended to adapt to additional
rooms and reading categories through database metadata rather than hard-coded
UI changes.

The project is a Vue single-page application deployed to Firebase Hosting.

## Technology

- Node.js 26 in GitHub Actions.
- Yarn Classic (v1), with `yarn.lock` committed.
- Vue 3, Vue Router 4, and Vuex 4.
- Firebase Web SDK modular APIs for Authentication and Realtime Database.
- Vite 8 and `@vitejs/plugin-vue` for development and production builds.
- Vitest 5, Vue Test Utils, and jsdom for unit tests.
- `vite-plugin-pwa` and Workbox for service-worker generation and offline
  precaching.
- Chart.js for charts.
- ESLint flat configuration in `eslint.config.mjs`.

Check `package.json` for the currently installed version ranges.

## Application startup

1. `index.html` loads `/src/main.js`.
2. `src/main.js` loads Firebase configuration before mounting Vue:
   - Development: `/init.json` (served from `public/init.json`).
   - Production: Firebase Hosting's reserved `/__/firebase/init.json` endpoint.
3. The Firebase app is initialized from that configuration.
4. The app, Vue Router, and Vuex store are installed and mounted.
5. `src/App.vue` initializes Vuex's Firebase references and starts the
   authentication-state listener.
6. When a user is authenticated, the store loads rooms and categories and
   subscribes to errors.

Firebase web configuration, including its API key, is client-visible by
design. It is not an authorization boundary. Database access must be protected
by Firebase Realtime Database Security Rules.

## Architecture and data flow

```text
index.html
  -> src/main.js
      -> Firebase app initialization
      -> Vue app + Vue Router + Vuex
          -> src/App.vue (application shell and authentication UI)
          -> src/router/index.js
              -> HomePage
                  -> RecentData
                      -> RecentDataPanel (latest reading per room)
                  -> ChartSummary
                      -> ChartDetail (historical readings and Chart.js)
              -> ErrorPage (list and remove errors)
              -> CustomChartPage (select category/time window)
              -> StatisticsPage (legacy statistics calculation page)
```

### Firebase data model

The intended Realtime Database structure, described in `README.md`, is:

- `rooms/{roomId}`: room label, color, icon, and enabled readings.
- `readingCategories/{categoryId}`: label, unit, decimal precision, and sort
  order.
- `readings/{roomId}/{readingId}`: timestamp and sensor values.
- `errors/{errorId}`: timestamp and message.

The UI converts Firebase's keyed objects to arrays using
`src/helper/object2array.js`. Readings use Unix timestamps in seconds.

The statistics page also reads and writes `stats_daily` and `stats_monthly`
paths. It is not part of the documented core data model and should be treated
as legacy functionality until verified against the deployed database.

### State management

`src/store/index.js` creates the Vuex store. `src/store/default.js` contains
state, getters, mutations, and Firebase actions. It currently stores the
Firebase app, Auth, and Database instances in Vuex state using `markRaw`, along
with application data such as the user, rooms, categories, and errors.

Firebase Auth uses Google sign-in via popup. Realtime Database access is made
through Firebase's modular APIs in the store and components.

## Routes

Routes are declared in `src/router/index.js`:

- `/`: home dashboard, recent values and charts.
- `/errors`: Firebase error records and their removal.
- `/line-chart`: selectable chart category and time range.
- `/stats`: statistics calculation page.

Authentication-related UI visibility is not a substitute for database
authorization. The rule set supplied for this project is documented and
analyzed below, but confirm that it matches the rules currently deployed in
Firebase.

### Realtime Database Security Rules

The following rules were supplied by the project owner:

```json
{
  "rules": {
    ".read": "auth !== null && (root.child('users').child(auth.uid).child('canRead').val() == true)",
    ".write": "auth !== null && (root.child('users').child(auth.uid).child('canWrite').val() == true)",
    "users": {
      ".indexOn": ["key"]
    }
  }
}
```

The owner reports that the `users` table currently has two entries: the owner
account has `canWrite == true`, and the other account has `canRead == true`
and `canWrite == false`.

## Important implementation notes

- `src/components/statistics/statistics-page.vue` uses calls such as
  `this.$firebase.database()`, which follow the older Firebase compat API.
  The application initializes Firebase with the modular `firebase/app` API and
  does not currently initialize a compat Database API. Verify this route before
  relying on it; it may need conversion to modular Realtime Database
  functions.
- Firebase listeners return unsubscribe functions. When adding or changing
  listeners, retain and invoke those functions when the user signs out or the
  owning component is unmounted.
- `src/main.js` currently chains `fetch()` and JSON parsing without explicit
  failure handling. Keep startup/configuration errors visible when changing
  bootstrapping behavior.
- `firebase.json` configures Hosting rewrites and cache headers. It does not
  declare Realtime Database Security Rules.
- The repository does not contain a Realtime Database rules file. The rules
  supplied by the owner are documented above, but whether they exactly match
  the deployed configuration must still be confirmed in Firebase Console or
  another deployment repository.
- `vite.config.mjs` generates `service-worker.js`. `src/registerServiceWorker.js`
  registers it in production. Review precache patterns when adding public
  files; `public/init.json` is intentionally excluded from the generated
  precache.
- The current production build reports a main JavaScript chunk above 500 kB
  (minified). This is a performance warning, not a build failure.

## Development and verification

From the repository root:

```sh
yarn install --frozen-lockfile
yarn serve
yarn lint
yarn test:unit
yarn build
```

Vitest tests are under `tests/unit/`; configuration and shared setup are in
`vite.config.mjs` and `tests/unit/setup.js`. Some component tests use snapshots
under `tests/unit/specs/**/__snapshots__/`.

GitHub Actions uses Node.js 26, installs with the frozen Yarn lockfile, then
runs lint, unit tests, and (on merge to `master`) a production build and
Firebase Hosting deployment.

## Guidance for AI coding assistants

- Keep changes consistent across all affected surfaces: store, components,
  tests, Vite/PWA configuration, and deployment workflows.
- Prefer Firebase modular APIs; do not introduce compat APIs unless the
  compat SDK is deliberately added and initialized.
- Do not infer that Firebase data is protected because the UI requires login.
  First inspect the actual Realtime Database Security Rules.
- Do not commit credentials or environment-specific secrets. Treat the public
  Firebase web config as public client configuration, not as a secret.
- Preserve the existing sensor database shape and timestamp units unless the
  task explicitly changes them.
- Run the narrowest relevant tests, then lint/build when changes affect the
  application or toolchain.
