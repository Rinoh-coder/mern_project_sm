// errors.utils.js


//signUpErrors
module.exports.signUpErrors = (err) => {
	let errors = { pseudo : '', email : '', password : ''}

    if (err.message.includes('pseudo')) {
        errors.pseudo = 'Pseudo trop court';
    }
    if (err.message.includes('email')) {
        errors.email = 'Email incorrect';
    }
    if (err.message.includes('password')) {
        errors.password = 'Le mot de passe doit faire minimum 6 caractères';
    }
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo')) {
        errors.pseudo = 'Pseudo déjà utilisé ';
    }
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email')) {
        errors.email = 'Email déjà utilisé ';
    }
    return errors;

}

//signInErrors
module.exports.signInErrors = (err) => {
	let errors = { email : '', password : ''}

    if (err.message.includes('email')) {
        errors.email = 'Email inconnu';
    }
    if (err.message.includes('password')) {
        errors.password = 'Le mot de passe est incorrect';
    }

    return errors;

}
