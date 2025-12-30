const userModel = require('../models/user.model');

module.exports.createUser = async function ({
    firstname,
    lastname,
    email,
    password
}){
    if(!firstname || !email || !password){
        throw new Error('All fields are required');
    }

    const user = await userModel.create({
        fullname: {
            firstName: firstname,
            lastName: lastname
        },
        email,
        password
    });
    return user;
}
