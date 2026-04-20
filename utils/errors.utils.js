// errors.utils.js

module.exports.signUpErrors = (err) => {
	let errors = { pseudo : '', email : '', password : ''}


    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo')) {
        errors.pseudo = 'Pseudo déjà utilisé ';
    }
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email')) {
        errors.email = 'Email déjà utilisé ';
    }

    if (err.message.includes('pseudo')) {
        errors.pseudo = 'Pseudo trop court';
    }
    if (err.message.includes('email')) {
        errors.email = 'Email incorrect';
    }
    if (err.message.includes('password')) {
        errors.password = 'Le mot de passe doit faire minimum 6 caractères';
    }


    return errors;

}
