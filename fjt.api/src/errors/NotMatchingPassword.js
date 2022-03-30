class NotMatchingPassword extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotMatchingPassword';
    }
}

module.exports = NotMatchingPassword;