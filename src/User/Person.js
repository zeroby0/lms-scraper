class Person {
    setFirstName(firstName) {
        this.firstName = firstName;
    }

    getFirstName() {
        return this.firstName;
    }

    setMiddleName(middleName) {
        this.middleName = middleName;
    }

    getMiddleName() {
        return this.middleName;
    }

    setLastName(lastname) {
        this.lastname = lastname;
    }

    getLastName() {
        return this.lastname;
    }

    setShortName(shortname) {
        this.shortname = shortname;
    }

    getShortName() {
        return this.shortname;
    }

    setFullName(fullname) {
        if (fullname) {
            this.fullname = fullname;
            return true;
        }
        return false;
    }

    getFullName() {
        return this.fullname;
    }
}

module.exports = Person;