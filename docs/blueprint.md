# **App Name**: Elliee's Portfolio

## Core Features:

- ATS-Inspired Portfolio Sections: Display structured information for Experience, Projects, Skills, Education, and Certifications with premium typography and dynamic layouts.
- Hero Section with Interactive Elements: Full-viewport landing with a large display name, role-typing animation, 'Open to Work' status badge, and key contact information.
- Animated Floating Chatbot Trigger: A highly interactive and visually prominent bubble animation, with a drawing arrow, to invite users to interact with the AI assistant.
- Gemini-Powered AI Personal Assistant: An AI tool leveraging Gemini 1.5 Flash to intelligently converse with users about the portfolio owner's background, projects, and skills.
- Chatbot User Interface: A slide-up chat panel with distinct message styling for user and AI, incorporating conversational flow for a rich interaction experience.
- Conversational Email Tool: An AI-driven conversational tool within the chatbot to guide users through collecting their name, email, and message to send an email to the portfolio owner.
- Firebase Cloud Functions Backend: Serverless backend utilizing Firebase Cloud Functions for securely handling Gemini API calls and orchestrating email sending services for the chatbot functionality.

## Style Guidelines:

- Background Color: --lc-surface (#0F1E1C), providing a deep, immersive dark canvas.
- Primary Accent Color: --lc-accent (#00C9A7), delivering a bright, signature seafoam green for interactive elements and highlights.
- Secondary Surface Color: --lc-surface-2 (#162421), used for distinct card backgrounds and layered elements.
- Border Color: --lc-border (#1F3531), creating subtle separations and definitions within the dark aesthetic.
- Text Color: --lc-text (#E8F5F2), ensuring clear readability with an off-white contrast against dark backgrounds.
- Muted Text Color: --lc-muted (#6B9E96), for secondary information, labels, and less prominent text.
- Primary Structural Color: --lc-primary (#1C3F3A), a deep teal-black, used for general structuring and subtle primary accents.
- Highlight Color: --lc-highlight (#7CFFCB), specifically for hover states and emphasizing interactive components.
- Warning/Badge Color: --lc-warning (#F4A94E), providing a distinctive amber for status tags, badges, and notifications.
- Display/Headings Font: 'Space Mono' (monospace) for an ATS/terminal aesthetic, reinforcing the structured design. Note: currently only Google Fonts are supported.
- Body Font: 'DM Sans' (sans-serif) for a clean, modern contrast and improved readability across all content. Note: currently only Google Fonts are supported.
- Leverage ATS-inspired badges, status chips, and structured visual elements; integrate modern AI-themed icons (sparkle, waveform) and a minimalist monogram or cursor favicon.
- Hero Layout: A 100vh hero section with a two-column desktop layout (60/40 split), condensing to a stacked, mobile-first design for responsiveness.
- Dashboard Panels: All content sections are presented as structured ATS-inspired panels, featuring clear headers, badges, and data-grid-like arrangements.
- Dynamic Navigation: A sticky top navigation bar with highlighted active links, transitioning to a hamburger menu for mobile devices.
- Chatbot Panel: A slide-up chatbot panel originating from the bottom-right on desktop, expanding to a full-screen drawer on mobile for seamless interaction.
- Typing Animation: Implement a captivating typewriter effect for role display in the hero section, utilizing framer-motion or CSS keyframes for dynamic text reveal and deletion.
- Interactive Float Animation: Create an engaging floating chatbot trigger bubble with multiple animations including a drawing SVG arrow, idle bob, pulse ring, and a distinctive click 'pop' effect.
- Panel Transitions: Utilize smooth spring easing animations for the chatbot panel slide-up and subtle scroll-triggered reveal animations (fade and slide up) for all portfolio sections.
- Background Effects: Incorporate a subtle, animated background grid and radial gradient glow in the hero section to create a sophisticated, data-processing aesthetic.