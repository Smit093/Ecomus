const express = require('express');
const router = express.Router();
const upload = require('../cloudinary/storage')
const Hero = require('../model/modelHero')
const Marquee = require('../model/modelMarquee');
const ShopByCat = require('../model/modelShopByCat');
const BestSeller = require('../model/modelBestSeller');
const User = require("../model/modelUser");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');
// Route for home page
router.get('/', (req, res) => {
    res.send('On Home page'); // This should render correctly
});

//HERO

// For admin to update hero section details
router.put('/hero/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameters
        const updates = {}; // Object to hold updates

        // Check for each field and add it to updates if present
        if (req.body.title) {
            updates.title = req.body.title;
        }
        if (req.body.subtitle) {
            updates.subtitle = req.body.subtitle;
        }
        if (req.file) {
            updates.img = req.file.path; // Update image only if a new one is provided
        }

        // Update the hero using $set operator
        const updatedHero = await Hero.findByIdAndUpdate(
            id,
            { $set: updates }, // Only update provided fields
            { new: true } // Return the updated document
        );

        if (!updatedHero) {
            return res.status(404).json({ message: 'Hero not found' });
        }

        console.log("Updated in DB Successfully!");

        // Respond with success message
        res.status(200).json({ message: 'Hero updated successfully!', hero: updatedHero });
    } catch (error) {
        console.error(`Error while updating hero with ID ${id}.`, error);

        // Respond with error message
        res.status(500).json({ message: 'Error while updating hero', error });
    }
});


// For admin to add a new hero section details
router.post('/hero', upload.single('image'), async (req, res) => {
    try {
        // Extract title and subtitle from the request body
        const title = req.body.title;
        const subtitle = req.body.subtitle;
        const imageUrl = req.file ? req.file.path : null; // URL of the uploaded image
        // Create a new instance of Hero with correct field names
        const newHero = new Hero({
            img: imageUrl, // Use 'img' for the image field
            title,
            subtitle,
        });

        // Save the new hero to the database
        await newHero.save();
        console.log(title, "Saved to DB Successfully!");

        // Respond with success message
        res.status(201).json({ message: 'Hero created successfully!', hero: newHero });
    } catch (error) {
        console.error(`Error while saving hero ${title} to DB.`, error);

        // Respond with error message
        res.status(500).json({ message: 'Error while saving hero', error });
    }
});


// Deleting a hero by ID
router.delete('/hero/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameters

        const deletedHero = await Hero.findByIdAndDelete(id); // Delete the hero by ID

        if (!deletedHero) {
            return res.status(404).json({ message: 'Hero not found' });
        }

        console.log("Deleted from DB Successfully!");

        // Respond with success message
        res.status(200).json({ message: 'Hero deleted successfully!', hero: deletedHero });
    } catch (error) {
        console.error(`Error while deleting hero with ID ${id}.`, error);

        // Respond with error message
        res.status(500).json({ message: 'Error while deleting hero', error });
    }
});

//Sending Hero data to frontend
router.get('/hero', async (req, res) => {
    const heroData = await Hero.find();
    res.json(heroData);
});


//MARQUEE

// For admin to update an existing marquee
router.put('/marquee/:id', async (req, res) => {
    try {
        const { text } = req.body; // Get text from request body
        const { id } = req.params; // Get ID from URL parameters

        // Check if text is provided
        if (!text) {
            return res.status(400).json({ message: 'Text is required.' });
        }

        // Find the marquee by ID and update it
        const updatedMarquee = await Marquee.findByIdAndUpdate(
            id,
            { text }, // Update only the text field
            { new: true } // Return the updated document
        );

        if (!updatedMarquee) {
            return res.status(404).json({ message: 'Marquee not found.' });
        }

        console.log("Marquee updated successfully!");

        res.status(200).json({ message: 'Marquee updated successfully!', marquee: updatedMarquee });
    } catch (error) {
        console.error('Error while updating marquee:', error);

        // Respond with error message
        res.status(500).json({ message: 'Error while updating marquee', error });
    }
});


// For fetching all marquee entries
router.get('/marquee', async (req, res) => {
    try {
        const marqueeData = await Marquee.find(); // Fetch all marquee entries from MongoDB
        res.json(marqueeData); // Send back the fetched data as JSON
    } catch (error) {
        console.error('Error fetching marquee:', error);
        res.status(500).json({ message: 'Error fetching marquee', error });
    }
});


