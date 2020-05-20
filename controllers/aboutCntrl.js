const path = require('path');

// -- DEFINE OBJECT THAT WE EXPORT AND MAKE AVAILABLE OUTSIDE OF THIS FILE -- //
const AboutCntrl = {
    // -- DEFINE AN OBJECT METHOD -- //
    getAbout(req, res) {
        // -- RENDER ABOUT PAGE || BE CAREFUL ABOUT THE RELATIVE PATH -- //
        res.sendFile(path.join(__dirname, "../public/about.html"));
    }
}

// -- EXPORT OBJECT AND METHODS DEFINED ABOVE -- //
module.exports = AboutCntrl;