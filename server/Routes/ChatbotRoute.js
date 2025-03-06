const express = require('express');
const router = express.Router();

const internshipKeywords = [
    'internship', 'intern', 'training', 'placement', 'stipend', 'trainee', 'fresher', 
    'job', 'career', 'employment', 'vacancy', 'hiring', 'recruitment', 'openings'
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
    }
    else {
        return "For more details about internships and jobs, please visit our career portal or contact HR at priyachauhan1703@gmail.com.";
    }
}

module.exports = router;
