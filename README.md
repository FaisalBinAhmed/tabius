# Chrome-Extension-Preact-Vite-Manifest-3 (CEPV)


![CEPV Icon](/public/icon.png "CEPV Icon")

This is a Chrome Extension boilerplate with Preact and Vite bundler support out of the box.
The extension is targeted for manifest version 3. This should make it futureproof for newer extension development.

The extension includes:

- Preact based Action Page (popup that appears when user clicks on the extension icon from broswer toolbar)
- Preact based Options UI (Extension settings page)
- Typescript-native
- Intellisense support for Chrome APIs
- And many more..

To start, clone the project and run `npm install` to install all dependencies. Finally, run `npm build` to run the app. This command should build/bundle everything in the `dist` folder.

From Chrome/Microsoft Edge, go to Extensions page, turn on Developer Mode, and then load unpacked. Select the dist folder as the source of the extension, this should install the app in the browser.

Try editing the `src/Action.tsx` and `src/options/Settings.tsx` files and see the changes reflect automatically.

Feedback/Discussions and pull requests are welcome. :)
