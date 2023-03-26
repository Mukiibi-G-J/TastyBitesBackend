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
//   //! 'Your Account SID from TWILIO DASHBOARD'
//   // const accountSid = 'ACd9abf1bc98db292070ea30bc01e8a495';
//   const accountSid = "AC3c0255c2bd83829955dd5bfe03e16806";
//   // !'YOUR AUTH TOKEN AS I SAID ON VIDEO';
//   const authToken = "4df20dd25e45cb3aa090b5a609920631";
//   // const authToken = '0b5190df790bc9ce2a7fd4a2587badeb';
//   const client = require("twilio")(accountSid, authToken);
//   const response = await client.messages.create({
//     body: `Your OTP is ${otp}`,
//     // from: 'Your TWILIO PHONE NUMBER YOU CAN GET IT FROM YOUR DASHBOARD',
//     // from: '+15075449854',
//     from: "+14344437873",

//     to: `+256${toPhoneNumber}`, // recipient phone number // Add country before the number
//   });
  const response =  {
    otp: otp,

  };

  return response;
};

/* ------------------- Payment --------------------- */
