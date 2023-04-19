const express = require('express');
const doctorController = require('../controllers/doctorControllers');
const { auth, adminauth, doctorauth } = require('../middleware/auth')
const router = express.Router();

/**
 * @swagger
 * /doctors/register:
 *   post:
 *     summary: This api is used for registration of a doctor.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object 
 *             properties:
 *               name:
 *                  type: string
 *               category:
 *                  type: string
 *               languages:
 *                  type: string
 *               fee:
 *                  type: string
 *               edu:
 *                  type: string
 *               experience:
 *                  type: string
 *               email:
 *                  type: string
 *               mobile:
 *                  type: string
 *               clinicaddress:
 *                  type: string
 *               rating:
 *                  type: string
 *               pic:
 *                 type: buffer
 *     responses:
 *       201:
 *         description: Doctor data added successfully!
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
 *                    example:  USer registered as doctor successfully!
 *       400:
 *         description: Error registering as Doctor!
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
 *                    example: Error registering as Doctor!
 */


router.route('/register').post(auth, doctorController.registerDoctor);

/**
 * @swagger
 * /doctors/getdoctors:
 *   get:
 *     summary: Get All Doctors
 *     responses:
 *       200:
 *         description: API to get Doctors Data.
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
 *                    example: Doctor data fetched Succesfuly!
 *       400:
 *         description: API to get all Doctor's.
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
 *                    example: Doctor's Data didn't fetched succesfuly!    
 *       
 */
router.route('/getdoctors').get(doctorController.getDoctors);

/**
 * @swagger
 * /doctors/approve:
 *   get:
 *     parameters: 
 *       -  in: query
 *          name: id
 *          schema: 
 *            type: string
 *          required: true
 *          description: This is the unique User ID
 *     summary: Approve User as a Doctor.
 *     responses:
 *       200:
 *         description: API to make user as a Doctor.
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
 *                    example: user made to Doctor made successfuly!
 *       400:
 *         description: API to make user as a Doctor.
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
 *                    example: User Cannot be made as doctor, error occured!    
 *       
 */
router.route('/approve').post(auth, adminauth, doctorController.approveDoctor);

/**
 * @swagger
 * /doctors/deleteDoctor:
 *   get:
 *     parameters: 
 *       -  in: query
 *          name: id
 *          schema: 
 *            type: string
 *          required: true
 *          description: This is the unique User ID of Doctor
 *     summary: Remove User as a Doctor.
 *     responses:
 *       200:
 *         description: API to remove user as a Doctor.
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
 *                    example: user removed from Doctor  successfuly!
 *       400:
 *         description: API to remove user as from Doctor.
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
 *                    example: User Cannot be removed from doctor, error occured!    
 *       
 */
router.route('/deleteDoctor').post(auth, adminauth, doctorController.deleteDoctor);

/**
 * @swagger
 * /doctors/doctorappointments:
 *   get:
 *     summary: Get All appointment of doctor
 *     responses:
 *       200:
 *         description: API to get All appointment of doctor.
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
 *                    example: All appointments of doctor fetched Succesfuly!
 *       400:
 *         description: API to get All appointments of dotor.
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
 *                    example: Appointments didn't fetched succesfuly!    
 *       
 */
router.route('/doctorappointments').get(auth, doctorauth, doctorController.doctorappointments);

/**
 * @swagger
 * /doctors/doctor/{_id}:
 *   get:
 *     parameters: 
 *       -  in: path
 *          name: _id
 *          schema: 
 *            type: string
 *          required: true
 *          description: API to get Doctor's detail via id.
 *     summary: Get Doctor's detail via id.
 *     responses:
 *       200:
 *         description: API to get Doctor's detail via id..
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
 *                    example: Doctor's data fetched Succesfuly!
 *       400:
 *         description: API to get Doctor's detail via id.
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
 *                    example: Doctor's Data didn't fetched succesfuly!   
 *       
 */
router.route('/doctor/:id').get(doctorController.getDoctorById);
router.route('/unapproved').get(doctorController.getUnapprovedDoctors);
module.exports = router;