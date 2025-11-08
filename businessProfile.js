const fs = require('fs');
const path = require('path');

class BusinessProfile {
    constructor() {
        this.profilesPath = path.join(__dirname, 'business-profiles.json');
        this.profiles = this.loadProfiles();
    }

    loadProfiles() {
        try {
            if (fs.existsSync(this.profilesPath)) {
                return JSON.parse(fs.readFileSync(this.profilesPath, 'utf8'));
            }
            return {};
        } catch (error) {
            console.error('Error loading profiles:', error);
            return {};
        }
    }

    saveProfiles() {
        try {
            fs.writeFileSync(this.profilesPath, JSON.stringify(this.profiles, null, 2));
        } catch (error) {
            console.error('Error saving profiles:', error);
        }
    }

    getProfile(phoneNumber) {
        return this.profiles[phoneNumber] || null;
    }

    saveProfile(phoneNumber, profile) {
        this.profiles[phoneNumber] = profile;
        this.saveProfiles();
    }

    isProfileComplete(phoneNumber) {
        const profile = this.getProfile(phoneNumber);
        if (!profile) return false;

        const requiredFields = ['businessName', 'address', 'email', 'phone', 'currency'];
        return requiredFields.every(field => profile[field] && profile[field].trim() !== '');
    }
}

module.exports = new BusinessProfile();