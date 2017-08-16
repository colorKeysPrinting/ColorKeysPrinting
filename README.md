## SIBI GE - Admin


<!-- # Getting Started Docker:
-----------------------

1. docker build -t sibi-fe-app .

2. docker run -d -p 8443:8443 sibi-fe-app -->

#Getting Started:
-----------------------

Make sure to install git, npm before you start then:

1. git clone https://bitbucket.org/HQ-Team/sibi_ge_fe my_project_name

2. Install packages with

    `npm install`

3. Start server with:

  `npm run hot`

then visit `http://localhost:3000`

Note this is using webpack-dev-server it will auto refresh the page each time a file is saved.

## React.js
-----------
React code can be found in src/. We use Redux and the React-Router.

## Action/Reducers
-------------------
We are using the "duck" approach for actions/reducers [ducks-modular-redux](https://github.com/erikras/ducks-modular-redux)
this allows for modularity.

actions and reducers can be found under `src/ducks`

## Assets
-----------
Any files added to the assets directory can be used by in code and assigned to a variable. This
allows for referring to assets using dynamically generated strings. The assets will be built according to
the rules specified in your webpack configuration. Typically, this means that in production the names will
be changed to include a SHA.

First importing the assets:
  `import assets from '../libs/assets';`

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

You can also import stylesheets from node_modules by `node_modules/< module name >/path/to/stylesheet

## Production
-------------
to build the project for production update the `HOST` key in webpack/webpack.prod.js to the appropriate s3 url
run `npm run build` this will output the prod build into a `dist/` where you can updload the folder to s3

License and attribution
-----------------------
MIT