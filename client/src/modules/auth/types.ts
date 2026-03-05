export interface userData {
    name: string;
    email: string;
    password: string;
    orgName?: string; // Optional for individual registration
    inviteCode?: string; // Optional for individual registration
}