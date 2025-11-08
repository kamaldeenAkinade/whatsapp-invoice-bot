const setupSteps = {
    start: {
        message: "Welcome! Let's set up your business profile. What's your business name?",
        next: 'address',
        field: 'businessName'
    },
    address: {
        message: "Great! Now, please enter your business address:",
        next: 'email',
        field: 'address'
    },
    email: {
        message: "Please enter your business email address:",
        next: 'phone',
        field: 'email'
    },
    phone: {
        message: "Please enter your business phone number:",
        next: 'currency',
        field: 'phone'
    },
    currency: {
        message: "What currency do you use? (e.g., USD, EUR, GBP):",
        next: 'complete',
        field: 'currency'
    },
    complete: {
        message: "Great! Your business profile is complete. You can now create invoices by typing 'invoice'.",
        next: null,
        field: null
    }
};

class SetupManager {
    constructor() {
        this.activeSetups = new Map();
    }

    startSetup(phoneNumber) {
        this.activeSetups.set(phoneNumber, {
            currentStep: 'start',
            profile: {}
        });
        return setupSteps.start.message;
    }

    processSetupStep(phoneNumber, message) {
        const setup = this.activeSetups.get(phoneNumber);
        if (!setup) return null;

        const currentStepData = setupSteps[setup.currentStep];
        setup.profile[currentStepData.field] = message;

        if (currentStepData.next === 'complete') {
            businessProfile.saveProfile(phoneNumber, setup.profile);
            this.activeSetups.delete(phoneNumber);
            return setupSteps.complete.message;
        }

        setup.currentStep = currentStepData.next;
        return setupSteps[setup.currentStep].message;
    }

    isInSetup(phoneNumber) {
        return this.activeSetups.has(phoneNumber);
    }
}

module.exports = new SetupManager();