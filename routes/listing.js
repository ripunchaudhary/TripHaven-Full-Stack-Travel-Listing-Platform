const express = require("express");
const router = express.Router();
const multer = require("multer");

const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../controllers/listings");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const { storage } = require("../cloudConfig"); // Cloud storage config

const upload = multer({ storage });

//ROUTES 

// Index & Create
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        validateListing,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// New Listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Filter Listings
router.get("/filter/:q", wrapAsync(listingController.filterListings));

// Search Listings
router.get("/search", wrapAsync(listingController.search));

// Show, Update & Delete a listing
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Listing form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
