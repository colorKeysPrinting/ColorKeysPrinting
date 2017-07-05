## SIBI - FrontEnd


# Getting Started Docker:
-----------------------

1. docker build -t sibi-app .

2. docker run -d -p 8443:8443 sibi-app

#Getting Started:
-----------------------


Make sure to install git, npm before you start then:

1. git clone https://bitbucket.org/HQ-Team/sibi-fe my_project_name
2. Rename .env.example to .env. This file contains the port the server will use.
   - The default 8080 should be fine, but you can also use a local domain or ngrok if you wish.
   - To change the default port uncomment `ASSETS_PORT=` and set it to the desired port.
   - To enable assets to be served from local host make sure to uncomment `ASSETS_URL=HTTP://0.0.0.0`
3. Install packages with

    `npm install`

4. Start server with:

  `npm run hot`

then visit `http://localhost:8080`

Note that this will start up a server for each application, incrementing the port by one for
each new application that is started.

If you have multiple applications you can run them one at a time with the application name:

  `npm run hot sibi`

then `visit http://localhost:8080`


# Using the SIBI App
-----------------------
The starter app is setup to serve multiple isolated client applications each with their own package.json. You will find
an example "hello world" application in client/apps/sibi
Modify html and js files in that directory to build your application or copy paste that directory to build additional
applications. The build process will automatically add a new webpack entry point for each folder in that directory.


## React.js
-----------
React code can be found in client/js. We use Redux and the React-Router.


## Html
-----------
All html files live in client/apps/[app name]/html. The build process will properly process ejs in any html files as well
as process markdown for files that end in .md. All front matter in .md files will be available to
the ejs templates and will be used when generating html. For example, you can set a custom layout for the html
file by setting `layout: custom_layout` in the front matter. See apps/sibi/html/about.md for an example.


## Assets
-----------
Any files added to the assets directory can be used by in code and assigned to a variable. This
allows for referring to assets using dynamically generated strings. The assets will be built according to
the rules specified in your webpack configuration. Typically, this means that in production the names will
be changed to include a SHA.

First importing the assets:
  `import assets from '../libs/assets';`

Then assign the assest to a variable:
  `const img = assets("./images/atomicjolt.jpg");`

The value can then be used when rendering:
  `render(){
    const img = assets("./images/atomicjolt.jpg");
    return<div>
    <img src={img} />
    </div>;
  }`


## Static
-----------
Files added to the static directory will be copied directly into the build. These files will not be renamed.


#Tests
-----------
Karma and Jasmine are used for testing. To run tests run:

  `npm run test`


#Check for updates
-----------
Inside the client directory run:

  `npm run upgrade-interactive`


#Scripts:
-----------------------
The following scripts are available for testing, building and deploying applications

Run all tests:
  `npm run test`

Generate coverage report:
  `npm run coverage`

Run webpack hot reload server:
  `npm run hot`

Run reload server for a specific application:
  `npm run hot [app name]`

Serve production assets. Must run `npm run build` first:
  `npm run live`

Build development version including html pages:
  `npm run build_dev`

Only run the webpack build without generating html pages or subdirectories. This will output all results
directly into the build/dev directory
  `npm run build_dev_pack`

Build for production:
  `npm run build`

Only run the webpack build without generating html pages or subdirectories. This will output all results
directly into the build/prod directory
  `npm run build_pack`

After setting up .s3-website.json this will create a S3 bucket and set it as a website:
  `npm run create`

Release a production build to the S3 website bucket created by `npm run create`
  `npm run release`

Run a linter over the project:
  `npm run lint`

Wipe out all node modules:
  `npm run nuke`

#Deploy to S3:
-----------------------

  1. Setup credentials. If you've already setup your Amazon credentials in ~/.aws/credentials
  you will be able to do something similar to the following where "myprofile" is one of
  the AWS profiles found in ~/.aws/credentials:

    export AWS_DEFAULT_PROFILE=myprofile
    export AWS_PROFILE=myprofile

  You can also use a .env file. See the [s3-website](https://github.com/klaemo/s3-website) documentation for more options.

  2. Edit configuration.

    Open up .s3-website.json and set the desired bucket name

  3. Configure the bucket as a website

    `npm run create`

  4. Deploy.

    `npm run release`

#Production
-----------------------
If you want to see what your application will look like in production run

  `npm run live`

This will serve files from the build/prod directory.


#Deploy:
-----------------------

  Build a development release without deploying:

  `npm run build_dev`


  Build a release without deploying:

  `npm run build`


  Build a release and deploy:

  `npm run release`


License and attribution
-----------------------
MIT