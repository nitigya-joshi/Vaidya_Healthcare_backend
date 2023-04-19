const express = require('express');
const { registerUser, authUser, logout, updateUser, uploadAvatar, verifyEmail, getUserdata, getAllUsers, deleteUser, makeAdmin } = require('../controllers/userControllers');
const { auth, adminauth } = require('../middleware/auth')
const { upload } = require('../middleware/avatarUpload');
const router = express.Router()


/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: This api is used to register a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object 
 *             properties:
 *               name:
 *                  type: string
 *               username:
 *                  type: string
 *               gender:
 *                  type: string
 *               email:
 *                  type: string
 *               password:
 *                  type: string
 *               mobile:
 *                  type: string
 *               address:
 *                  type: string
 *               pic:
 *                  type: Buffer
 *               appointments:
 *                  type: string
 *     responses:
 *       201:
 *         description: User data added successfully!
 *         content:
 *           application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  status: 
 *                    type: integer
 *                    example: 201
 *                  message: 
 *                    type: string
 *                    example: User data added successfully!
 *       400:
 *         description: Error adding user data!
 *         content:
 *           application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  status: 
 *                    type: integer
 *                    example: 400
 *                  message: 
 *                    type: string
 *                    example: Error adding user data!
 *       
 */

router.route('/register').post(registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Take the contact data from the user and store it in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object 
 *             properties:
 *               email:
 *                  type: string
 *               password:
 *                  type: string
 *     responses:
 *       200:
 *         description: The Login happened Successfully
 *         content:
 *           application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  status: 
 *                    type: integer
 *                    example: 200
 *                  message: 
 *                    type: string
 *                    example: Logged in successfully!
 *       400:
 *         description: Error while logging!
 *         content:
 *           application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  status: 
 *                    type: integer
 *                    example: 400
 *                  message: 
 *                    type: string
 *                    example: Error while logging!       
 *       
 */
router.route('/login').post(authUser);
router.route('/logout').get(auth, logout);

/**
 * @swagger
 * /users/updateuser:
 *   patch:
 *     summary: This api is used to update user data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object 
 *             properties: 
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               mobile: 
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: User data updated successfully!
 *         content:
 *           application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  status: 
 *                    type: integer
 *                    example: 200
 *                  message: 
 *                    type: string
 *                    example: User data updated!
 *       400:
 *         description: Error updating user data!
 *         content:
 *           application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  status: 
 *                    type: integer
 *                    example: 400
 *                  message: 
 *                    type: string
 *                    example: Error while updating user data!        
 *       
 */

router.route('/updateuser').patch(auth, updateUser);

/**
 * @swagger
 * /users/verify/:userId/:uniqueString:
 *   get:
 *     parameters: 
 *       -  in: path
 *          name: userId
 *          schema: 
 *            type: string
 *          required: true
 *       -  in: path
 *          name: uniqueString
 *          schema: 
 *            type: string
 *          required: true
 *          description: API to verify mail id.
 *     summary: Verify E-mail ID
 *     responses:
 *       200:
 *         description: API to verify mail-id.
 *         content:
 *           application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  status: 
 *                    type: integer
 *                    example: 200
 *                  message: 
 *                    type: string
 *                    example: Mail -ID verified Succesfuly!
 *       400:
 *         description: Mail -ID  Didn't verified.
 *         content:
 *           application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  status: 
 *                    type: integer
 *                    example: 400
 *                  message: 
 *                    type: string
 *                    example: Mail -ID  Didn't verified!    
 *       
 */

router.route('/upload').post(auth, upload.single("avatarInput"), uploadAvatar);

/**
 * @swagger
 * /users/verify/:userId/:uniqueString:
 *   get:
 *     parameters: 
 *       -  in: path
 *          name: userId
 *          schema: 
 *            type: string
 *          required: true
 *       -  in: path
 *          name: uniqueString
 *          schema: 
 *            type: string
 *          required: true
 *          description: API to verify mail id.
 *     summary: Verify E-mail ID
 *     responses:
 *       200:
 *         description: API to verify mail-id.
 *         content:
 *           application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  status: 
 *                    type: integer
 *                    example: 200
 *                  message: 
 *                    type: string
 *                    example: Mail -ID verified Succesfuly!
 *       400:
 *         description: Mail -ID  Didn't verified.
 *         content:
 *           application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  status: 
 *                    type: integer
 *                    example: 400
 *                  message: 
 *                    type: string
 *                    example: Mail -ID  Didn't verified!    
 *       
 */

router.route('/verify/:userId/:uniqueString').get(verifyEmail);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get User Data
 *     responses:
 *       200:
 *         description: API to get user Data.
 *         content:
 *           application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  status: 
 *                    type: integer
 *                    example: 200
 *                  message: 
 *                    type: string
 *                    example: User data fetched Succesfuly!
 *       400:
 *         description: API to get userData.
 *         content:
 *           application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  status: 
 *                    type: integer
 *                    example: 400
 *                  message: 
 *                    type: string
 *                    example: USer Data didn't fetched succesfuly!    
 *       
 */
router.route('/me').get(auth, getUserdata);
/**
 * @swagger
 * /users/getusers:
 *   get:
 *     summary: Get All Users Data
 *     responses:
 *       200:
 *         description: API to get All UsersData.
 *         content:
 *           application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  status: 
 *                    type: integer
 *                    example: 200
 *                  message: 
 *                    type: string
 *                    example: All users data fetched Succesfuly!
 *       400:
 *         description: API to get All UsersData.
 *         content:
 *           application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  status: 
 *                    type: integer
 *                    example: 400
 *                  message: 
 *                    type: string
 *                    example: Data didn't fetched succesfuly!    
 *       
 */
router.route('/getusers').get(auth, adminauth, getAllUsers);

/**
 * @swagger
 * /users/deleteUser:
 *   get:
 *     parameters: 
 *       -  in: query
 *          name: id
 *          schema: 
 *            type: string
 *          required: true
 *          description: This is the unique User ID
 *     summary: Delete a User of particular id
 *     responses:
 *       200:
 *         description: API to delete user data.
 *         content:
 *           application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  status: 
 *                    type: integer
 *                    example: 200
 *                  message: 
 *                    type: string
 *                    example: user data deleted Succesfuly!
 *       400:
 *         description: API to delete  UsersData.
 *         content:
 *           application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  status: 
 *                    type: integer
 *                    example: 400
 *                  message: 
 *                    type: string
 *                    example: User data  didn't deleted succesfuly!    
 *       
 */
router.route('/deleteUser').post(auth, adminauth, deleteUser);
router.route('/makeadmin').post(auth, adminauth, makeAdmin);
module.exports = router;