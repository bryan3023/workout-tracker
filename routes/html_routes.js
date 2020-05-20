const express = require("express");

// -- BRING IN REFERENCE TO OUR CONTROLLER METHODS (LOGIC) -- //
const AboutCntrl = require("../controllers/aboutCntrl");


module.exports = function(app) {
    app.get('/about', AboutCntrl.getAbout);
}


// ===== OPTIONAL CODE IF YOU WANT TO TRY AND USE EXPRESS ROUTER ==== //

// const router = express.Router();

// // -- ROUTES FOR '/about' URL ROUTE -- //
// router.get("/", AboutCntrl.getAbout);

// // -- EXPORT THE ROUTES -- //
// module.exports = router;

// ================================================= //