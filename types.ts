export interface Resource {
    id: number;
    title: string;
    category: string;
    description: string;
    content: string; // HTML content
    created_at: string;
}

export interface StudentRequest {
    id: number;
    student_name: string;
    class_roll: string;
    topic: string;
    message: string;
    created_at: string;
}

export interface Notice {
    id: number;
    content: string;
    created_at: string;
}

export interface NavItem {
    label: string;
    id?: string;
    children?: NavItem[];
    dbId?: number; // Optional ID for database-backed categories
}

export interface Category {
    id: number;
    label: string;
    slug: string;
    created_at: string;
}

export const APP_CONSTANTS = {
    APP_NAME: "Unlock the World of English",
    TAGLINE: "Nurturing young recruits with pride and care",
    PHONE: "01930174402",
    EMAIL: "knrcnamr026@gmail.com",
    TEACHER_NAME: "Chinmoy Kumar Roy"
};

export const NAV_STRUCTURE: NavItem[] = [
    { label: "Home", id: "home" },
    { label: "Model Question", id: "model-question" },
    { label: "Literature", id: "literature" },
    { label: "Grammar", id: "grammar" },
    { label: "Paragraph", id: "paragraph" },
    { label: "Composition", id: "composition" },
    { label: "Dialogue", id: "dialogue" },
    { label: "Completing Story", id: "completing-story" },
    { label: "Report", id: "report" },
    { label: "Formal Letter", id: "formal-letter" },
    { label: "Informal Letter", id: "informal-letter" },
    { label: "Formal Email", id: "formal-email" },
    { label: "Informal Email", id: "informal-email" },
    { label: "Graph/Chart", id: "graph-chart" },
    { label: "Vocabulary", id: "vocabulary" },
    {
        label: "Account",
        children: [
            { label: "Admin Dashboard", id: "admin" },
            { label: "Student Request", id: "student-request" },
        ],
    },
];