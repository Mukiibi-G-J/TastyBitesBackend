// /* ------------------- Email --------------------- */

// /* ------------------- Notification --------------------- */

// /* ------------------- OTP --------------------- */

export const GenerateOtp = () => {
  const otp = Math.floor(10000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  //! 'Your Account SID from TWILIO DASHBOARD'
  const accountSid = 'ACbff1380e775c8f5ad5235e4086fbe6f4';
  // !'YOUR AUTH TOKEN AS I SAID ON VIDEO';
  const authToken = 'bcf03a420efb494b368895395bb26bb8';
  const client = require('twilio')(accountSid, authToken);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    // from: 'Your TWILIO PHONE NUMBER YOU CAN GET IT FROM YOUR DASHBOARD',
    from: '+13252527801',
    to: `+256${toPhoneNumber}`, // recipient phone number // Add country before the number
  });

  return response;
};

/* ------------------- Payment --------------------- */
