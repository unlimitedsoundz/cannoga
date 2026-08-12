export interface ProgrammeInstruction {
    welcomeMessage: string;
    instructions: string[];
}

export const PROGRAMME_INSTRUCTIONS: Record<string, ProgrammeInstruction> = {
    'default': {
        welcomeMessage: 'Welcome to the Cannoga College Online Application.',
        instructions: [
            'Ensure you have scanned copies of your academic transcripts.',
            'Prepare a digital copy of your passport.',
            'You can save your progress and return at any time.',
            'Double-check all entries before final submission.'
        ]
    },
    'it-management': {
        welcomeMessage: 'Welcome to the Information Technology Management Programme.',
        instructions: [
            'Prepare a brief summary of your technical background.',
            'Include any relevant industry certifications (AWS, Cisco, etc.).',
            'You will need to upload your Bachelor\'s degree transcript.',
            'A motivation letter explaining your interest in IT leadership is required.'
        ]
    },
    'business-admin': {
        welcomeMessage: 'Welcome to the Business Administration Programme.',
        instructions: [
            'Have your work experience details ready if applying for a Master\'s.',
            'Prepare your secondary school or previous degree certificates.',
            'A short statement on your career goals will be required.',
            'Ensure your contact details are accurate for interview scheduling.'
        ]
    },
    'environmental-science': {
        welcomeMessage: 'Welcome to the Environmental Science & Sustainability Programme.',
        instructions: [
            'Prepare details of any previous research or field work.',
            'Upload transcripts showing relevant science or geography credits.',
            'Specific interest in sustainability should be highlighted in your motivation.',
            'Field trip availability will be discussed after initial review.'
        ]
    }
};

export function getProgrammeInstructions(slug: string | undefined): ProgrammeInstruction {
    return PROGRAMME_INSTRUCTIONS[slug || 'default'] || PROGRAMME_INSTRUCTIONS['default'];
}
