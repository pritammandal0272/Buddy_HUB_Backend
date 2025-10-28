export const Random_OTP = () => {
  let min = 1000;
  let max = 9000;
  const OTP = Math.floor(Math.random() * (max - min + 1) + min);
  return OTP;
};
