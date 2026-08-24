# bento-site

The built portfolio, and nothing else.

`index.html` and `assets/` are generated — they are pushed here by the
`Publish the built site` workflow in the private `bento-portfolio` repo every
time its `main` moves. Editing anything here by hand will be overwritten on the
next push.

The source — `template.html`, `build.js`, `content/` — lives in that private
repo. This one exists because GitHub Pages will not serve a private repository
on a free plan, and the built page is public anyway.

Served at <https://vaibhavvishal07.github.io/bento-site/>, and from the private
repo directly by Vercel at <https://bento-portfolio-nu.vercel.app>.
