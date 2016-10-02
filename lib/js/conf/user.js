import storage from '../storage/permanent';
import uuid from '../uuid';

const namespace = 'user';

// Get a user from storage. Returns an object representing the user.
const getAll = () => {
    return storage.getAll().then((data) => {
        const existingUser = data[namespace];
        return Object.assign({}, existingUser);
    });
};

// Save a user in storage. Takes in the data used to represent the user.
// Will overwrite any existing user.
const setAll = (input) => {
    return storage.set({
        [namespace] : input
    });
};

// Merge some new data into the existing user, with the
// new data taking precedence.
const set = (input) => {
    return getAll().then((existingUser) => {
        return setAll(Object.assign({}, existingUser, input));
    });
};

// Get the current user ID from storage.
const getId = () => {
    return getAll().then((existingUser) => {
        return existingUser.id;
    });
};

// Return the current user if one exists.
// Otherwise create a new user.
const create = () => {
    return getAll().then((existingUser) => {
        if (existingUser.id) {
            return existingUser;
        }

        const newUser = Object.assign(existingUser, {
            id : uuid()
        });

        return set(newUser).then(() => {
            return newUser;
        });
    });
};

export default {
    getId,
    create
};
