module.exports.validateUserInputs = (
    email,
    username,
    password,
    confirmPassword
) => {

    const errors = {};

    if(username.trim() === ''){
        errors.username = 'Username cannot be empty';
    }

    if(email.trim() === ''){
        errors.email = 'Email must not be empty';
    } else {
        const regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!email.match(regEx)) {
            errors.email = 'Email must be a valid email address';
        }
    }

    if(password === '') {
        errors.password = 'Password must not be empty';
    } else {
        if(password !== confirmPassword) {
            errors.password = 'Password and ConfirmPassword do not match';
        }
    }


    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}


module.exports.validateUserLogin = (username, password) => {

    const errors = {};

    if(username.trim() === '') {
        errors.username = 'Username cannot be empty';
    }

    if(password === '') {
        errors.password = 'Password cannot be empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}