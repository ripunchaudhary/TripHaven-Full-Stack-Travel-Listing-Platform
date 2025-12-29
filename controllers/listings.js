const Listing = require("../models/listing");

// Display all listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

// Render new listing form
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

// Show a single listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
};

// Create new listing
module.exports.createListing = async (req, res) => {
    const { path: url, filename } = req.file;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

// Render edit form
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
    res.render("listings/edit", { listing, originalImageUrl });
};

// Update listing
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        const { path: url, filename } = req.file;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

// Filter listings by category
module.exports.filterListings = async (req, res) => {
    const { q } = req.params;
    const filteredListings = await Listing.find({ category: q });

    if (!filteredListings.length) {
        req.flash("error", "No listings found for this filter!");
        return res.redirect("/listings");
    }

    res.locals.success = `Listings filtered by ${q}`;
    res.render("listings/index", { allListings: filteredListings });
};

// Delete listing
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};

// Search listings
module.exports.search = async (req, res) => {
    const input = req.query.q?.trim().replace(/\s+/g, " ");
    if (!input) {
        req.flash("error", "Search value empty!");
        return res.redirect("/listings");
    }

    const element = input
        .split("")
        .map((ch, i, arr) => (i === 0 || arr[i - 1] === " " ? ch.toUpperCase() : ch.toLowerCase()))
        .join("");

    let allListings = await Listing.find({ title: { $regex: element, $options: "i" } });

    if (allListings.length === 0) {
        allListings = await Listing.find({ category: { $regex: element, $options: "i" } }).sort({ _id: -1 });
    }
    if (allListings.length === 0) {
        allListings = await Listing.find({ country: { $regex: element, $options: "i" } }).sort({ _id: -1 });
    }
    if (allListings.length === 0) {
        allListings = await Listing.find({ location: { $regex: element, $options: "i" } }).sort({ _id: -1 });
    }

    const intValue = parseInt(element, 10);
    if (allListings.length === 0 && Number.isInteger(intValue)) {
        allListings = await Listing.find({ price: { $lte: intValue } }).sort({ price: 1 });
    }

    if (allListings.length === 0) {
        req.flash("error", "No listings found!");
        return res.redirect("/listings");
    }

    res.locals.success = "Listings search results";
    res.render("listings/index", { allListings });
};