// SHOP BY CATAGORY

// For admin to add a new ShopByCat section details
router.post('/shopbycat', upload.single('image'), async (req, res) => {
    try {
        const caption = req.body.caption; // Extract caption from request body
        const imageFile = req.file; // Get the uploaded file

        if (!imageFile) {
            return res.status(400).json({ message: 'Image file is required.' });
        }

        const imageUrl = imageFile.path; // Use local path directly

        const newShopByCat = new ShopByCat({
            img: imageUrl, // Use local path for image
            caption,
        });

        await newShopByCat.save();
        console.log(caption, "Saved to DB Successfully!");

        res.status(201).json({ message: 'ShopByCat created successfully!', shopByCat: newShopByCat });
    } catch (error) {
        console.error(`Error while saving ShopByCat ${caption} to DB.`, error);

        res.status(500).json({ message: 'Error while saving ShopByCat', error });
    }
});


// GET endpoint to retrieve all ShopByCat sections
router.get('/shopbycat', async (req, res) => {
    try {
        const shopByCats = await ShopByCat.find(); // Fetch all entries from ShopByCat collection
        res.status(200).json(shopByCats); // Send the retrieved data as response
    } catch (error) {
        console.error("Error while fetching ShopByCat data from DB.", error);
        res.status(500).json({ message: 'Error while fetching ShopByCat data', error });
    }
});

// For admin to update ShopByCat section details
router.put('/shopbycat/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameters
        const updates = {}; // Object to hold updates

        // Check for each field and add it to updates if present
        if (req.body.caption) {
            updates.caption = req.body.caption; // Update caption if provided
        }
        if (req.file) {
            updates.img = req.file.path; // Update image only if a new one is provided
        }

        // Update the ShopByCat using $set operator
        const updatedShopByCat = await ShopByCat.findByIdAndUpdate(
            id,
            { $set: updates }, // Only update provided fields
            { new: true } // Return the updated document
        );

        if (!updatedShopByCat) {
            return res.status(404).json({ message: 'ShopByCat not found' });
        }

        console.log("Updated ShopByCat in DB Successfully!");

        // Respond with success message
        res.status(200).json({ message: 'ShopByCat updated successfully!', shopByCat: updatedShopByCat });
    } catch (error) {
        console.error(`Error while updating ShopByCat with ID ${id}.`, error);

        // Respond with error message
        res.status(500).json({ message: 'Error while updating ShopByCat', error });
    }
});

// Deleting a ShopByCat by ID
router.delete('/shopbycat/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameters

        const deletedShopByCat = await ShopByCat.findByIdAndDelete(id); // Delete the ShopByCat by ID

        if (!deletedShopByCat) {
            return res.status(404).json({ message: 'ShopByCat not found' });
        }

        console.log("Deleted ShopByCat from DB Successfully!");

        // Respond with success message
        res.status(200).json({ message: 'ShopByCat deleted successfully!', shopByCat: deletedShopByCat });
    } catch (error) {
        console.error(`Error while deleting ShopByCat with ID ${id}.`, error);

        // Respond with error message
        res.status(500).json({ message: 'Error while deleting ShopByCat', error });
    }
});

