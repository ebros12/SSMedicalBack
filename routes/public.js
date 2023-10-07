const {Router} = require('express');

const router = Router();

router.get("/", (req, res) => {
    res.json("conectado al servah");
});

module.exports = router;