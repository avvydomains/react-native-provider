# What is this?

This subproject bundles the code that is injected into the webview.

The source is in `src/index.js`. It basically just bundles up circomlibjs and exposes a function which runs our poseidon calculations and pushes the result out via webview communication to the host. 

To build it, run `bash build.sh`, which first uses webpack to bundle the whole thing for web, and the calls `build.js` to package it in a way that we can load it. `build.js` just base64 encodes the whole script and makes it decodeable.. the problem we're solving is that we need to be able to inject the whole webpacked script as a *string* into the webview. So `dist/index.js` actually exports a function, which when called just base64 decodes the output from the webpack script. The result is a string which contains the webpack script, which we can then inject into the webview.
