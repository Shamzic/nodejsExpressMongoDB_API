const express = require('express');
const router = express.Router();
const Artisan = require('../models/Artisan');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


let refreshTokens = []; // need further to be store inside the DB

function authenticateToken(req, res, next) {

  console.log("authentification...");
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, artisan) => {
    if(err) return res.sendStatus(403);
  
    req.artisan = artisan
    next();
  })
}

// GET API all the artisans
router.get('/', async (req, res) => {
  try {
    const artisans = await Artisan.find();
    
  console.log("get artisans : ", artisans);
    res.json(artisans);
  } catch(err) {
    res.json({message: err})
  }
});

// Update or create a artisan if not already created
router.post('/update', async (req, res) => {
  try {
    const artisan = await Artisan.findOne({"fairfair_id": req.body.fairfair_id});
    artisan_objet = JSON.parse(JSON.stringify(artisan));
  
    if(!artisan_objet) {
      const artisan = new Artisan({
        fairfair_id: req.body.fairfair_id,
        firstname : req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        status: req.body.status,
        phone: req.body.phone
      });
      artisan_objet = await artisan.save();
    } else {
      artisan_objet = await artisan.updateOne({
        fairfair_id: req.body.fairfair_id,
        firstname : req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        status: req.body.status,
        phone: req.body.phone
      });
    }
    res.json(artisan_objet);
  } catch(err) {
    res.json({message: err})
  }
});

router.post('/create', authenticateToken, async (req, res) => {
  
  const artisan = new Artisan({
    fairfair_id: req.body.fairfair_id,
    firstname : req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    status: req.body.status,
    phone: req.body.phone
  });

  try {
      const savedArtisan = await artisan.save();
      res.json(savedArtisan);
    } catch (err) {
      res.json({message: err});
    }
  });

  // try {
  //   const artisans = await Post.find();
  //   artisans_objets = JSON.parse(JSON.stringify(artisans));
  //   console.log("artisans object :", artisans_objets);
  //   res.json(artisans_objets.filter(artisan => artisan.fairfair_id === req.body.fairfair_id));
  // } catch(err) {
  //   res.json({message: err})
  // }

  ////////////////////

  // try {
  //   console.log("set up artisan")
  //   var artisan = null;
  //   const artisans = await Artisan.find();
  //   // res.json(artisans);
  //   if(artisans) {
  //     const artisans_o = JSON.parse(JSON.stringify(artisans));
  //     artisan = artisans_o.filter(artisan => artisan.fairfair_id == req.body.fairfair_id); 
  //     res.json(artisan);
  //   }

  //   if(!artisan) {
  //     try {
  //       const artisan = new Artisan({
  //         fairfair_id: artisan.fairfair_id,
  //         firstname : artisan.firstname,
  //         lastname: artisan.lastname,
  //         email: artisan.email,
  //         status: artisan.status,
  //         phone: artisan.phone
  //       });
  //       const savedArtisan = await artisan.save();
  //       res.json(savedArtisan);
  //     } catch (err) {
  //       res.json({message: err});
  //     }
  //   } else {
  //     res.json({message: "This artisan exist already"});
  //   }
  // } catch (err) {
  //   res.json({message: err})
  // }




module.exports = router;

  // 
  // let artisan = null;
  // if(artisans) {
  //   const artisans_o = JSON.parse(JSON.stringify(artisans));
  //   artisan = artisans_o.filter(artisan => artisan.fairfair_id == req.body.fairfair_id); 
  //   res(201).json(artisan);
  // }
  // if(!artisan) {
  //   try {
  //     const artisan = new Artisan({
  //       fairfair_id: artisan.fairfair_id,
  //       firstname : artisan.firstname,
  //       lastname: artisan.lastname,
  //       email: artisan.email,
  //       status: artisan.status,
  //       phone: artisan.phone
  //     });
  //     const savedArtisan = await artisan.save();
  //     res.status(201).json(savedArtisan);
  //   } catch (err) {
  //     res.status(500).json({message: err});
  //   }
  // } else {
  //   res.status(201).json({message: "This artisan exist already"});
  // }







// Artisan Classical Auth Not Used
// // Because QuiOuvre has already an auth service
// router.post('/', async (req, res) => {

//   try {
//     const salt = await bcrypt.genSalt();
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);
//     console.log(salt);
//     console.log(hashedPassword);
//     const artisan = new Artisan({
//       firstname : req.body.firstname,
//       lastname: req.body.lastname,
//       email: req.body.email,
//       password: hashedPassword
//     });
//     const savedArtisan = await artisan.save();
//     res.status(201).json(savedArtisan);
//   } catch (err) {
//     res.status(500).json({message: err});
//   }
// });

// router.post('/token', (req, res) => {
//   console.log("/token..");

//   const refreshToken = req.body.token;
//   console.log(refreshToken)
//   if(refreshToken == null) {
//     return res.sendStatus(401)
//   }
//   if(!refreshTokens.includes(refreshToken)) {
//     return res.sendStatus(403)
//   }
  
//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, artisan) => {
//     if(err) {
//       return res.sendStatus(403)
//     }
//     console.log("USER : ", artisan)
//     const accessToken = generateAccessToken({firstname: artisan.firstname})
//     res.json({accessToken: accessToken})
//   })
// });


// // POST : login a artisan
// router.post('/login', async (req, res) => {

//     const artisans = await Artisan.find();
//     var login_artisan = null;
//     artisans.forEach(artisan => {
//       if(artisan.email == req.body.email) {
//         login_artisan = artisan;
//       }
//     });

//     if(login_artisan == null) {
//       return res.status(400).send('Cannot find the artisan');
//     }

//     var artisan = login_artisan.toObject({ getters: true }); 

//     try {
//       if(await bcrypt.compare(req.body.password, artisan.password)) {

//         const accessToken = generateAccessToken(artisan);
//         const refreshToken = jwt.sign(artisan, process.env.REFRESH_TOKEN_SECRET);
//         refreshTokens.push(refreshToken);
//         res.send({accessToken: accessToken, refreshToken: refreshToken})
//       } else {
//         res.send('Not Allowed after bcrypt')
//       }
//     } catch (err) {
//       res.send('Not Allowed catch');
//     }
// });

// // DELETE : logout a artisan
// router.delete('/logout', async (req, res) => {
//   refreshTokens = refreshTokens.filter(token => token !== req.body.token)
//   res.sendStatus(204)
// });

// function generateAccessToken(artisan) {
//   return jwt.sign(artisan, process.env.JWT_SECRET, {expiresIn: '30s'});
// }