module.exports = (fn) => {
    return (req, res) => {
        Promise.resolve(fn(req, res)).catch(err => {
            console.error(err);
            req.flash("error", err.message || "Something went wrong");
            res.redirect("back");
        });
    };
};
