## Getting Started

Install deps:
```bash
npm i
```


To run the Electron version in Dev mode:
```bash
npm run dev
```
* If Electron doesn't launch properly on initial run, type "rs" in the console for nodemon to restart it
* NextJS might need a CMD/CTRL + R on inital launch once the app is open
* (I promise, it does work  😄)


To run the NextJS web only version:
```bash
npm run next:dev
```
Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


To pack the standalone app, simply run:
```bash
npm run dist
```
* Currently configured in package.json to build a Mac version only  -  Remove the --mac flag to build all, or add the appropriate flags


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
