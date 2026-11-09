# Netlify deployment

The site is already hosted at [tsantatsiory.netlify.app](https://tsantatsiory.netlify.app/). Its contact form uses a Netlify Function to submit messages to Web3Forms without exposing the access key in the browser.

1. In Web3Forms, revoke or regenerate the access key that was previously published in the HTML.
2. Open the **tsantatsiory site** in Netlify, then go to **Project configuration → Environment variables** (not **Team settings → Environment variables**, which is the paid shared-variables feature shown in the screenshot). Add `WEB3FORMS_ACCESS_KEY` with the new key and enable the **Functions** scope for the **Production** deploy context. Site-level variables are separate from paid shared team variables. Do not put the key in this repository or in a client-side variable.
3. Deploy the updated repository to the branch connected to this Netlify site. Netlify will use `netlify.toml` to publish the repository root and discover functions in `netlify/functions`; no build command is required. If automatic deploys are disabled, trigger a deploy of the latest commit from the Netlify dashboard.
4. After the deploy completes, submit a test message at [tsantatsiory.netlify.app](https://tsantatsiory.netlify.app/).

Changing an environment variable requires a new deploy before the function can use it. The old key may also remain in Git history, so it must be revoked even though it has been removed from the current source.
