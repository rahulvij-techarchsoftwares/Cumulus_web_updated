const express = require("express");
const router = express.Router();
const { sendEmail } = require('../email/emailUtils');
const Subscription = require("../models/userSubscriptions");
const { authenticateToken } = require("../routes/userRoutes"); 
router.post("/add", authenticateToken, async (req, res) => {
  const user_id = req.user.user_id; // Extracted from token
  const { designeeName, designeePhone, designeeEmail } = req.body;

  // Ensure valid email
  if (!designeeEmail || !designeeName) {
      return res.status(400).json({ message: "Designee name and email are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(designeeEmail)) {
      return res.status(400).json({ message: "Invalid email address format." });
  }

  console.log("Valid email to be sent to:", designeeEmail);  // Ensure it's a valid email address

  try {
      var body = `Hello ${designeeName}<br/><br/>Please click on below link for registration with Cumulus.<br/><br/>`;
      body += `<a href='http://16.170.230.178:3000/?email=${designeeEmail}&created_by=${user_id}'>http://16.170.230.178:3000/?email=${designeeEmail}&created_by=${user_id}</a>`;
      body += "<br/><br/>Thanks<br/>Cumulus Team!";

      const emailResponse = await sendEmail({
          to: designeeEmail,  // Only valid email here
          subject: "Member Registration Email",
          body
      });

      if (emailResponse.success) {
          res.status(200).json({
              message: "Subscription created successfully.",
              previewURL: emailResponse.previewURL,
          });
      } else {
          res.status(500).json({ message: "Error sending OTP email.", error: emailResponse.error });
      }
  } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Error creating subscription.", error: error.message });
  }
});

  
router.get("/get-subscriptions", async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Error fetching subscriptions.", error: error.message });
  }
});
module.exports = router;
