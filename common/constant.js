const OTP = Math.floor(100000 + Math.random() * 900000);
const SALT_ROUNDS = 10;
const SUCCESSFULLY_LOGIN = 'You have successfully login.';
const USER_ID_NOT_FOUND = { message: "User id not found." };
const EMAIL_ID_NOT_FOUND = { message:"Email does't exits." };
const INVALID_PASSWORD = { message:"Invalid password." };
const INVALID_OTP = { message:"Invalid otp." };
const PASSWORD_NOT_MATCH = { message:"You have entered incorrect password." };
const INVALID_CREDENTIALS = { message: "Invalid credentials." };
const PROFILE_UPDATE = "Profile successfully updated."
const DELETE_USER = "You have successfully deleted this user."
const SEND_OTP = "An OTP hase been sent on you registered email address.";
const PASSWORD_CHANGE = "Password successfully change."
const EMAIL_BLANK_ERROR = { message:"Email can't be blank." }
const ID_BLANK_ERROR = { message:"Id can't be blank." }
const PASSWORD_BLANK_ERROR = { message:"Password can't be blank."}
const NAME_BLANK_ERROR = { message:"Name can't be blank."}
const OTP_BLANK_ERROR = { message:"OTP can't be blank." }

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
    PASSWORD_CHANGE,
    EMAIL_BLANK_ERROR,
    ID_BLANK_ERROR,
    PASSWORD_BLANK_ERROR,
    NAME_BLANK_ERROR,
    OTP_BLANK_ERROR
}