import { Template } from "../types/template";

export const defaultTemplates: Template[] = [
  //   {
  //     id: 'cover-letter',
  //     name: 'Cover Letter',
  //     content: `Dear Hiring Manager,

  // My name is {{name}} and I am writing to express my interest in the {{position}} role at {{company}}. With {{experience}} years of experience in {{field}}, I believe I would be a valuable addition to your team.

  // My key skills include:
  // {{#skills}}
  // • {{.}}
  // {{/skills}}

  // I am particularly excited about this opportunity because {{reason}}. My background in {{background}} has prepared me well for the challenges of this role.

  // {{#achievements}}
  // - {{.}}
  // {{/achievements}}

  // I would welcome the opportunity to discuss how my experience and passion for {{field}} can contribute to {{company}}'s continued success.

  // Thank you for your consideration.

  // Sincerely,
  // {{name}}`,
  //     fields: [
  //       { key: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'John Doe' },
  //       { key: 'position', label: 'Position', type: 'text', required: true, placeholder: 'Software Developer' },
  //       { key: 'company', label: 'Company Name', type: 'text', required: true, placeholder: 'Tech Corp' },
  //       { key: 'experience', label: 'Years of Experience', type: 'text', required: true, placeholder: '5' },
  //       { key: 'field', label: 'Field/Industry', type: 'text', required: true, placeholder: 'Software Development' },
  //       { key: 'skills', label: 'Skills', type: 'array', placeholder: 'JavaScript, React, Node.js' },
  //       { key: 'reason', label: 'Reason for Interest', type: 'textarea', placeholder: 'the company\'s innovative approach to technology...' },
  //       { key: 'background', label: 'Background', type: 'text', placeholder: 'full-stack development' },
  //       { key: 'achievements', label: 'Key Achievements', type: 'array', placeholder: 'Led a team of 5 developers, Increased performance by 40%' }
  //     ]
  //   },
  {
    id: "email-template",
    name: "Professional Email",
    content: `Subject: {{subject}}

Dear {{recipient}},

I hope this email finds you well. I am reaching out regarding position for {{jobPosition}} at {{companyName}}. With over 3 years of experience in {{backendTechnologies}}  {{frontendTechnology}}, I believe I can contribute effectively to your team. 

Please find my attached resume for your reference. I’d be glad to connect for further discussion.

{{message}}

Best regards,
{{senderName}}
{{email}}
{{phone}}`,
    fields: [
      {
        key: "subject",
        label: "Email Subject",
        type: "text",
        required: true,
        placeholder: "Email Subject",
      },
      {
        key: "recipient",
        label: "Recipient Name",
        type: "text",
        required: true,
        placeholder: "Mr. Smith",
      },
      {
        key: "jobPosition",
        label: "Postion Applying",
        type: "text",
        required: true,
        placeholder: "Postion Applying",
      },
      {
        key: "companyName",
        label: "Company Name",
        type: "text",
        required: true,
        placeholder: "Company Name",
      },
      {
        key: "backendTechnologies",
        label: "Backend Technology",
        type: "dropdown",
        required: false,
        placeholder: "Backend Technology",
      },
      {
        key: "frontendTechnology",
        label: "Frontend Technology",
        type: "dropdown",
        required: false,
        placeholder: "Frontend Technology",
      },
      {
        key: "message",
        label: "Additional Info",
        type: "textarea",
        required: false,
        placeholder: "Your additional message content...",
      },
      // {
      //   key: "nextSteps",
      //   label: "Next Steps",
      //   type: "array",
      //   placeholder: "Schedule follow-up meeting, Review documents",
      // },
      {
        key: "senderName",
        label: "Your Name",
        type: "text",
        required: true,
        placeholder: "Jane Doe",
      },
      {
        key: "email",
        label: "Email",
        type: "text",
        placeholder: "jane.doe@company.com",
      },
      {
        key: "phone",
        label: "Phone",
        type: "text",
        placeholder: "+1 (555) 123-4567",
      },
    ],
  },
  {
    id: "cold-outreach",
    name: "Cold Outreach",
    content: `Subject: {{subject}}

Hi {{recipient}},

I came across {{companyName}} while researching {{industry}} companies and was genuinely impressed by {{companyHighlight}}.

I'm a {{jobPosition}} with {{yearsExperience}} years of experience specializing in {{keySkills}}. I'd love to explore whether there's a fit for my background on your team — even if there isn't an open role right now.

A few things I've done that might be relevant:
{{#achievements}}
• {{.}}
{{/achievements}}

Would you be open to a 15-minute call this week or next? I'm happy to work around your schedule.

Best,
{{senderName}}
{{email}}
{{linkedin}}`,
    fields: [
      { key: "subject", label: "Email Subject", type: "text", required: true, placeholder: "Experienced React Developer — Open to Opportunities at Stripe" },
      { key: "recipient", label: "Recipient Name", type: "text", required: true, placeholder: "Sarah" },
      { key: "companyName", label: "Company Name", type: "text", required: true, placeholder: "Stripe" },
      { key: "industry", label: "Industry", type: "text", placeholder: "fintech" },
      { key: "companyHighlight", label: "Company Highlight", type: "text", placeholder: "your work on developer-first payment infrastructure" },
      { key: "jobPosition", label: "Your Role / Title", type: "text", required: true, placeholder: "Frontend Engineer" },
      { key: "yearsExperience", label: "Years of Experience", type: "text", placeholder: "4+" },
      { key: "keySkills", label: "Key Skills", type: "text", placeholder: "React, TypeScript, and design systems" },
      { key: "achievements", label: "Achievements", type: "array", placeholder: "Reduced load time by 60% at previous company" },
      { key: "senderName", label: "Your Name", type: "text", required: true, placeholder: "Jane Doe" },
      { key: "email", label: "Email", type: "text", placeholder: "jane@email.com" },
      { key: "linkedin", label: "LinkedIn", type: "text", placeholder: "linkedin.com/in/janedoe" },
    ],
  },
  {
    id: "follow-up-interview",
    name: "Follow-Up After Interview",
    content: `Subject: {{subject}}

Dear {{recipient}},

Thank you for taking the time to speak with me {{interviewDate}} about the {{jobPosition}} role at {{companyName}}. It was a pleasure learning more about the team and the exciting work you're doing on {{projectOrProduct}}.

Our conversation about {{interviewHighlight}} particularly resonated with me, and I left even more enthusiastic about this opportunity.

I'm confident that my experience in {{relevantExperience}} would allow me to make an immediate impact. Please don't hesitate to reach out if you need any additional information.

I look forward to hearing about next steps.

Warm regards,
{{senderName}}
{{email}}
{{phone}}`,
    fields: [
      { key: "subject", label: "Email Subject", type: "text", required: true, placeholder: "Thank You — {{jobPosition}} Interview at {{companyName}}" },
      { key: "recipient", label: "Interviewer Name", type: "text", required: true, placeholder: "Mr. Johnson" },
      { key: "interviewDate", label: "Interview Date/Time", type: "text", placeholder: "yesterday" },
      { key: "jobPosition", label: "Job Position", type: "text", required: true, placeholder: "Senior Backend Engineer" },
      { key: "companyName", label: "Company Name", type: "text", required: true, placeholder: "Vercel" },
      { key: "projectOrProduct", label: "Project / Product Discussed", type: "text", placeholder: "the Edge Runtime infrastructure" },
      { key: "interviewHighlight", label: "Interview Highlight", type: "text", placeholder: "scaling microservices and team culture" },
      { key: "relevantExperience", label: "Relevant Experience", type: "text", placeholder: "distributed systems and Node.js" },
      { key: "senderName", label: "Your Name", type: "text", required: true, placeholder: "Jane Doe" },
      { key: "email", label: "Email", type: "text", placeholder: "jane@email.com" },
      { key: "phone", label: "Phone", type: "text", placeholder: "+1 (555) 123-4567" },
    ],
  },
  {
    id: "referral-email",
    name: "Referral / Referred By Someone",
    content: `Subject: {{subject}}

Hi {{recipient}},

{{referrerName}} suggested I reach out to you — they thought my background in {{keySkills}} would be a great fit for the {{jobPosition}} role at {{companyName}}.

I have {{yearsExperience}} years of experience working on {{relevantWork}}, and I've been following {{companyName}}'s work on {{companyHighlight}} closely.

I've attached my resume and would welcome the chance to connect. Would you have 20 minutes for a quick call this week?

Thank you for your time,
{{senderName}}
{{email}}
{{linkedin}}`,
    fields: [
      { key: "subject", label: "Email Subject", type: "text", required: true, placeholder: "Referred by {{referrerName}} — Interest in {{jobPosition}} at {{companyName}}" },
      { key: "recipient", label: "Recipient Name", type: "text", required: true, placeholder: "Ms. Chen" },
      { key: "referrerName", label: "Referrer's Name", type: "text", required: true, placeholder: "Alex Kumar" },
      { key: "keySkills", label: "Key Skills", type: "text", placeholder: "full-stack development and cloud architecture" },
      { key: "jobPosition", label: "Job Position", type: "text", required: true, placeholder: "Staff Engineer" },
      { key: "companyName", label: "Company Name", type: "text", required: true, placeholder: "Linear" },
      { key: "yearsExperience", label: "Years of Experience", type: "text", placeholder: "6+" },
      { key: "relevantWork", label: "Relevant Work", type: "text", placeholder: "SaaS products and developer tooling" },
      { key: "companyHighlight", label: "Company's Notable Work", type: "text", placeholder: "project management and issue tracking" },
      { key: "senderName", label: "Your Name", type: "text", required: true, placeholder: "Jane Doe" },
      { key: "email", label: "Email", type: "text", placeholder: "jane@email.com" },
      { key: "linkedin", label: "LinkedIn", type: "text", placeholder: "linkedin.com/in/janedoe" },
    ],
  },
  {
    id: "internship-application",
    name: "Internship Application",
    content: `Subject: {{subject}}

Dear {{recipient}},

I am a {{yearOfStudy}} student at {{university}} studying {{major}}, and I am very interested in the {{internshipRole}} internship at {{companyName}}.

I was drawn to this opportunity because {{reasonForInterest}}. Through my coursework and projects, I have developed skills in:
{{#skills}}
• {{.}}
{{/skills}}

{{projectHighlight}}

I am eager to contribute to your team while gaining real-world experience. I have attached my resume and would love the chance to discuss how I can add value to {{companyName}}.

Thank you for your consideration.

Sincerely,
{{senderName}}
{{university}} — {{major}}, {{yearOfStudy}}
{{email}}
{{portfolio}}`,
    fields: [
      { key: "subject", label: "Email Subject", type: "text", required: true, placeholder: "Summer 2026 Internship Application — {{internshipRole}}" },
      { key: "recipient", label: "Recipient Name", type: "text", required: true, placeholder: "Hiring Team" },
      { key: "yearOfStudy", label: "Year of Study", type: "text", required: true, placeholder: "3rd-year" },
      { key: "university", label: "University", type: "text", required: true, placeholder: "MIT" },
      { key: "major", label: "Major / Degree", type: "text", required: true, placeholder: "Computer Science" },
      { key: "internshipRole", label: "Internship Role", type: "text", required: true, placeholder: "Software Engineering Intern" },
      { key: "companyName", label: "Company Name", type: "text", required: true, placeholder: "Google" },
      { key: "reasonForInterest", label: "Reason for Interest", type: "textarea", placeholder: "your work on open-source developer tools aligns with my passion for building accessible software" },
      { key: "skills", label: "Skills", type: "array", placeholder: "Python, React, Data Structures" },
      { key: "projectHighlight", label: "Project Highlight", type: "textarea", placeholder: "In my last semester project, I built a real-time chat app using WebSockets that served 500+ concurrent users." },
      { key: "senderName", label: "Your Name", type: "text", required: true, placeholder: "Alex Smith" },
      { key: "email", label: "Email", type: "text", placeholder: "alex@university.edu" },
      { key: "portfolio", label: "Portfolio / GitHub", type: "text", placeholder: "github.com/alexsmith" },
    ],
  },
  {
    id: "career-change",
    name: "Career Change / Pivot",
    content: `Subject: {{subject}}

Dear {{recipient}},

I am writing to express my interest in the {{jobPosition}} role at {{companyName}}. While my background is in {{previousField}}, I have spent the past {{transitionPeriod}} actively building skills in {{newField}} and am now making a deliberate transition.

What I bring from my previous career that translates directly:
{{#transferableSkills}}
• {{.}}
{{/transferableSkills}}

What I have built during my transition:
{{#newSkills}}
• {{.}}
{{/newSkills}}

I believe my unique combination of {{previousField}} domain knowledge and hands-on {{newField}} experience makes me a distinctive candidate. I would love to discuss how my background could bring a fresh perspective to your team.

Best regards,
{{senderName}}
{{email}}
{{portfolio}}`,
    fields: [
      { key: "subject", label: "Email Subject", type: "text", required: true, placeholder: "Career Transition to {{newField}} — {{jobPosition}} Application" },
      { key: "recipient", label: "Recipient Name", type: "text", required: true, placeholder: "Hiring Manager" },
      { key: "jobPosition", label: "Target Job Position", type: "text", required: true, placeholder: "Junior Frontend Developer" },
      { key: "companyName", label: "Company Name", type: "text", required: true, placeholder: "Shopify" },
      { key: "previousField", label: "Previous Field", type: "text", required: true, placeholder: "finance and data analysis" },
      { key: "newField", label: "New Field", type: "text", required: true, placeholder: "software engineering" },
      { key: "transitionPeriod", label: "Transition Period", type: "text", placeholder: "12 months" },
      { key: "transferableSkills", label: "Transferable Skills", type: "array", placeholder: "Analytical thinking and problem solving" },
      { key: "newSkills", label: "New Skills Acquired", type: "array", placeholder: "Built 3 full-stack projects using React and Node.js" },
      { key: "senderName", label: "Your Name", type: "text", required: true, placeholder: "Jane Doe" },
      { key: "email", label: "Email", type: "text", placeholder: "jane@email.com" },
      { key: "portfolio", label: "Portfolio / GitHub", type: "text", placeholder: "github.com/janedoe" },
    ],
  },
  {
    id: "recruiter-response",
    name: "Recruiter Response",
    content: `Subject: Re: {{originalSubject}}

Hi {{recruiterName}},

Thanks for reaching out! The {{jobPosition}} role at {{companyName}} sounds very interesting.

I'm currently {{availability}} and would be open to learning more. Based on what you've shared, {{whatExcitesYou}}.

A few quick points about my background:
• {{experienceSummary}}
• Currently working with: {{currentStack}}
• Open to: {{openTo}}

I'd be happy to jump on a call to discuss further. {{preferredTime}} generally works well for me.

Looking forward to connecting,
{{senderName}}
{{email}}
{{linkedin}}`,
    fields: [
      { key: "originalSubject", label: "Original Email Subject", type: "text", placeholder: "Exciting Opportunity at {{companyName}}" },
      { key: "recruiterName", label: "Recruiter Name", type: "text", required: true, placeholder: "Emily" },
      { key: "jobPosition", label: "Job Position", type: "text", required: true, placeholder: "Senior Full Stack Engineer" },
      { key: "companyName", label: "Company Name", type: "text", required: true, placeholder: "Airbnb" },
      { key: "availability", label: "Availability", type: "text", placeholder: "actively exploring new opportunities" },
      { key: "whatExcitesYou", label: "What Excites You", type: "text", placeholder: "the scale and the engineering culture at your company caught my attention" },
      { key: "experienceSummary", label: "Experience Summary", type: "text", placeholder: "5 years building scalable web apps at Series B startups" },
      { key: "currentStack", label: "Current Tech Stack", type: "text", placeholder: "React, Node.js, PostgreSQL, AWS" },
      { key: "openTo", label: "Open To", type: "text", placeholder: "remote or hybrid roles in the EU/US timezone" },
      { key: "preferredTime", label: "Preferred Call Time", type: "text", placeholder: "Weekdays after 3pm GMT" },
      { key: "senderName", label: "Your Name", type: "text", required: true, placeholder: "Jane Doe" },
      { key: "email", label: "Email", type: "text", placeholder: "jane@email.com" },
      { key: "linkedin", label: "LinkedIn", type: "text", placeholder: "linkedin.com/in/janedoe" },
    ],
  },
  {
    id: "networking-email",
    name: "Networking / Informational",
    content: `Subject: {{subject}}

Hi {{recipient}},

I've been following your work at {{companyName}} — particularly {{specificWork}} — and found it really insightful.

I'm a {{currentRole}} with a background in {{background}}, and I'm {{goal}}. I'd love to hear your perspective on {{topic}}.

I know your time is valuable, so I'll keep it brief — would you be open to a 15-minute virtual coffee chat sometime in the next few weeks? No agenda beyond a genuine conversation.

Either way, thank you for the work you put out — it's been genuinely helpful.

Best,
{{senderName}}
{{linkedin}}
{{portfolio}}`,
    fields: [
      { key: "subject", label: "Email Subject", type: "text", required: true, placeholder: "Quick Chat Request — Inspired by Your Work at {{companyName}}" },
      { key: "recipient", label: "Recipient First Name", type: "text", required: true, placeholder: "Dan" },
      { key: "companyName", label: "Company / Where They Work", type: "text", required: true, placeholder: "Figma" },
      { key: "specificWork", label: "Their Specific Work / Content", type: "text", placeholder: "your talk on design systems at Config 2024" },
      { key: "currentRole", label: "Your Current Role", type: "text", placeholder: "frontend developer" },
      { key: "background", label: "Your Background", type: "text", placeholder: "React and component library development" },
      { key: "goal", label: "Your Goal", type: "text", placeholder: "exploring how design and engineering collaborate at scale" },
      { key: "topic", label: "Topic to Discuss", type: "text", placeholder: "how your team approaches component API design decisions" },
      { key: "senderName", label: "Your Name", type: "text", required: true, placeholder: "Jane Doe" },
      { key: "linkedin", label: "LinkedIn", type: "text", placeholder: "linkedin.com/in/janedoe" },
      { key: "portfolio", label: "Portfolio / GitHub", type: "text", placeholder: "janedoe.dev" },
    ],
  },
  //   {
  //     id: 'resume-summary',
  //     name: 'Resume Summary',
  //     content: `{{name}}
  // {{title}} | {{location}}
  // {{email}} | {{phone}} | {{linkedin}}

  // PROFESSIONAL SUMMARY
  // {{summary}}

  // CORE COMPETENCIES
  // {{#skills}}
  // • {{.}}
  // {{/skills}}

  // PROFESSIONAL EXPERIENCE
  // {{#experience}}
  // {{position}} at {{company}} ({{duration}})
  // {{description}}

  // {{/experience}}

  // EDUCATION
  // {{education}}

  // {{#certifications}}
  // CERTIFICATIONS
  // {{#.}}
  // • {{.}}
  // {{/.}}
  // {{/certifications}}`,
  //     fields: [
  //       { key: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'John Smith' },
  //       { key: 'title', label: 'Professional Title', type: 'text', required: true, placeholder: 'Senior Software Engineer' },
  //       { key: 'location', label: 'Location', type: 'text', placeholder: 'New York, NY' },
  //       { key: 'email', label: 'Email', type: 'text', required: true, placeholder: 'john.smith@email.com' },
  //       { key: 'phone', label: 'Phone', type: 'text', placeholder: '+1 (555) 123-4567' },
  //       { key: 'linkedin', label: 'LinkedIn', type: 'text', placeholder: 'linkedin.com/in/johnsmith' },
  //       { key: 'summary', label: 'Professional Summary', type: 'textarea', required: true, placeholder: 'Experienced software engineer with 8+ years...' },
  //       { key: 'skills', label: 'Skills', type: 'array', placeholder: 'JavaScript, Python, React, AWS' },
  //       { key: 'experience', label: 'Work Experience', type: 'textarea', placeholder: 'Senior Developer at Tech Corp (2020-Present)\nLed development of...' },
  //       { key: 'education', label: 'Education', type: 'text', placeholder: 'Bachelor of Science in Computer Science, University of Technology' },
  //       { key: 'certifications', label: 'Certifications', type: 'array', placeholder: 'AWS Certified Solutions Architect, Google Cloud Professional' }
  //     ]
  //   }
];
