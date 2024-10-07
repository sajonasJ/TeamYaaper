const express = require('express');
const { IncomingForm } = require('formidable'); // Corrected import
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');

const router = express.Router(); // Create a new Router instance

module.exports = function (db) {
    // Profile Picture Upload Endpoint
    router.post('/uploadProfilePicture/:userId', (req, res) => {
        console.log("Received a request to upload profile picture"); // Log request received
        const userId = req.params.userId;

        console.log(`User ID: ${userId}`); // Log the user ID

        // Validate User ID
        if (!ObjectId.isValid(userId)) {
            console.error("Invalid User ID");
            return res.status(400).send({ message: "Invalid User ID." });
        }

        // Define the upload folder for profile pictures
        const uploadFolder = path.join(__dirname, '../../../public/profile-pictures');

        // Ensure the upload directory exists
        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder, { recursive: true });
        }

        // Set up formidable
        const form = new IncomingForm();
        form.uploadDir = uploadFolder;
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error("Error parsing the file", err);
                return res.status(500).send({ message: "File upload failed" });
            }

            console.log("File parsed successfully");
            console.log("Fields:", fields);
            console.log("Files:", files);

            // Handling the file
            const file = files.profilePicture instanceof Array ? files.profilePicture[0] : files.profilePicture;

            if (!file || !file.filepath) {
                console.error("Error: Uploaded file not found");
                return res.status(400).send({ message: 'File not found in the request.' });
            }

            const oldPath = file.filepath;
            const fileName = new Date().toISOString().replace(/:/g, '-') + '-' + file.originalFilename; // Replace ':' to make it a valid filename
            const newPath = path.join(uploadFolder, fileName);

            // Use copyFile instead of rename and remove the original file
            fs.copyFile(oldPath, newPath, async (err) => {
                if (err) {
                    console.error("Error copying the file", err);
                    return res.status(500).send({ message: 'Error moving uploaded file' });
                }

                // Remove the original temporary file
                fs.unlink(oldPath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error("Error deleting the temp file", unlinkErr);
                        // Not sending a response here since the copying was successful
                    }
                });

                console.log("File moved successfully to:", newPath);

                const imageUrl = `/profile-pictures/${fileName}`; // This is the path where the image is stored, accessible from the public directory

                try {
                    // Update the user's profile picture URL in the database
                    const usersCollection = db.collection('users');
                    const result = await usersCollection.updateOne(
                        { _id: new ObjectId(userId) },
                        { $set: { profilePictureUrl: imageUrl } }
                    );

                    if (result.modifiedCount === 1) {
                        console.log("Profile picture URL updated in database");
                        res.status(200).send({ ok: true, imageUrl, message: 'Profile picture updated successfully' });
                    } else {
                        console.error("User not found. Unable to update.");
                        res.status(404).send({ ok: false, message: 'User not found. Unable to update.' });
                    }
                } catch (error) {
                    console.error("Error updating user profile picture", error);
                    res.status(500).send({ message: 'An error occurred while updating the user profile picture.' });
                }
            });
        });
    });

    return router;
};
