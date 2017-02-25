# webedit-react  Blinkenrocket WebInterface

## Quickstart

System Setup

* install node: https://nodejs.org/en/download/

## Getting started with blinkenrocket-webedit-react

    # Clone the Git repo:
    git clone https://github.com/ChrisVeigl/blinkenrocket-webedit-react

    # Install dependencies and build the project
    blinkerocket-webedit-react
    npm install

    # Run development server
    npm run build

Now you can access the web interface via http://127.0.0.1:8080

---

    npm run dev

   npm install  
   npm install webpack-dev-server  
   to get a working build, i had to remove (or comment) line 10 from file ./node_modules/font-awesome/css/font-awesome.css :
   /* src: url('../fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'), url('../fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'), url('../fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'), url('../fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'), url('../fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg'); */  
   npm run build  

## Notes

* start webpack-dev-server in from commandline, in main folder /blinkerocket-webedit-react 
   you can use webpack-dev-server --host ip-adress-of-your-computer  
   if you want to test the interface from other devices !
* in webbrowser use url http://127.0.0.1:8080  (or http://ip-adress-of-your-computer:8080)

