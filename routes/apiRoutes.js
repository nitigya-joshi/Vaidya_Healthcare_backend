const express = require('express');
const api = require('../controllers/apiControllers');
// const { postContactData, bookappointment, getappointments, deleteAppointment, payment } = require('../controllers/apiControllers')
const router = express.Router()
const { auth, doctorauth } = require('../middleware/auth')

/** 
   * @swagger
 * tags:
 *   - name: contactData
 *     description: Users contact form data
 * 
 *   - name: appointments
 *     description: Appointment related operations
 * 
 *   - name: checkout session
 *     description: Endpoint for payment endpoint
 * 
 * paths:
 *   /postContactData:
 *     post:
 *       tags:
 *         - contactData
 *       summary: API for contact form
 *       description: Contact data of doctors
 *       operationId: postContact
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ContactData"
 *       responses:
 *         "201":
 *           description: Created
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   message:
 *                     type: string
 *                 example:
 *                   _id: "298378123"
 *                   name: Nitigya
 *                   email: nitigya@gmail.com
 *                   phone: "9171412345"
 *                   message: Hello world!
 * 
 *         "400":
 *           description: Error Description
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     description: Error message indicating invalid request body
 *                     example: Invalid request! Error occured.
 * 
 * 
 *   /bookappointment:
 *     post:
 *       summary: Book an appointment
 *       description: Allows users to book an appointment with a doctor
 *       tags:
 *         - appointments
 *       requestBody:
 *         description: Appointment details
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Appointment"
 *       responses:
 *         '201':
 *           description: Appointment created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: ok
 *                   appointmentId:
 *                     type: string
 *                     example: '607d62c2b2a02b001d8c5091'
 *         '400':
 *           description: Error booking an appointment
 *         '500':
 *           description: User credentials not found in our database
 *   
 *   
 *   /getappointments:
 *     get:
 *       parameters:
 *         -  in: cookie
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: This is the unique User ID
 *       summary: Get all appointments for the authenticated user
 *       tags:
 *         - appointments
 *       security:
 *          - cookieAuth: []
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   appointments:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Appointment'
 *         '401':
 *           description: No appointment found
 *         '500':
 *           description: User credentials not found in our database
 *     
 * 
 *   /deleteAppointment:
 *     get:
 *       parameters:
 *         -  in: query
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: This is the unique appointment id
 *       summary: Delete any appointment
 *       description: Allows users to delete any appointment
 *       tags:
 *         - appointments
 *       responses:
 *         '200':
 *           description: successful deleted
 *           content:
 *             application/json:
 *               schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Appointment deleted successfully
 *         '400':
 *           description: Invalid status value
 * 
 *   /create-checkout-session:
 *     post:
 *       summary: Create a checkout session for making payment
 *       description: Payment is made using Stripe
 *       tags:
 *         - checkout session
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docId:
 *                   type: string
 *                   description: ID of the doctor for whom the payment is being made
 *               required:
 *                 - docId
 *       responses:
 *         '200':
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: Success status
 *                   url:
 *                     type: string
 *                     description: URL for the checkout session
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     description: Error message
 * 
 * 
 * 
 * components:
 *   schemas:
 *     ContactData:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - message
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         message:
 *           type: string
 *       example:
 *         name: Nitigya
 *         email: nitigya@gmail.com
 *         phone: "9171412345"
 *         message: Hello world!
 *       xml:
 *         name: ContactData
 *     
 *     Appointment:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - mobile
 *         - age
 *         - dob
 *         - gender
 *         - appointmentDate
 *         - appointmentTime
 *         - user
 *         - doctor
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         mobile:
 *           type: string
 *         age:
 *           type: integer
 *           minimum: 0
 *           maximum: 120
 *         dob:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other]
 *         reason:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         appointmentDate:
 *           type: string
 *           format: date
 *         appointmentTime:
 *           type: string
 *         user:
 *           type: string
 *           format: uuid
 *           description: The user who is booking the appointment
 *         doctor:
 *           type: string
 *           format: uuid
 *           description: The doctor with whom the appointment is being booked
 *       example:
 *         name: John Doe
 *         email: johndoe@example.com
 *         mobile: 9876543210
 *         age: 30
 *         dob: '1993-03-26'
 *         gender: Male
 *         reason: Toothache
 *         city: Mumbai
 *         state: Maharashtra
 *         appointmentDate: '2023-04-01'
 *         appointmentTime: '10:00 AM'
 *         user: 6390ae76f3da0eb9734e17f8
 *         doctor: 626730ba0b3d491b43315079
 */


router.route('/postContactData').post(api.postContactData);
router.route('/bookappointment').post(auth, api.bookappointment);
router.route('/getappointments').get(auth, api.getappointments);
router.route('/deleteAppointment').get(auth, doctorauth, api.deleteAppointment);
router.route('/create-checkout-session').post(auth, api.payment);
module.exports = router;