// BEST SELLER
// For admin to update BestSeller section details
router.put('/bestseller/:id', upload.fields([{ name: 'images' }]), async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameters
        const updates = {}; // Object to hold updates

        // Check for each field and add it to updates if present
        if (req.body.name) {
            updates.name = req.body.name; // Update name if provided
        }
        if (req.body.price) {
            updates.price = parseFloat(req.body.price); // Update price if provided
        }
        if (req.body.sizes) {
            updates.sizes = JSON.parse(req.body.sizes); // Update sizes if provided
        }
        if (req.body.colors) {
            updates.colors = JSON.parse(req.body.colors); // Update colors if provided
        }

        // Check for image files and create an images object mapping colors to their corresponding image URLs
        const imageFiles = req.files.images; // Get the uploaded files for images
        if (imageFiles && imageFiles.length > 0) {
            const images = {};
            const colorsArray = JSON.parse(req.body.colors);

            colorsArray.forEach((color, index) => {
                if (imageFiles[index]) {
                    images[color] = imageFiles[index].path; // Map each color to its corresponding image path
                }
            });

            updates.images = images; // Add images object to updates
        }

        // Update the BestSeller using $set operator
        const updatedBestSeller = await BestSeller.findByIdAndUpdate(
            id,
            { $set: updates }, // Only update provided fields
            { new: true } // Return the updated document
        );

        if (!updatedBestSeller) {
            return res.status(404).json({ message: 'BestSeller not found' });
        }

        console.log("Updated BestSeller in DB Successfully!");

        // Respond with success message
        res.status(200).json({ message: 'BestSeller updated successfully!', bestSeller: updatedBestSeller });
    } catch (error) {
        console.error(`Error while updating BestSeller with ID ${id}.`, error);

        // Respond with error message
        res.status(500).json({ message: 'Error while updating BestSeller', error });
    }
});

// For admin to add a new BestSeller section details
router.post('/bestseller', upload.fields([{ name: 'images' }]), async (req, res) => {
    try {
        const { sizes, name, price, colors } = req.body; // Extract fields from request body
        const imageFiles = req.files.images; // Get the uploaded files for images

        // Validate required fields
        if (!sizes || !name || !price || !colors) {
            return res.status(400).json({ message: 'All fields are required: sizes, name, price, and colors.' });
        }

        // Check if image files are provided
        if (!imageFiles || imageFiles.length !== JSON.parse(colors).length) {
            return res.status(400).json({ message: 'Image files are required for each color.' });
        }

        // Create an images object mapping colors to their corresponding image URLs
        const images = {};
        const colorsArray = JSON.parse(colors); // Parse colors from JSON string
        colorsArray.forEach((color, index) => {
            images[color] = imageFiles[index].path; // Map each color to its corresponding image path
        });

        // Parse sizes from JSON string
        const sizesArray = JSON.parse(sizes); 

        // Create a new BestSeller item
        const newBestSeller = new BestSeller({
            images, // Use the constructed images object
            sizes: sizesArray, // Ensure sizes is an array
            name,
            price: parseFloat(price), // Convert price to a number
            colors: colorsArray, // Ensure colors is an array
        });

        await newBestSeller.save();
        console.log(name, "Saved to DB Successfully!");

        res.status(201).json({ message: 'BestSeller created successfully!', bestSeller: newBestSeller });
    } catch (error) {
        console.error(`Error while saving BestSeller ${req.body.name} to DB.`, error);
        res.status(500).json({ message: 'Error while saving BestSeller', error });
    }
});

// GET endpoint to retrieve all BestSeller sections
router.get('/bestseller', async (req, res) => {
    try {
        const bestSellers = await BestSeller.find(); // Fetch all entries from BestSeller collection
        res.status(200).json(bestSellers); // Send the retrieved data as response
    } catch (error) {
        console.error("Error while fetching BestSeller data from DB.", error);
        res.status(500).json({ message: 'Error while fetching BestSeller data', error });
    }
});

// For admin to delete a BestSeller section details
router.delete('/bestseller/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameters

        // Attempt to find and remove the BestSeller by ID
        const deletedBestSeller = await BestSeller.findByIdAndDelete(id);

        if (!deletedBestSeller) {
            return res.status(404).json({ message: 'BestSeller not found' });
        }

        console.log("Deleted BestSeller from DB Successfully!");

        // Respond with success message
        res.status(200).json({ message: 'BestSeller deleted successfully!', bestSeller: deletedBestSeller });
    } catch (error) {
        console.error(`Error while deleting BestSeller with ID ${id}.`, error);

        // Respond with error message
        res.status(500).json({ message: 'Error while deleting BestSeller', error });
    }
});

// USER
// POST route for registering a new user
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, country } = req.body;

    // Simple validation
    if (!firstName || !lastName || !email || !password || !country) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already Exists.' });
        }
        // Encrypt the password before saving
        const encryptedPassword = cryptr.encrypt(password);


        // Create a new user instance
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: encryptedPassword, // Store the encrypted password
            country
        });

        // Save the new user to the database
        await newUser.save();

        // Respond with success message
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


module.exports = router;
