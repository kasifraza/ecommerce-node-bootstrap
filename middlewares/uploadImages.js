const multer=require('multer');
const sharp=require('sharp');
const path = require('path');
const fs=require('fs');

const multerStorage=multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../assets/uploads/"));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null,'product' + '-'+ file.fieldname + "-" + uniqueSuffix + ".jpeg");
    },
  });

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb({ message: "Unsupported file format" }, false);
    }
  };



const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 2000000 },
  });

  const singleProductImgResize = async (req, res, next) => {
    if (!req.file) return next();
    const newImage = req.file.filename;
    await sharp(req.file.path) 
      .resize(570, 570)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`assets/uploads/products/${newImage}`);
      fs.unlinkSync(`assets/uploads/${newImage}`);
    next();
  };
  const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
      req.files.map(async (file) => {
        await sharp(file.path)
          .resize(570, 570)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`assets/uploads/products/${file.filename}`);
        fs.unlinkSync(`assets/uploads/${file.filename}`);
      })
    );
    next();
  };

const blogImgResize=async(req,res,next)=>{
    if(!req.files) return next();
    await Promise.all(
        req.files.map(async(file)=>{
            await sharp(file.path).resize(300,300).toFormat('jpeg').jpeg({quality:90})
            .toFile(`assets/uploads/${file.filename}`)
            fs.unlinkSync(`assets/uploads/${file.filename}`);
        })
        
    );
    next();
}


module.exports={uploadPhoto,productImgResize,blogImgResize,singleProductImgResize}