const OTP = Math.floor(100000 + Math.random() * 900000);
const SALT_ROUNDS = 10;
const SUCCESSFULLY_LOGIN = 'You have successfully login.';
const USER_ID_NOT_FOUND = "User id not found.";
const EMAIL_ID_NOT_FOUND = "Email does't exits.";
const INVALID_PASSWORD = "Invalid password.";
const INVALID_OTP = "Invalid otp.";
const PASSWORD_NOT_MATCH = "You have entered incorrect password.";
const INVALID_CREDENTIALS = "Invalid credentials.";
const PROFILE_UPDATE = "Profile successfully updated.";
const DELETE_USER = "You have successfully deleted this user.";
const SEND_OTP = "An OTP hase been sent on you registered email address.";
const PASSWORD_CHANGE = "Password successfully change.";

module.exports = {

    OTP,
    SALT_ROUNDS,
    SUCCESSFULLY_LOGIN,
    USER_ID_NOT_FOUND,
    EMAIL_ID_NOT_FOUND,
    INVALID_PASSWORD,
    PASSWORD_NOT_MATCH,
    INVALID_OTP,
    INVALID_CREDENTIALS,
    PROFILE_UPDATE,
    DELETE_USER,
    SEND_OTP,
    PASSWORD_CHANGE
}