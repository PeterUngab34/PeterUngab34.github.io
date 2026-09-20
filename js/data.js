/* =====================================================================
   PORTFOLIO CONTENT
   ---------------------------------------------------------------------
   Edit this file to update the website. Every section (skills, projects,
   experience, etc.) is generated from the data below, so you can add,
   remove, or reorder items without touching the HTML.
   ===================================================================== */

// Skill icons are self-hosted (from Devicon, MIT) so the site loads nothing from third-party CDNs.
const ICONS = "assets/icons";

const PORTFOLIO = {
  /* ---------------- Personal info ---------------- */
  profile: {
    name: "Peter Paul Ungab",
    initials: "PU",
    role: "Software Engineer | Full-Stack Developer",
    tagline:
      "Computer Engineering student who designs, builds, tests, and ships full-stack software — from React interfaces to REST APIs and SQL schemas.",
    email: "peterpaulungab00@gmail.com",
    location: "Digos City, Philippines",
    timeZone: "Asia/Manila", // drives the live "Local time" in the Contact section
    availability:
      "Open to internships, freelance projects, and software engineering opportunities.",
    availabilityShort: "Open to opportunities", // hero badge + the status pill of "At a glance"
    github: "https://github.com/PeterUngab34",
    linkedin: "", // paste your LinkedIn URL here when you have one; the icon appears automatically
    resume: "assets/resume.pdf",
    // Replace with your own photo, e.g. "assets/images/profile.jpg"
    photo: "assets/images/profile-placeholder.svg",
    photoAlt: "Monogram of Peter Paul Ungab", // change to "Portrait of …" when you add a real photo
  },

  /* ---------------- About: "At a glance" card ----------------
     Short label/value rows. The status pill beside the heading shows profile.availabilityShort. */
  glance: [
    { label: "Role", value: "Full-stack developer" },
    { label: "Based in", value: "Digos City, Philippines" },
    { label: "Education", value: "BS Computer Engineering, 2028" },
    { label: "Core stack", value: "JavaScript · React · Node.js · Java · SQL" },
  ],

  /* ---------------- Integrations ---------------- */
  integrations: {
    // Your GitHub username (e.g. "octocat"). When set, your latest public
    // repositories are loaded automatically into the GitHub section.
    githubUsername: "PeterUngab34",
    githubRepoCount: 6,

    // Contact form: create a free form at https://formspree.io and paste the
    // endpoint here (e.g. "https://formspree.io/f/abcdwxyz").
    // If left empty, the form opens the visitor's email app instead.
    formEndpoint: "",
  },

  /* ---------------- About: areas of interest ---------------- */
  interests: [
    "Software Engineering",
    "Web Development",
    "Full-Stack Development",
    "Front-End Development",
    "Back-End Development",
    "Database Development",
    "Application Development",
  ],

  /* ---------------- Skills ----------------
     icon: image URL (Devicon), or null to show `badge` text instead.
     invert: true for black logos, which are flipped to white on the dark background.
     lighten: true for dark-colored logos that need a brightness boost to stay visible. */
  skills: [
    {
      category: "Programming Languages",
      icon: "code",
      items: [
        { name: "JavaScript", icon: `${ICONS}/javascript-original.svg` },
        { name: "Python", icon: `${ICONS}/python-original.svg` },
        { name: "Java", icon: `${ICONS}/java-original.svg` },
        { name: "C++", icon: `${ICONS}/cplusplus-original.svg` },
        { name: "C", icon: `${ICONS}/c-original.svg` },
        { name: "SQL", icon: null, badge: "SQL" },
      ],
    },
    {
      category: "Front-End",
      icon: "layout",
      items: [
        { name: "HTML5", icon: `${ICONS}/html5-original.svg` },
        { name: "CSS3", icon: `${ICONS}/css3-original.svg` },
        { name: "JavaScript", icon: `${ICONS}/javascript-original.svg` },
        { name: "React", icon: `${ICONS}/react-original.svg` },
        { name: "Bootstrap", icon: `${ICONS}/bootstrap-original.svg` },
        { name: "Tailwind CSS", icon: `${ICONS}/tailwindcss-original.svg` },
      ],
    },
    {
      category: "Back-End",
      icon: "server",
      items: [
        { name: "Node.js", icon: `${ICONS}/nodejs-original.svg` },
        { name: "Express.js", icon: `${ICONS}/express-original.svg`, invert: true },
      ],
    },
    {
      category: "Database",
      icon: "database",
      items: [
        { name: "MySQL", icon: `${ICONS}/mysql-original.svg`, lighten: true },
        { name: "PostgreSQL", icon: `${ICONS}/postgresql-original.svg` },
        { name: "MongoDB", icon: `${ICONS}/mongodb-original.svg` },
      ],
    },
    {
      category: "Tools & Workflow",
      icon: "tool",
      items: [
        { name: "Git", icon: `${ICONS}/git-original.svg` },
        { name: "GitHub", icon: `${ICONS}/github-original.svg`, invert: true },
        { name: "VS Code", icon: `${ICONS}/vscode-original.svg` },
        { name: "REST APIs", icon: null, badge: "API" },
        { name: "Postman", icon: `${ICONS}/postman-original.svg` },
      ],
    },
  ],

  /* ---------------- Featured projects ----------------
     Replace these examples with your real projects.
     Set github/demo to "" to hide a button. Cards are laid out as a bento grid in this
     order: wide + narrow, narrow + wide, … and an odd last card spans the full row.
     demoLabel: optional text for the demo button (e.g. "Download App").
     download: optional link for an extra "Download" button (e.g. a release page).
     type: optional label after the card number. tests: optional badge on the screenshot. */
  projects: [
    {
      title: "Task Management Application",
      type: "Web app · client-side",
      tests: "29 automated browser tests",
      image: "assets/projects/task-manager.png",
      description:
        "A responsive web application that allows users to create, organize, update, and manage daily tasks.",
      tech: ["HTML", "CSS", "JavaScript", "LocalStorage"],
      features: [
        "Create, edit, complete, and delete tasks with undo",
        "Priorities, due dates, and overdue highlighting",
        "Filter, search, and sort by status, priority, and date",
        "Keyboard shortcuts, light/dark theme, fully responsive",
      ],
      github: "https://github.com/PeterUngab34/task-manager",
      demo: "https://PeterUngab34.github.io/task-manager",
    },
    {
      title: "E-Commerce Website",
      type: "Full-stack web app",
      tests: "25 automated API tests",
      image: "assets/projects/ecommerce.webp",
      description:
        "Lumora — a modern online store with product browsing, a persistent shopping cart, checkout, and order history, backed by a REST API.",
      tech: ["React", "Node.js", "Express", "MongoDB", "JWT"],
      features: [
        "Catalog with search, category/price filters, sorting, and pagination",
        "Persistent cart and validated checkout with order history",
        "Express + MongoDB REST API with server-side pricing and stock checks",
        "JWT authentication with bcrypt, covered by 25 automated API tests",
      ],
      github: "https://github.com/PeterUngab34/ecommerce",
      demo: "https://peterungab34.github.io/ecommerce/",
    },
    {
      title: "Real-Time Chat Application",
      type: "Full-stack web app · WebSockets",
      tests: "22 integration tests",
      image: "assets/projects/chat-app.png",
      description:
        "Parley — a real-time messaging application where users chat in rooms through a clean, responsive interface.",
      tech: ["React", "Node.js", "Express", "Socket.IO", "MongoDB"],
      features: [
        "Instant messaging over WebSockets with server-side validation and rate limiting",
        "Chat rooms with live online status and per-room member lists",
        "Typing indicators and unread badges",
        "Message history in MongoDB with paging, covered by 22 automated tests",
      ],
      github: "https://github.com/PeterUngab34/chat-app",
      demo: "https://peterungab34.github.io/chat-app/",
    },
    {
      title: "Student Management System",
      type: "Desktop app + web edition",
      tests: "73 unit tests",
      image: "assets/projects/student-system.webp",
      description:
        "A desktop application for managing student records, courses, enrollments, and grades on a normalized MySQL database — with a web edition that runs the same SQL schema in your browser.",
      tech: ["Java", "Swing", "JDBC", "MySQL", "SQL", "JUnit 5"],
      features: [
        "Full CRUD for student records with per-field validation",
        "Live search, filter, and sort using parameterized SQL queries",
        "Normalized relational schema with foreign keys, constraints, and indexes",
        "Enrollment and grade tracking with unit-weighted GPA, covered by 73 tests",
      ],
      github: "https://github.com/PeterUngab34/student-management-system",
      demo: "https://peterungab34.github.io/student-management-system/",
      download: "https://github.com/PeterUngab34/student-management-system/releases/latest",
    },
    {
      title: "Personal Portfolio Website",
      type: "Static site · no dependencies",
      image: "assets/projects/portfolio.webp",
      description:
        "This site — a dark, glass-and-red portfolio with no frameworks, no build step, and no third-party requests.",
      tech: ["HTML", "CSS", "JavaScript"],
      features: [
        "Strict Content-Security-Policy with self-hosted fonts and icons",
        "Every section rendered from one editable data file",
        "Starfield, film grain, pointer spotlight, and glass cards in plain CSS — no libraries",
        "Accessible markup, reduced-motion support, and no-JavaScript fallback",
      ],
      github: "https://github.com/PeterUngab34/PeterUngab34.github.io",
      demo: "https://peterungab34.github.io/",
    },
  ],

  /* ---------------- Experience timeline ----------------
     Only list real experience. Example of a company role:
     {
       role: "Software Developer Intern",
       org: "Company Name",
       type: "Internship",
       period: "2026",
       points: [
         "Developed and maintained software features",
         "Fixed bugs and improved application performance",
         "Collaborated with developers",
         "Used Git and GitHub for version control",
       ],
     },
     Other ideas: "Freelance Developer" (type: "Freelance"). */
  experience: [
    {
      role: "Independent Software Developer",
      org: "Personal Projects",
      type: "Self-directed",
      period: "2025 — Present",
      points: [
        "Designed and built full-stack web applications from planning to deployment",
        "Developed REST APIs with Node.js and Express connected to SQL and NoSQL databases",
        "Built responsive, accessible interfaces with HTML, CSS, JavaScript, and React",
        "Managed source code with Git and GitHub using branches and clear commit history",
      ],
    },
    {
      role: "Academic Software Projects",
      org: "Cor Jesu College",
      type: "Academic",
      period: "2024 — Present",
      points: [
        "Built course projects in Java, C++, Python, and SQL applying OOP and data structures",
        "Designed normalized relational databases for record-management systems",
        "Collaborated in team projects using version control and task planning",
        "Presented technical solutions and documentation to faculty and peers",
      ],
    },
    {
      role: "Continuous Learning",
      org: "Online Courses & Documentation",
      type: "Self-study",
      period: "Ongoing",
      points: [
        "Practice problem solving and algorithms on coding platforms",
        "Explore modern tools and frameworks through hands-on builds",
        "Follow software engineering best practices: testing, clean code, and code review",
      ],
    },
  ],

  /* ---------------- Education ---------------- */
  education: [
    {
      degree: "Bachelor's Degree",
      program: "Bachelor of Science in Computer Engineering",
      school: "Cor Jesu College — Digos City, Davao del Sur",
      period: "Expected Graduation: 2028",
      coursework: [
        "Programming",
        "Data Structures and Algorithms",
        "Object-Oriented Programming",
        "Database Systems",
        "Web Development",
        "Computer Networks",
        "Software Engineering",
        "Digital Logic",
        "Computer Architecture",
      ],
    },
  ],

  /* ---------------- Certifications (optional) ----------------
     Replace with your real certificates, or set to [] to hide the section. */
  // Example entry:
  // { name: "Responsive Web Design", org: "freeCodeCamp", date: "2026", url: "https://..." },
  certifications: [],

  /* ---------------- Services / What I can do ---------------- */
  services: [
    {
      title: "Web Development",
      icon: "globe",
      text: "Responsive sites that work on any screen, built without heavy dependencies and checked in real browsers.",
    },
    {
      title: "Software Development",
      icon: "code",
      text: "Desktop and web applications with readable, maintainable code — backed by automated tests, not hope.",
    },
    {
      title: "Front-End Development",
      icon: "layout",
      text: "Accessible, keyboard-friendly interfaces in React or vanilla JavaScript, with light and dark themes.",
    },
    {
      title: "Back-End Development",
      icon: "server",
      text: "REST APIs with Node.js and Express: authentication, validation, rate limiting, and SQL or NoSQL schemas.",
    },
  ],

  /* ---------------- Hero stats ----------------
     Short, honest numbers shown in the glass strip under the hero (counted up on load). */
  stats: [
    { value: 5, label: "Projects built" },
    { value: 149, label: "Automated tests written" },
    { value: 22, label: "Technologies" },
  ],
};
