const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Listing = require('../models/Listing');
const User = require('../models/User');

// @route   GET api/listings
// @desc    Récupérer toutes les annonces (validées)
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'approved' })
      .populate('owner', ['name', 'avatar']);
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/listings
// @desc    Créer une annonce
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Le titre est requis').not().isEmpty(),
      check('description', 'La description est requise').not().isEmpty(),
      check('address', 'L\'adresse est requise').not().isEmpty(),
      check('price', 'Le prix est requis').isNumeric(),
      check('size', 'La superficie est requise').isNumeric(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, address, price, size, amenities } = req.body;

    try {
      const user = await User.findById(req.user.id);
      if (user.role !== 'owner') {
        return res.status(401).json({ msg: 'Non autorisé' });
      }

      const newListing = new Listing({
        owner: req.user.id,
        title,
        description,
        address,
        price,
        size,
        amenities: amenities || [],
        status: 'pending'
      });

      const listing = await newListing.save();
      res.json(listing);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
  }
);

// @route   PUT api/listings/:id
// @desc    Mettre à jour une annonce
router.put('/:id', auth, async (req, res) => {
  const { title, description, address, price, size, amenities } = req.body;

  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ msg: 'Annonce non trouvée' });
    }

    // Vérifier que l'utilisateur est le propriétaire ou un admin
    if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Non autorisé' });
    }

    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, address, price, size, amenities } },
      { new: true }
    );

    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/listings/:id
// @desc    Supprimer une annonce
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ msg: 'Annonce non trouvée' });
    }

    // Vérifier que l'utilisateur est le propriétaire ou un admin
    if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Non autorisé' });
    }

    await listing.remove();
    res.json({ msg: 'Annonce supprimée' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/listings/admin/pending
// @desc    Récupérer les annonces en attente (admin)
router.get('/admin/pending', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Non autorisé' });
    }

    const listings = await Listing.find({ status: 'pending' })
      .populate('owner', ['name', 'email']);
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/listings/admin/approve/:id
// @desc    Approuver une annonce (admin)
router.put('/admin/approve/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Non autorisé' });
    }

    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ msg: 'Annonce non trouvée' });
    }

    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'approved' } },
      { new: true }
    );

    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;