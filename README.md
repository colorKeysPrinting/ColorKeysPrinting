## COLOR KEYS PRINTING

Getting Started
-----------------------

Make sure to install git, npm before you start then:

1. git clone https://github.com/colorKeysPrinting/colorKeysPrinting_react.git

2. Install packages with

    `npm install`

3. Start server with:

    `npm run hot`

then visit `http://localhost:3000`

Note: This is using webpack-dev-server it will auto refresh the page each time a file is saved.\
Also if want/need to change the url and port for dev builds you can do so by modifing the `HOST` & `PORT` lines in `webpack/webpack.dev.js`

## React.js
-----------
React code can be found in `src/`. We use Redux and React-Router v4.

## Action/Reducers
-------------------
We are using the "duck" approach for actions/reducers [ducks-modular-redux](https://github.com/erikras/ducks-modular-redux)
this allows for modularity.

actions and reducers can be found under `src/ducks`

## Assets
-----------
Any files added to the assets directory can be used in code and assigned to a variable. This
allows for referring to assets using dynamically generated strings. The assets will be built according to
the rules specified in your webpack configuration. Typically, this means that in production the names will
be changed to include a SHA.

First importing the assets:
  `import assets from '../utils/assets';`

Then assign the assest to a variable:
  `const img = assets("./images/profile_pic.jpg");`

The value can then be used when rendering:
  `render(){
    const img = assets("./images/profile_pic.jpg");
    return<div>
    <img src={img} />
    </div>;
  }`

## Styling
----------
all styles can be found in src/styles.
anytime you add a new stylesheet to the project you need to import it in src/styles/styles.scss
this is the main point of entry for the app to look into the styles.

You can also import stylesheets from node_modules by `node_modules/< module name >/path/to/stylesheet`

## Production
-------------
to build the project for production update the `API_URL` key in webpack/webpack.prod.js to the appropriate url
run `npm run build_prod` this will output the prod build into a `build/production` where you can updload the folder to s3 or netlify

License and attribution
-----------------------
MIT

Available run commands
-----------------------
`hot:` starts up the webpack-dev-server default port 3000, has hot reload enable\
`build:` builds a production level build found in build/production which can be uploaded to netlify, this also minifies and removes debug capabilies.\
`build_dev:` builds a dev level build found in build/development\
`nuke:` wipes out the node_modules directory for the ability to clean install node_modules\