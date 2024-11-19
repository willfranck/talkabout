## Getting Started

Environment vars:
```code
PORT=

GEMINI_API_KEY=
GOOGLE_OAUTH_KEY=
GOOGLE_CLIENT_SECRET=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
<br />

Install deps:

```bash
npm i
```
<br />

To run the NextJS web only version:

```bash
npm run next:dev
```
Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
<br />
<br />

To run the Electron version in Dev mode:

```bash
npm run dev
```
* If Electron doesn't launch properly on initial run, type "rs" in the console for nodemon to restart it
* NextJS might need a CMD/CTRL + R on inital launch once the app is open
* (I promise, it does work  😄)
<br />

To pack the standalone app, simply run:

```bash
npm run dist
```
* Currently configured in package.json to build a Mac version only  -  Remove the --mac flag to build all, or add the appropriate flags
