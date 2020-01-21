const express = require("express");
const router = express.Router();
const passport = require("passport"); 
router.get("/test", (req, res) => res.json({ msg: "This is the photos route" }));

router.post("/",
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const newPhoto = new Photo({
            user: req.user.id,
            text: req.body.text, 
            photoURL: req.body.image_url
        })
    })
module.exports = router;



