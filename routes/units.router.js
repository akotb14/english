const router = require("express").Router();
const contro = require("../controllers/units.contro");
const Unit = require("../models/unit");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./documantion/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().getTime() + "_" + file.originalname.replace(/\s+/g, "-")
    );
  },
});
const upload = multer({ storage: storage });
const isAdmin = require("../util/aurth");

router.get("/:edu/:grd", contro.getData);

router.post("/lesson", isAdmin, upload.single("pdf"), contro.addlesson);
router.get("/lesson", isAdmin, contro.getlesson);

router.get("/removelesson/:i/:id", isAdmin,async (req, res) => {
  try {
  const up =  await Unit.getModel().updateOne(
      {
        _id: req.params.i,
       },
      {
        $pull: {
          units: 
            {
             _id:req.params.id
            },
          
        },
      }
    );
    console.log(up)
    res.redirect("/lesson");
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
});
router.get("/:edu/:grade/:month/:unit", contro.getContent);
module.exports = {router,upload};
