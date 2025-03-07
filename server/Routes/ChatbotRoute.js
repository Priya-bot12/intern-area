const express = require('express');
const router = express.Router();

const internshipKeywords = [
    'internship', 'intern', 'training', 'placement', 'stipend', 'trainee', 'fresher',
    'job', 'career', 'employment', 'vacancy', 'hiring', 'recruitment', 'openings',
    'reference', 'onboarding', 'probation', 'evaluation', 'networking', 'dress code',
    'feedback', 'part-time', 'contract', 'freelance', 'mentorship', 'background check',
    'termination', 'exit', 'alumni', 'nda', 'ranking', 'csr', 'rejection'
];

router.post('/ask', (req, res) => {
    const { question, username } = req.body;

    // Check if question is internship or job-related
    const isInternshipQuestion = internshipKeywords.some(keyword => 
        question.toLowerCase().includes(keyword)
    );

    if (!isInternshipQuestion) {
        return res.json({
            response: "I will only answer questions related to internships and jobs.",
            sessionEnd: false
        });
    }

    // Get response for internship or job-related questions
    const response = handleInternshipAndJobQuestions(question);

    res.json({ response, sessionEnd: false });
});

function handleInternshipAndJobQuestions(question) {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('apply') || lowerQuestion.includes('how to apply')) {
        return "You can apply for internships and jobs through our career portal. Visit the 'Job or Internship' section on our website.";
    } 
    else if (lowerQuestion.includes('duration') || lowerQuestion.includes('how long')) {
        return "Internships typically last between 3-6 months, while full-time job durations vary based on contract terms.";
    }
    else if (lowerQuestion.includes('stipend') || lowerQuestion.includes('salary') || lowerQuestion.includes('paid')) {
        return "Internships may be paid or unpaid, depending on the program. Full-time jobs have competitive salaries based on experience.";
    }
    else if (lowerQuestion.includes('eligibility') || lowerQuestion.includes('who can apply')) {
        return "Eligibility varies by role. Generally, students, recent graduates, and experienced professionals can apply for respective positions.";
    }
    else if (lowerQuestion.includes('remote') || lowerQuestion.includes('work from home')) {
        return "We offer both remote and in-office opportunities. Check the job/internship description for details.";
    }
    else if (lowerQuestion.includes('certificate') || lowerQuestion.includes('completion')) {
        return "Yes, we provide a certificate upon successful completion of the internship.";
    }
    else if (lowerQuestion.includes('skills required') || lowerQuestion.includes('prerequisites')) {
        return "Skill requirements vary by role. Technical positions may need coding skills, while business roles require communication and problem-solving skills.";
    }
    else if (lowerQuestion.includes('selection process') || lowerQuestion.includes('hiring process')) {
        return "Our hiring process includes resume screening, an online assessment (if required), and an interview with the hiring team.";
    }
    else if (lowerQuestion.includes('job roles') || lowerQuestion.includes('available positions')) {
        return "We have various roles in tech, marketing, HR, and finance. Visit our career portal for open positions.";
    }
    else if (lowerQuestion.includes('full-time') || lowerQuestion.includes('permanent job')) {
        return "We offer both internships and full-time job opportunities. Check our career portal for the latest openings.";
    }
    else if (lowerQuestion.includes('interview tips') || lowerQuestion.includes('prepare for interview')) {
        return "Prepare by researching the company, practicing common interview questions, and reviewing the job description.";
    }
    else if (lowerQuestion.includes('resume tips') || lowerQuestion.includes('cv format')) {
        return "Keep your resume concise, highlight relevant experience, and tailor it to the job description.";
    }
    else if (lowerQuestion.includes('application deadline') || lowerQuestion.includes('last date to apply')) {
        return "Deadlines vary by role. Check the job description on our career portal for specific application deadlines.";
    }
    else if (lowerQuestion.includes('work culture') || lowerQuestion.includes('company environment')) {
        return "Our company promotes a collaborative, inclusive, and growth-oriented work culture.";
    }
    else if (lowerQuestion.includes('internship location') || lowerQuestion.includes('job location') || lowerQuestion.includes('where is the office')) {
        return "We have opportunities in multiple locations. Please check the job description for the exact location details.";
    }
    else if (lowerQuestion.includes('growth opportunities') || lowerQuestion.includes('career growth') || lowerQuestion.includes('promotion') || lowerQuestion.includes('long-term benefits')) {
        return "We encourage growth within the company through training, mentorship programs, and promotion opportunities.";
    }
    else if (lowerQuestion.includes('can i apply again') || lowerQuestion.includes('reapply') || lowerQuestion.includes('apply after rejection')) {
        return "Yes, you can reapply after a certain period. We recommend improving your skills before reapplying.";
    }
    else if (lowerQuestion.includes('documents required') || lowerQuestion.includes('what to submit') || lowerQuestion.includes('application requirements')) {
        return "You generally need to submit a resume, cover letter, and any required work samples or certifications.";
    }
    else if (lowerQuestion.includes('how many interns do you hire') || lowerQuestion.includes('internship batch size')) {
        return "The number of interns hired varies by department and requirements. Please check our career portal for openings.";
    }
    else if (lowerQuestion.includes('can international students apply') || lowerQuestion.includes('visa sponsorship') || lowerQuestion.includes('hiring international candidates')) {
        return "International students may apply for internships, but visa sponsorship depends on company policy. Please check the job description for details.";
    }else if (lowerQuestion.includes('onboarding process') || lowerQuestion.includes('orientation')) {
        return "Our onboarding includes company orientation, team introductions, and necessary training for your role.";
    }
    else if (lowerQuestion.includes('probation period') || lowerQuestion.includes('trial period')) {
        return "Probation periods typically last 1-3 months depending on the role and position level.";
    }
    else if (lowerQuestion.includes('performance evaluation') || lowerQuestion.includes('how are interns evaluated')) {
        return "Evaluations are based on work quality, learning agility, and team collaboration through regular reviews.";
    }
    else if (lowerQuestion.includes('networking opportunities') || lowerQuestion.includes('professional connections')) {
        return "We organize regular meetups, mentorship programs, and industry events for professional networking.";
    }
    else if (lowerQuestion.includes('dress code') || lowerQuestion.includes('office attire')) {
        return "We maintain business casual attire unless specified otherwise for specific roles/events.";
    }
    else if (lowerQuestion.includes('feedback process') || lowerQuestion.includes('performance review cycle')) {
        return "Formal feedback is provided monthly for interns and quarterly for full-time employees.";
    }
    else if (lowerQuestion.includes('part-time opportunities') || lowerQuestion.includes('flexible hours')) {
        return "Some roles offer part-time options. Check individual job postings for flexibility details.";
    }
    else if (lowerQuestion.includes('employment contract') || lowerQuestion.includes('offer letter details')) {
        return "Contracts specify role responsibilities, compensation, benefits, and terms of employment.";
    }
    else if (lowerQuestion.includes('freelance opportunities') || lowerQuestion.includes('contract work')) {
        return "We occasionally offer project-based contracts. Check our careers page for 'Contract Roles'.";
    }
    else if (lowerQuestion.includes('mentorship program') || lowerQuestion.includes('guidance system')) {
        return "All interns/juniors are paired with experienced mentors for professional development.";
    }
    else if (lowerQuestion.includes('training program') || lowerQuestion.includes('learning resources')) {
        return "We provide access to online courses, workshops, and on-the-job training programs.";
    }
    else if (lowerQuestion.includes('company projects') || lowerQuestion.includes('real-world experience')) {
        return "Interns work on live projects contributing to actual business operations and deliverables.";
    }
    else if (lowerQuestion.includes('diversity') || lowerQuestion.includes('inclusion')) {
        return "We're committed to diversity through inclusive hiring and employee resource groups.";
    }
    else if (lowerQuestion.includes('background check') || lowerQuestion.includes('verification process')) {
        return "All final candidates undergo education and employment verification checks.";
    }
    else if (lowerQuestion.includes('non-technical roles') || lowerQuestion.includes('non-tech positions')) {
        return "We have opportunities in HR, Marketing, Finance, and Operations alongside technical roles.";
    }
    else if (lowerQuestion.includes('age limit') || lowerQuestion.includes('age criteria')) {
        return "We welcome applicants of all ages who meet the role requirements and can legally work.";
    }
    else if (lowerQuestion.includes('academic requirements') || lowerQuestion.includes('cgpa cutoff')) {
        return "While we prefer candidates with strong academic records, we consider overall profile holistically.";
    }
    else if (lowerQuestion.includes('social media presence') || lowerQuestion.includes('linkedin profile')) {
        return "While not mandatory, a professional online presence can strengthen your application.";
    }
    else if (lowerQuestion.includes('employee benefits') || lowerQuestion.includes('perks')) {
        return "Benefits include health insurance, paid time off, retirement plans, and wellness programs.";
    }
    else if (lowerQuestion.includes('start date flexibility') || lowerQuestion.includes('joining date')) {
        return "Start dates are typically fixed, but we can consider adjustments for exceptional circumstances.";
    }
    else if (lowerQuestion.includes('leave policy') || lowerQuestion.includes('time off')) {
        return "We offer paid leaves, sick days, and holidays as per company policy and local regulations.";
    }
    else if (lowerQuestion.includes('termination policy') || lowerQuestion.includes('exit process')) {
        return "Separation processes follow contractual terms and include proper knowledge transfer.";
    }
    else if (lowerQuestion.includes('alumni network') || lowerQuestion.includes('former employees')) {
        return "We maintain an active alumni network for professional connections and opportunities.";
    }
    else if (lowerQuestion.includes('nda') || lowerQuestion.includes('non-disclosure')) {
        return "All employees sign standard NDAs to protect company and client confidential information.";
    }
    else if (lowerQuestion.includes('company ranking') || lowerQuestion.includes('industry position')){
        return "We're consistently ranked among top employers in our sector for culture and innovation.";
    }
    else if (lowerQuestion.includes('csr') || lowerQuestion.includes('social responsibility')) {
        return "We run multiple CSR initiatives focused on education, environment, and community development.";
    }
    else if (lowerQuestion.includes('handle rejection') || lowerQuestion.includes('application status')) {
        return "Unsuccessful candidates receive feedback and are encouraged to apply for future roles.";
    }else if(lowerQuestion.includes('reference letter') || lowerQuestion.includes('letter of recommendation')){
        return "Reference letters are provided upon successful completion of internships based on performance.";
    }
    else {
        return "For more details about internships and jobs, please visit our career portal or contact HR at priyachauhan1703@gmail.com.";
    }
}

module.exports = router;
