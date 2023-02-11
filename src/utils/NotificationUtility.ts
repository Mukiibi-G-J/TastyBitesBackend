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
  const accountSid = 'AC9899da24d5b233a878300d22477377ef';
  // !'YOUR AUTH TOKEN AS I SAID ON VIDEO';
  const authToken = '39a7263ba15d75b94e3830eb531ea7f2';
  const client = require('twilio')(accountSid, authToken);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    // from: 'Your TWILIO PHONE NUMBER YOU CAN GET IT FROM YOUR DASHBOARD',
    from: '+19292983736',
    to: `+256${toPhoneNumber}`, // recipient phone number // Add country before the number
  });
  console.log(response);

  return response;
};

/* ------------------- Payment --------------------- */

