import os
import json

from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from google import genai

load_dotenv()


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing")


client = genai.Client(
    api_key=GEMINI_API_KEY
)


app = FastAPI(
    title="PrepHired",
    description="AI service for generating professional resume",
    version="1.0.0"
)


class ResumeRequest(BaseModel):

    basicInfo: dict = Field(default_factory=dict)

    targetJob: dict = Field(default_factory=dict)

    professionalSummary: str = ""

    workExperiences: list = Field(
        default_factory=list
    )

    educations: list = Field(
        default_factory=list
    )

    skills: str = ""

    projects: list = Field(
        default_factory=list
    )

    certificates: str = ""

    aiAnalysis: dict = Field(
        default_factory=dict
    )

# GENERATE PROFESSIONAL SUMMARY
@app.post("/generate-summary")
async def generate_summary(data: ResumeRequest):

    try:

        target_job = json.dumps(
            data.targetJob,
            indent=2,
            ensure_ascii=False
        )

        work_experiences = json.dumps(
            data.workExperiences,
            indent=2,
            ensure_ascii=False
        )

        educations = json.dumps(
            data.educations,
            indent=2,
            ensure_ascii=False
        )

        projects = json.dumps(
            data.projects,
            indent=2,
            ensure_ascii=False
        )

        certificates = json.dumps(
            data.certificates,
            indent=2,
            ensure_ascii=False
        )

        skills = data.skills.strip()


        prompt = f"""
        You are an expert professional resume writer.

        Your task is to write an ATS-friendly professional summary for the
        applicant based ONLY on the information provided below.

        Do not invent, assume, exaggerate, or fabricate any information.

        ========================================
        TARGET JOB
        ========================================

        {target_job}

        ========================================
        WORK EXPERIENCE
        ========================================

        {work_experiences}

        ========================================
        EDUCATION
        ========================================

        {educations}

        ========================================
        SKILLS
        ========================================

        {skills}

        ========================================
        PROJECTS
        ========================================

        {projects}

        ========================================
        CERTIFICATES
        ========================================

        {certificates}

        ========================================
        EDUCATION INTERPRETATION
        ========================================

        When interpreting education:

        - If the education end year is earlier than the current year,
          consider the applicant graduated unless the data explicitly
          states that the applicant is still studying.

        - If the education end year is the current year, consider the
          applicant graduated/completed unless the data explicitly states
          that the applicant is still studying.

        - If the education end year is later than the current year,
          consider the applicant currently studying.

        - If the education says "Present", consider the applicant
          currently studying.

        - Never invent a graduation date.

        - Never change the education dates provided by the applicant.

        ========================================
        SUMMARY REQUIREMENTS
        ========================================

        1. Write approximately 3-4 sentences.

        2. Tailor the summary specifically to the target job.

        3. Use relevant keywords from the target job description only when
           those keywords accurately match the applicant's actual
           information.

        4. Highlight relevant skills.

        5. Highlight relevant education when applicable.

        6. Highlight relevant work experience when applicable.

        7. Highlight relevant projects when applicable.

        8. Mention certifications when relevant and provided.

        9. If the applicant has little or no work experience, focus on:

        - education
        - relevant skills
        - projects
        - certifications

        10. If the applicant is a student, do not describe them as a
            graduate unless the education information indicates that they
            have graduated.

        11. If the applicant has graduated, you may describe them as a
            graduate when relevant to the target job.

        12. Use professional language.

        13. Make the summary ATS-friendly.

        14. Use natural keywords.

        15. Do not keyword-stuff.

        ========================================
        STRICT TRUTHFULNESS RULES
        ========================================

        Do NOT invent:

        - work experience
        - years of experience
        - skills
        - technologies
        - programming languages
        - tools
        - certifications
        - qualifications
        - achievements
        - awards
        - metrics
        - percentages
        - projects
        - clients
        - responsibilities
        - job titles
        - companies

        Do not claim proficiency in technologies that were not provided.

        Do not claim achievements that were not provided.

        Do not create fake numbers or statistics.

        Do not exaggerate the applicant's qualifications.

        If a field is empty, simply ignore it.

        ========================================
        WRITING STYLE
        ========================================

        - Use third person or professional resume language.
        - Do not use "I", "me", or "my".
        - Do not use "I am".
        - Do not use "I have".
        - Do not use "my experience".
        - Do not use "my skills".

        Avoid generic filler such as:

        "hardworking"
        "highly motivated"
        "passionate"
        "team player"

        unless clearly supported by the applicant's information.

        Use concise, professional, specific language.

        ========================================
        OUTPUT
        ========================================

        Return ONLY the professional summary.

        Do not return:

        - headings
        - labels
        - bullet points
        - explanations
        - analysis
        - quotation marks
        - JSON
        """


        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )


        if not response.text:
            raise HTTPException(
                status_code=500,
                detail="Gemini returned an empty response"
            )


        summary = response.text.strip()


        if (
            summary.startswith('"')
            and summary.endswith('"')
        ):
            summary = summary[1:-1].strip()


        return {
            "success": True,
            "summary": summary
        }


    except HTTPException:
        raise


    except Exception as error:

        print(
            "Gemini error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate professional summary"
        )

@app.post("/analyze-resume")
async def analyze_resume(data: ResumeRequest):

    try:

        def has_content(value):
            if value is None:
                return False

            if isinstance(value, str):
                return bool(value.strip())

            if isinstance(value, list):
                return any(has_content(item) for item in value)

            if isinstance(value, dict):
                return any(has_content(v) for v in value.values())

            return True

        has_target_job = has_content(data.targetJob)
        has_work_experience = has_content(data.workExperiences)
        has_education = has_content(data.educations)
        has_skills = has_content(data.skills)
        has_projects = has_content(data.projects)
        has_certificates = has_content(data.certificates)

        target_job = (
            json.dumps(
                data.targetJob,
                ensure_ascii=False
            )
            if has_target_job
            else ""
        )

        work_experiences = (
            json.dumps(
                data.workExperiences,
                ensure_ascii=False
            )
            if has_work_experience
            else ""
        )

        educations = (
            json.dumps(
                data.educations,
                ensure_ascii=False
            )
            if has_education
            else ""
        )

        projects = (
            json.dumps(
                data.projects,
                ensure_ascii=False
            )
            if has_projects
            else ""
        )

        certificates = (
            data.certificates.strip()
            if has_certificates
            else ""
        )

        skills = (
            data.skills.strip()
            if has_skills
            else ""
        )

        prompt = f"""
You are an expert ATS resume analyst.

Analyze the resume ONLY using information provided by the applicant.
Never invent skills, experience, certifications, achievements,
qualifications, numbers, or keywords.

Target Job:
{target_job or "Not provided"}

Work Experience:
{work_experiences or "Not provided"}

Education:
{educations or "Not provided"}

Skills:
{skills or "Not provided"}

Projects:
{projects or "Not provided"}

Certificates:
{certificates or "Not provided"}

Rules:

- Optional sections may be empty.
- Empty sections must NOT reduce the ATS score.
- Empty sections must NOT be called weaknesses.
- Empty sections must NOT appear in recommendations.
- Only analyze sections that contain information.
- Compare provided information against the target job.
- Missing keywords means relevant target-job keywords not supported
  by the applicant's provided information.
- Matching keywords means target-job keywords supported by the
  applicant's provided information.
- Recommendations must improve existing information and must not
  invent content.
- Return an empty analysis string for any empty section.

Calculate an ATS score from 0 to 100 based only on information
actually provided and its relevance to the target job.

Return ONLY valid JSON:

{{
    "atsScore": 0,
    "strengths": [],
    "missingKeywords": [],
    "matchingKeywords": [],
    "recommendations": [],
    "experienceAnalysis": "",
    "educationAnalysis": "",
    "skillsAnalysis": "",
    "projectAnalysis": "",
    "certificateAnalysis": ""
}}
"""

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        if not response.text:
            raise HTTPException(
                status_code=500,
                detail="Gemini returned an empty response"
            )

        result_text = response.text.strip()

        # Remove markdown code fences if Gemini adds them
        if result_text.startswith("```json"):
            result_text = result_text[7:]

        elif result_text.startswith("```"):
            result_text = result_text[3:]

        if result_text.endswith("```"):
            result_text = result_text[:-3]

        result_text = result_text.strip()

        try:
            analysis = json.loads(result_text)

        except json.JSONDecodeError:
            print("Invalid Gemini JSON:", result_text)

            raise HTTPException(
                status_code=500,
                detail="Gemini returned invalid analysis format"
            )

        # Make sure empty optional sections stay empty
        if not has_work_experience:
            analysis["experienceAnalysis"] = ""

        if not has_education:
            analysis["educationAnalysis"] = ""

        if not has_skills:
            analysis["skillsAnalysis"] = ""

        if not has_projects:
            analysis["projectAnalysis"] = ""

        if not has_certificates:
            analysis["certificateAnalysis"] = ""

        # Validate output
        if not isinstance(analysis.get("atsScore"), (int, float)):
            analysis["atsScore"] = 0

        if not isinstance(analysis.get("strengths"), list):
            analysis["strengths"] = []

        if not isinstance(analysis.get("missingKeywords"), list):
            analysis["missingKeywords"] = []

        if not isinstance(analysis.get("matchingKeywords"), list):
            analysis["matchingKeywords"] = []

        if not isinstance(analysis.get("recommendations"), list):
            analysis["recommendations"] = []

        analysis["atsScore"] = max(
            0,
            min(100, int(analysis["atsScore"]))
        )

        return {
            "success": True,
            "analysis": analysis
        }

    except HTTPException:
        raise

    except Exception as error:
        print("AI analysis error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze resume"
        )



# OPTIMIZE RESUME
@app.post("/optimize-resume")
async def optimize_resume(data: ResumeRequest):

    try:

        current_year = datetime.now().year


        basic_info = json.dumps(
            data.basicInfo,
            indent=2,
            ensure_ascii=False
        )


        target_job = json.dumps(
            data.targetJob,
            indent=2,
            ensure_ascii=False
        )


        work_experiences = json.dumps(
            data.workExperiences,
            indent=2,
            ensure_ascii=False
        )


        educations = json.dumps(
            data.educations,
            indent=2,
            ensure_ascii=False
        )


        projects = json.dumps(
            data.projects,
            indent=2,
            ensure_ascii=False
        )


        certificates = data.certificates.strip()


        skills = data.skills.strip()


        professional_summary = (
            data.professionalSummary.strip()
        )


        ai_analysis = json.dumps(
            data.aiAnalysis,
            indent=2,
            ensure_ascii=False
        )


        # ----------------------------------------------------
        # ORIGINAL ATS SCORE
        # ----------------------------------------------------

        original_ats_score = data.aiAnalysis.get(
            "atsScore",
            0
        )


        # ====================================================
        # OPTIMIZATION PROMPT
        # ====================================================

        prompt = f"""
        You are an expert ATS resume optimizer, professional resume writer,
        recruiter, and career-document specialist.

        Your task is to analyze and optimize the applicant's resume for the
        TARGET JOB.

        The optimized resume must remain completely truthful to the
        information provided by the applicant.

        ========================================
        CURRENT YEAR
        ========================================

        {current_year}

        ========================================
        ORIGINAL ATS SCORE
        ========================================

        {original_ats_score}

        This is the ATS score of the original resume before optimization.

        Use this score only as the baseline for comparing the final
        optimized resume.

        ========================================
        BASIC INFORMATION
        ========================================

        {basic_info}

        ========================================
        TARGET JOB
        ========================================

        {target_job}

        ========================================
        WORK EXPERIENCE
        ========================================

        {work_experiences}

        ========================================
        EDUCATION
        ========================================

        {educations}

        ========================================
        SKILLS
        ========================================

        {skills}

        ========================================
        PROJECTS
        ========================================

        {projects}

        ========================================
        CERTIFICATES
        ========================================

        {certificates}

        ========================================
        PROFESSIONAL SUMMARY
        ========================================

        {professional_summary}

        ========================================
        PREVIOUS AI ANALYSIS
        ========================================

        {ai_analysis}

        ========================================
        OPTIMIZATION OBJECTIVE
        ========================================

        The primary objective is to improve the applicant's overall resume
        quality and ATS compatibility compared with the original resume.

        The optimized resume should improve, when supported by the applicant's
        information:

        - ATS keyword alignment
        - relevance to the target job
        - professional summary quality
        - work experience descriptions
        - education presentation
        - skills organization
        - project descriptions
        - certificate presentation
        - readability
        - consistency
        - grammar
        - capitalization
        - formatting
        - completeness

        Do not make changes only for the purpose of changing the ATS score.

        Every improvement must be based on information already provided by
        the applicant.

        The optimized resume should NOT receive a lower ATS score than the
        original resume when the optimization successfully improves or
        maintains the resume's factual content and ATS relevance.

        If meaningful improvements are possible, apply them before calculating
        the optimized ATS score.

        If the resume is already well optimized and no meaningful improvement
        is possible without inventing information, preserve the content and
        keep the ATS score unchanged.

        NEVER artificially increase the ATS score.

        NEVER lower the ATS score simply because wording was changed.

        ========================================
        CORE RULE
        ========================================

        Use ONLY information provided by the applicant.

        Never invent, fabricate, assume, or exaggerate information.

        Do NOT invent:

        - work experience
        - job titles
        - companies
        - employment dates
        - responsibilities
        - skills
        - technologies
        - programming languages
        - frameworks
        - tools
        - certifications
        - degrees
        - schools
        - projects
        - clients
        - achievements
        - awards
        - metrics
        - percentages
        - qualifications
        - professional experience
        - leadership experience
        - management experience
        - locations
        - addresses
        - names

        Never turn an assumption into a factual claim.

        ========================================
        BASIC INFO ADDRESS
        ========================================

        Optimize ONLY the address provided inside BASIC INFORMATION.

        The address provided by the applicant is:

        {data.basicInfo.get("address", "")}

        IMPORTANT:

        If the address above is NOT empty:

        - You MUST return the exact provided address in:
        address.original

        - You MUST provide an optimized version in:
        address.optimized

        - You MUST NOT return empty strings for original or optimized when
        the applicant provided an address.

        - Do NOT use the applicant's work location.
        - Do NOT use the applicant's education location.
        - Do NOT use the applicant's current location.
        - Do NOT use outside geographic information to invent an address.

        ========================================
        ADDRESS OPTIMIZATION RULES
        ========================================

        The preferred resume format is:

        City, Country

        For Philippine locations, use:

        City, Philippines

        Examples:

        "Dagupan City"
        →
        "Dagupan City, Philippines"

        "Dagupan"
        →
        "Dagupan City, Philippines"

        "Brgy. Pantal, Dagupan City, Pangasinan"
        →
        "Dagupan City, Philippines"

        "Makati"
        →
        "Makati, Philippines"

        "Makati City, Metro Manila"
        →
        "Makati City, Philippines"

        "Quezon City"
        →
        "Quezon City, Philippines"

        "Calasiao, Pangasinan"
        →
        "Calasiao, Philippines"

        "123 Main Street, New York, USA"
        →
        "New York, USA"

        ========================================
        ADDRESS RULES
        ========================================

        - Preserve the original address exactly in address.original.
        - Optimize the address only in address.optimized.
        - If a Philippine city is clearly provided, include ", Philippines".
        - Preserve "City" when it is part of the provided city name.
        - Remove unnecessary street details when the city is clearly known.
        - Remove barangay details when the city is clearly known.
        - Remove province details when the city and country are sufficient.
        - Do not invent a city.
        - Do not infer a city from the company.
        - Do not infer a city from the school.
        - Do not infer a city from the work location.
        - Do not infer a city from the education location.
        - Do not use the applicant's current location.
        - If the address cannot be reliably normalized, preserve the provided
        address instead of guessing.
        - If the address is already in "City, Country" format, keep it.
        - If the provided address is empty, return empty strings for:
        address.original
        address.optimized

        IMPORTANT EXAMPLE:

        If the applicant provides:

        "Dagupan City"

        you MUST return:

        "address": 
            "original": "Dagupan City",
            "optimized": "Dagupan City, Philippines",
            "reason": "Added the country and standardized the address for a professional resume format."
        
        ========================================
        NAME AND PROPER NAME FORMATTING
        ========================================

        Normalize capitalization and formatting of names and proper names
        throughout the resume.

        PERSON NAME:

        Convert names into professional capitalization.

        Examples:

        "juan dela cruz"
        → "Juan Dela Cruz"

        "JUAN DELA CRUZ"
        → "Juan Dela Cruz"

        "maria clara santos"
        → "Maria Clara Santos"

        Rules:

        - Do not change spelling.
        - Do not change the order of the name.
        - Do not add a middle name.
        - Do not remove a middle name.
        - Do not add or remove suffixes.
        - Do not add titles.
        - Do not invent information.
        - Only improve capitalization and formatting.

        SCHOOL NAME:

        Normalize school names professionally.

        Examples:

        "university of the philippines"
        → "University of the Philippines"

        "PHILIPPINE TECHNOLOGICAL UNIVERSITY"
        → "Philippine Technological University"

        "pangasinan state university"
        → "Pangasinan State University"

        Rules:

        - Preserve the provided school name.
        - Do not invent the official school name.
        - Do not add campus names.
        - Do not remove meaningful information.
        - Only improve capitalization and formatting.

        COMPANY NAME:

        Normalize company names professionally.

        Examples:

        "abc technologies inc."
        → "ABC Technologies Inc."

        "XYZ SOLUTIONS"
        → "XYZ Solutions"

        "sample company"
        → "Sample Company"

        Rules:

        - Preserve the provided company name.
        - Preserve acronyms when appropriate.
        - Do not invent company information.
        - Do not change the company identity.

        DEGREE AND FIELD:

        Normalize degree and field names professionally.

        Examples:

        "bachelor of science in information technology"
        → "Bachelor of Science in Information Technology"

        "BS INFORMATION TECHNOLOGY"
        → "BS Information Technology"

        "computer science"
        → "Computer Science"

        "information technology"
        → "Information Technology"

        Preserve standard abbreviations such as:

        - BSIT
        - BSCS
        - MBA
        - PhD
        - IT
        - AI
        - CS

        Do not change the actual degree.

        PROJECT NAME:

        Normalize project names professionally.

        Examples:

        "online resume builder"
        → "Online Resume Builder"

        "student attendance system"
        → "Student Attendance System"

        "mobile ojt tracker"
        → "Mobile OJT Tracker"

        Do not change the meaning.

        Do not invent project information.

        CERTIFICATE NAME:

        Normalize certificate names professionally.

        Examples:

        "google cybersecurity certificate"
        → "Google Cybersecurity Certificate"

        "microsoft azure fundamentals"
        → "Microsoft Azure Fundamentals"

        Do not invent:

        - certificate issuer
        - certificate date
        - credential ID
        - training program
        - certification level

        IMPORTANT:

        - Only change capitalization and formatting when appropriate.
        - Never change spelling.
        - Never invent information.
        - Preserve technical names and acronyms.
        - Preserve names such as:

          React Native
          Node.js
          MongoDB
          JavaScript
          Python
          FastAPI
          Express.js
          SQL
          HTML
          CSS
          API
          AI
          AWS
          IBM
          UP

        - Do not blindly apply title case to technical terms or acronyms.

        ========================================
        ATS KEYWORD OPTIMIZATION
        ========================================

        Analyze the target job description.

        Identify relevant:

        - technical skills
        - soft skills
        - technologies
        - programming languages
        - frameworks
        - tools
        - platforms
        - methodologies
        - certifications
        - qualifications
        - industry terminology
        - job-specific terminology

        Separate keywords into:

        1. MATCHING KEYWORDS

        Keywords from the target job that are already supported by the
        applicant's resume.

        2. MISSING KEYWORDS

        Important target-job keywords that are not supported by the
        applicant's information.

        3. RELEVANT KEYWORDS

        Keywords that naturally improve ATS relevance when they are supported
        by the applicant's actual information.

        Do NOT add unsupported keywords simply because they appear in the
        job description.

        Do NOT keyword-stuff.

        ========================================
        PROFESSIONAL SUMMARY
        ========================================

        Optimize the existing professional summary.

        - Improve clarity.
        - Improve ATS relevance.
        - Tailor it to the target job.
        - Use relevant supported keywords.
        - Keep it concise.
        - Preserve factual information.
        - Do not invent qualifications.
        - Do not invent years of experience.

        If the existing summary is empty, create one based only on the
        applicant's actual information.

        If the applicant has little or no work experience, emphasize:

        - education
        - skills
        - projects
        - certifications

        ========================================
        ADDRESS FORMAT
        ========================================

        When presenting the applicant's address in the optimized resume,
        normalize the address into a concise professional city-and-country
        format.

        Use this format:

        City, Philippines

        Example:

        Makati, Philippines

        Rules:

        - Identify the city from the applicant's provided address.
        - If a city is clearly provided, output:
          "City, Philippines"
        - If the provided address contains a barangay, subdivision, street,
          district, municipality, or other smaller locality but the city is
          clearly identifiable, remove those details and keep only the city
          and country.
        - If the applicant provides "Makati City", normalize it to:
          "Makati, Philippines"
        - If the applicant provides "Quezon City", keep:
          "Quezon City, Philippines"
        - If the applicant provides "Dagupan City", normalize it to:
          "Dagupan, Philippines"
        - If the applicant provides "Cebu City", keep:
          "Cebu City, Philippines"
        - Do not blindly append "Philippines" if the address is outside the
          Philippines.
        - If the address clearly identifies another country, use:
          "City, Country"
        - If the city cannot be reliably determined from the provided
          address, preserve the available location information rather than
          guessing.
        - Never invent a city.
        - Never infer a city solely from a nearby city or geographic
          assumption.
        - Never use the applicant's current location.
        - Do not change the original address stored in the database.
        - This formatting rule applies only to the optimized/generated
          resume output.
        - Do not include street address, house number, subdivision, barangay,
          or other unnecessary local details unless required by the resume
          format.

        Examples:

        "123 Example Street, Poblacion, Makati City"
        → "Makati, Philippines"

        "Brgy. San Miguel, Dagupan City"
        → "Dagupan, Philippines"

        "Quezon City, Metro Manila"
        → "Quezon City, Philippines"

        "Makati City, Philippines"
        → "Makati, Philippines"

        "Calasiao, Pangasinan, Philippines"
        → "Calasiao, Philippines"

        "123 Main Street, New York, USA"
        → "New York, USA"

        ========================================
        WORK EXPERIENCE LOCATION
        ========================================

        Optimize the location of every existing work experience.

        Preferred format:

        City, Country

        Examples:

        "Brgy. Pantal, Dagupan City, Pangasinan"
        → "Dagupan, Philippines"

        "Calasiao, Pangasinan"
        → "Calasiao, Philippines"

        "Makati City, Metro Manila"
        → "Makati, Philippines"

        Rules:

        - Use ONLY the provided work experience location.
        - Never guess the city.
        - Never infer the location from the company name.
        - Never infer the location from outside information.
        - Never use the applicant's current location.
        - Remove unnecessary street details when the city is clearly known.
        - Remove barangay when the city is clearly known.
        - Remove province when city and country are sufficient.
        - Preserve the original location.
        - Return the optimized location separately.
        - If the location cannot be reliably normalized, preserve the
          original location.
        - If the location is empty, return an empty optimized location.

        ========================================
        EDUCATION LOCATION
        ========================================

        Optimize the location of every existing education entry.

        Preferred format:

        City, Country

        Examples:

        "Dagupan City, Pangasinan"
        → "Dagupan, Philippines"

        "Calasiao, Pangasinan"
        → "Calasiao, Philippines"

        Rules:

        - Use ONLY the provided education location.
        - Never guess the city.
        - Never infer location from the school name.
        - Never use outside geographic information.
        - Never use the applicant's current location.
        - Remove unnecessary address details when the city is known.
        - Preserve the original location.
        - Return the optimized location separately.
        - If the location cannot be reliably normalized, preserve the
          original location.
        - If the location is empty, return an empty optimized location.

        ========================================
        WORK EXPERIENCE
        ========================================

        For every valid existing work experience:

        - Preserve the original ID exactly.
        - Preserve job title.
        - Preserve company.
        - Optimize company capitalization when necessary.
        - Preserve original location.
        - Return optimized location separately.
        - Preserve period of employment.
        - Optimize the description.

        Do not create new work experiences.

        Do not duplicate work experiences.

        ----------------------------------------
        NO WORK EXPERIENCE
        ----------------------------------------

        If workExperiences is an empty array:

        - Do not create a Work Experience section.
        - Do not create fake employment.
        - Do not create placeholder content.

        ----------------------------------------
        EMPTY ENTRY
        ----------------------------------------

        If an entry has no meaningful information, ignore it completely.

        Do not output:

        - "Untitled Job Title"
        - "No description"
        - "No description provided"
        - "Unknown Company"
        - "Unknown Position"
        - "No experience provided"

        ----------------------------------------
        DESCRIPTION PROVIDED
        ----------------------------------------

        If a description is provided:

        - Rewrite it as professional bullet points.
        - Every bullet must start with "•".
        - Each bullet must be on a separate line.
        - Improve grammar.
        - Improve clarity.
        - Improve ATS relevance.
        - Use strong action verbs when accurate.
        - Preserve the original meaning.

        Generate approximately 2-5 bullet points when enough information
        is available.

        Do not invent:

        - achievements
        - metrics
        - technologies
        - tools
        - clients
        - projects
        - results
        - responsibilities

        ----------------------------------------
        ACTION VERB → RESPONSIBILITY → RESULT
        ----------------------------------------

        When optimizing work experience descriptions, use the structure:

        ACTION VERB → RESPONSIBILITY → RESULT

        when the provided information supports all three parts.

        Example:

        Original:

        "Developed a mobile resume application using React Native."

        Optimized:

        "• Developed a mobile resume application using React Native."

        If a supported result is provided:

        "• Developed a mobile resume application using React Native,
        improving the resume creation workflow."

        Only include a RESULT when the result is explicitly supported by
        the applicant's information.

        If no result is provided, use:

        ACTION VERB → RESPONSIBILITY

        Do NOT invent:

        - percentages
        - metrics
        - number of users
        - revenue
        - time saved
        - performance improvements
        - accuracy
        - achievements
        - business impact

        ----------------------------------------
        DESCRIPTION EMPTY BUT JOB TITLE EXISTS
        ----------------------------------------

        If the job title is provided but the description is empty:

        You may generate 2-4 professional generic bullet points based on
        typical responsibilities associated with that job title.

        Every bullet must:

        - start with "•"
        - be on a separate line
        - be concise
        - be realistic
        - be aligned with the job title

        These must be general responsibilities, NOT fabricated achievements.

        Do NOT invent:

        - metrics
        - percentages
        - technologies
        - projects
        - clients
        - achievements
        - results

        Example:

        Job Title:

        Software Developer

        Description:

        empty

        Acceptable:

        • Developed and maintained software applications.
        • Assisted with implementing application features.
        • Troubleshot software issues and supported application maintenance.

        Not acceptable:

        • Increased application performance by 40%.
        • Developed 15 React applications.
        • Led a team of 10 developers.

        unless those facts were provided by the applicant.

        ----------------------------------------
        ONLY COMPANY EXISTS
        ----------------------------------------

        If only the company is provided:

        - Preserve the company.
        - Do not invent a job title.
        - Do not invent responsibilities.
        - Do not invent achievements.

        ----------------------------------------
        ONLY JOB TITLE EXISTS
        ----------------------------------------

        If only the job title is provided:

        - Preserve the job title.
        - Generic responsibilities may be generated.
        - Do not invent a company.
        - Do not invent dates.
        - Do not invent achievements.

        ========================================
        EDUCATION
        ========================================

        Preserve:

        - original ID
        - school
        - degree/field
        - location
        - school year
        - description

        Normalize the capitalization of:

        - school
        - degree
        - field

        Do not change the actual information.

        Do not invent:

        - graduation dates
        - GPA
        - honors
        - awards
        - coursework
        - academic achievements

        ========================================
        EDUCATION YEAR
        ========================================

        Current year: {current_year}

        If the end year is earlier than the current year:

        Consider the program completed unless explicitly stated otherwise.

        If the end year is the current year:

        Consider it completed unless explicitly stated that the applicant
        is still studying.

        If the end year is later than the current year:

        Consider the applicant currently studying.

        If the education says "Present":

        Consider the applicant currently studying.

        Never invent missing dates.

        ========================================
        SKILLS
        ========================================

        Optimize the skills section for ATS readability.

        - Preserve applicant-provided skills.
        - Do not invent skills.
        - Remove duplicates.
        - Standardize names when the meaning is clear.
        - Prioritize skills relevant to the target job.
        - Do not claim proficiency levels unless provided.

        Example:

        React JS → React.js
        Node → Node.js
        Mongo → MongoDB

        Preserve proper capitalization for technical skills.

        Examples:

        react native → React Native
        javascript → JavaScript
        python → Python
        mongodb → MongoDB
        fastapi → FastAPI
        node js → Node.js

        Do not turn a skill into an unsupported claim such as:

        "Expert React.js Developer"

        unless the applicant explicitly provided that information.

        ========================================
        PROJECTS
        ========================================

        For every existing project:

        - Preserve the original ID.
        - Preserve project name.
        - Normalize project name capitalization.
        - Optimize the project description.
        - Improve grammar and clarity.
        - Improve ATS relevance.
        - Preserve the original meaning.
        - Use bullet points when appropriate.

        Do not invent:

        - technologies
        - clients
        - users
        - metrics
        - achievements
        - results

        Do not create new projects.

        If there are no projects, do not create a Projects section.

        ========================================
        CERTIFICATES
        ========================================

        Preserve certifications provided by the applicant.

        Normalize certificate names professionally.

        Do not invent:

        - certifications
        - providers
        - dates
        - credential IDs
        - expiration dates

        If there are no certifications, do not create fake certifications.

        ========================================
        ATS FORMATTING
        ========================================

        The resume content must be ATS-friendly.

        Prefer:

        - standard section names
        - clear text
        - concise bullet points
        - consistent terminology
        - standard dates
        - simple formatting
        - professional capitalization

        Avoid:

        - emojis
        - decorative symbols
        - unnecessary special characters
        - tables
        - columns
        - graphics
        - icons
        - text boxes
        - keyword stuffing
        - unusual section names

        Use standard section names such as:

        - Professional Summary
        - Work Experience
        - Education
        - Skills
        - Projects
        - Certifications

        ========================================
        ORIGINAL VS OPTIMIZED ATS SCORE
        ========================================

        The PREVIOUS AI ANALYSIS contains the ATS score of the original
        resume.

        Original ATS Score:

        {original_ats_score}

        Use this score as the baseline.

        Compare the original resume with the optimized resume after all
        optimization changes have been completed.

        The optimized score should increase when the optimization produces
        genuine improvements in:

        - target-job keyword alignment
        - relevant skills visibility
        - professional summary relevance
        - work experience clarity
        - project relevance
        - education relevance
        - certification relevance
        - grammar and readability
        - ATS-friendly formatting
        - completeness

        If genuine improvements were made, the optimized score should
        reflect those improvements.

        If no meaningful improvement can be made without inventing
        information, keep the score unchanged.

        Do not reduce the score simply because the applicant has limited
        experience if the optimized resume presents the existing
        information more effectively.

        Do not increase the score merely because keywords were added.

        The score must be based on the FINAL OPTIMIZED RESUME.

        ========================================
        ATS SCORE
        ========================================

        Generate an ATS score from 0 to 100 for the FINAL OPTIMIZED RESUME.

        The score must represent the quality of the optimized resume after
        all changes have been applied.

        Evaluate:

        - keyword relevance
        - keyword matching
        - target-job alignment
        - skills relevance
        - work experience relevance
        - education relevance
        - project relevance
        - certification relevance
        - professional summary relevance
        - clarity
        - grammar
        - consistency
        - completeness
        - ATS readability
        - proper formatting
        - natural keyword usage

        Compare the optimized resume against the original resume.

        Genuine improvements should result in a higher optimized ATS score
        when the applicant's information supports those improvements.

        If the original ATS score is 50 and the optimization meaningfully
        improves the resume, the optimized score should be greater than 50.

        If the original ATS score is 50 and no meaningful improvement is
        possible without inventing information, the optimized score may
        remain 50.

        Do NOT decrease the score simply because the resume was rewritten.

        Do NOT artificially increase the score.

        Do NOT give points simply for adding keywords.

        Do NOT give points for unsupported skills, experience, achievements,
        technologies, certifications, or qualifications.

        The final score must be justified by the actual optimized resume.

        ========================================
        STRENGTHS
        ========================================

        Identify the strongest parts of the resume.

        Examples:

        - Strong technical skills match
        - Relevant project experience
        - Relevant education
        - Strong keyword alignment
        - Clear professional summary

        Only mention strengths supported by the resume.

        ========================================
        MISSING KEYWORDS
        ========================================

        Identify important target-job keywords that are not supported by
        the applicant's resume.

        Do not tell the AI to fabricate these keywords into the resume.

        These should only be reported as missing keywords.

        ========================================
        RECOMMENDATIONS
        ========================================

        Provide practical recommendations for improving the resume.

        Examples:

        - Add experience with a required technology if the applicant
          actually has that experience.
        - Add measurable achievements if available.
        - Add relevant certifications if actually obtained.
        - Expand project details with technologies actually used.
        - Add relevant skills that the applicant genuinely possesses.

        Never recommend fabricating information.

        ========================================
        CHANGES
        ========================================

        List meaningful changes made during optimization.

        Examples:

        - Improved the professional summary.
        - Converted work experience descriptions into ATS-friendly bullets.
        - Standardized skill names.
        - Improved project descriptions.
        - Improved keyword alignment.
        - Removed redundant wording.
        - Standardized the applicant's name capitalization.
        - Standardized school name capitalization.
        - Standardized company name capitalization.
        - Standardized degree formatting.
        - Standardized certificate formatting.
        - Standardized the address format.
        - Standardized work experience locations.
        - Standardized education locations.

        Only report changes that were actually made.

        ========================================
        FINAL VALIDATION
        ========================================

        Before returning the result, verify:

        1. No fake work experience was created.
        2. No fake skills were created.
        3. No fake certifications were created.
        4. No fake education was created.
        5. No fake projects were created.
        6. No fake achievements were created.
        7. No fake metrics were created.
        8. No unsupported technologies were added.
        9. Existing IDs were preserved.
        10. Existing job titles were preserved.
        11. Existing companies were preserved.
        12. Existing education information was preserved.
        13. Existing project names were preserved.
        14. Empty work experiences were ignored.
        15. No-work-experience resumes do not contain a Work Experience section.
        16. Work experience descriptions use bullet points.
        17. Keywords are used naturally.
        18. The optimized resume remains truthful.
        19. The ATS score reflects actual qualifications.
        20. No unsupported claims were introduced.
        21. Address is professionally formatted when sufficient location
            information is available.
        22. Applicant name capitalization is professional.
        23. School name capitalization is professional.
        24. Company name capitalization is professional.
        25. Degree and field capitalization is professional.
        26. Project name capitalization is professional.
        27. Certificate name capitalization is professional.
        28. Technical terms and acronyms remain correctly formatted.
        29. Work experience locations are professionally formatted.
        30. Education locations are professionally formatted.
        31. No location was guessed or invented.
        32. No current-location information was used.
        33. Original values remain unchanged.
        34. The optimized resume is equal to or better than the original
            resume in ATS relevance when meaningful optimization is possible.
        35. The optimized ATS score is not lower than the original ATS score
            unless there is a clear factual reason supported by the data.

        ========================================
        OUTPUT
        ========================================

        Return ONLY valid JSON.

        Do not wrap the JSON in markdown code blocks.

        Do not include explanations outside the JSON.

        The JSON must follow this exact structure:

        {{
            "address": {{
                "original": "",
                "optimized": "",
                "reason": ""
            }},
            
            "professionalSummary": {{
                "original": "",
                "optimized": "",
                "reason": ""
            }},

            "workExperiences": [
                {{
                    "id": "",
                    "jobTitle": "",
                    "company": "",
                    "location": "",
                    "original": "",
                    "optimized": "",
                    "reason": ""
                }}
            ],

            "educations": [
                {{
                    "id": "",
                    "school": "",
                    "degreeField": "",
                    "location": "",
                    "original": "",
                    "optimized": "",
                    "reason": ""
                }}
            ],

            "skills": {{
                "original": "",
                "optimized": "",
                "reason": ""
            }},

            "projects": [
                {{
                    "id": "",
                    "projectName": "",
                    "original": "",
                    "optimized": "",
                    "reason": ""
                }}
            ],

            "certificates": {{
                "original": "",
                "optimized": "",
                "reason": ""
            }},

            "changes": [],

            "optimizedAnalysis": {{
                "atsScore": 0,
                "strengths": [],
                "missingKeywords": [],
                "matchingKeywords": [],
                "recommendations": [],
                "experienceAnalysis": "",
                "educationAnalysis": "",
                "skillsAnalysis": "",
                "projectAnalysis": "",
                "certificateAnalysis": ""
            }}
        }}
        """

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )


        if not response.text:

            raise HTTPException(
                status_code=500,
                detail="Gemini returned an empty response"
            )


        result_text = response.text.strip()


        if result_text.startswith("```json"):

            result_text = result_text[7:]


        if result_text.startswith("```"):

            result_text = result_text[3:]


        if result_text.endswith("```"):

            result_text = result_text[:-3]


        result_text = result_text.strip()


        try:

            optimization = json.loads(
                result_text
            )

        except json.JSONDecodeError:

            print(
                "Invalid Gemini JSON:",
                result_text
            )

            raise HTTPException(
                status_code=500,
                detail="Gemini returned invalid optimization format"
            )
      

        return {
            "success": True,
            "optimization": optimization
        }


    except HTTPException:
        raise


    except Exception as error:

        print(
            "AI optimization error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to optimize resume"
        )

# ============================================================
# MOCK INTERVIEW AI
# ============================================================

class GenerateInterviewQuestionsRequest(BaseModel):
    targetJob: str
    interviewCategory: str = "All"
    numberOfQuestions: int = 5


class AnalyzeInterviewAnswerRequest(BaseModel):
    targetJob: str
    interviewCategory: str = "All"
    question: str
    answer: str
    responseMode: str = "Text"


class AnalyzeInterviewSessionRequest(BaseModel):
    targetJob: str
    interviewCategory: str = "All"
    questions: list



@app.post("/generate-interview-questions")
async def generate_interview_questions(
    request: GenerateInterviewQuestionsRequest
):
    try:
        # -----------------------------
        # VALIDATION
        # -----------------------------

        if not request.targetJob.strip():
            raise HTTPException(
                status_code=400,
                detail="Target job is required."
            )

        if request.interviewCategory not in [
            "Behavioral",
            "Technical",
            "HR Screening",
            "All"
        ]:
            raise HTTPException(
                status_code=400,
                detail="Invalid interview category."
            )

        if request.numberOfQuestions not in [5, 8, 12]:
            raise HTTPException(
                status_code=400,
                detail="Number of questions must be 5, 8, or 12."
            )

        # -----------------------------
        # CATEGORY INSTRUCTIONS
        # -----------------------------

        if request.interviewCategory == "Behavioral":
            category_instruction = """
Generate behavioral interview questions.

Focus on:
- Past experiences
- Problem solving
- Teamwork
- Communication
- Conflict handling
- Adaptability
- Leadership when relevant
- Workplace situations

Use questions that allow the applicant to explain their experience.
"""

        elif request.interviewCategory == "Technical":
            category_instruction = """
Generate technical interview questions relevant to the target job.

Focus on:
- Job-related technical knowledge
- Tools and technologies commonly relevant to the role
- Technical problem solving
- Practical situations
- Job-specific concepts

Do not require a technology or skill unless it is reasonably relevant
to the target job.
"""

        elif request.interviewCategory == "HR Screening":
            category_instruction = """
Generate HR screening questions.

Focus on:
- Introduction
- Motivation
- Career goals
- Work preferences
- Availability
- Strengths
- Areas for improvement
- Workplace expectations
"""

        else:
            category_instruction = """
Generate a balanced interview.

Include a mixture of:
- Behavioral questions
- Technical questions relevant to the target job
- HR screening questions

Keep the questions appropriate for the target job.
"""

        # -----------------------------
        # GEMINI PROMPT
        # -----------------------------

        prompt = f"""
You are an AI mock interview question generator.

Target Job:
{request.targetJob}

Interview Category:
{request.interviewCategory}

Number of Questions:
{request.numberOfQuestions}

{category_instruction}

IMPORTANT RULES:

1. Generate exactly {request.numberOfQuestions} questions.
2. Questions must be relevant to the target job.
3. Do not invent information about the applicant.
4. Do not assume the applicant has specific work experience.
5. Do not assume the applicant has specific certifications,
   education, technologies, or skills.
6. Questions should be answerable by students, graduates,
   career changers, and experienced applicants when appropriate.
7. Keep questions professional and realistic.
8. Avoid duplicate or nearly identical questions.
9. Do not ask multiple questions in one question.
10. Do not include answers.
11. Do not include explanations.
12. Do not make hiring decisions.
13. Keep the interview neutral across different professions.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "questions": [
        {{
            "questionNumber": 1,
            "question": "Question here"
        }}
    ]
}}
"""

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        response_text = response.text.strip()

        # -----------------------------
        # CLEAN JSON
        # -----------------------------

        if response_text.startswith("```"):
            response_text = response_text.replace("```json", "")
            response_text = response_text.replace("```", "")
            response_text = response_text.strip()

        result = json.loads(response_text)

        questions = result.get("questions", [])

        if len(questions) != request.numberOfQuestions:
            raise ValueError(
                f"Expected {request.numberOfQuestions} questions, "
                f"but received {len(questions)}."
            )

        return {
            "success": True,
            "questions": questions
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned an invalid question format."
        )

    except HTTPException:
        raise

    except Exception as e:
        print("Generate interview questions error:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to generate interview questions."
        )



@app.post("/analyze-interview-answer")
async def analyze_interview_answer(
    request: AnalyzeInterviewAnswerRequest
):
    try:
        # -----------------------------
        # VALIDATION
        # -----------------------------

        if not request.targetJob.strip():
            raise HTTPException(
                status_code=400,
                detail="Target job is required."
            )

        if not request.question.strip():
            raise HTTPException(
                status_code=400,
                detail="Question is required."
            )

        if not request.answer.strip():
            raise HTTPException(
                status_code=400,
                detail="Answer is required."
            )

        if request.responseMode not in ["Text", "Audio"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid response mode."
            )

        # -----------------------------
        # RESPONSE MODE INSTRUCTIONS
        # -----------------------------

        if request.responseMode == "Text":
            mode_instruction = """
The answer is provided as text.

Evaluate:
- Content
- Relevance
- Clarity
- Structure
- Natural wording
- Confidence as demonstrated through the written response

Do NOT claim to hear vocal tone, pronunciation, volume,
pitch, speaking speed, or actual voice modulation because
the response is text.
"""

        else:
            mode_instruction = """
The response mode is Audio.

However, unless actual audio/transcription information is
provided in the request, evaluate only the text answer.

Do not invent observations about:
- Voice
- Volume
- Pitch
- Speaking speed
- Pronunciation
- Actual vocal modulation
"""

        # -----------------------------
        # GEMINI PROMPT
        # -----------------------------

        prompt = f"""
You are an AI mock interview answer evaluator.

Target Job:
{request.targetJob}

Interview Category:
{request.interviewCategory}

Interview Question:
{request.question}

Applicant Answer:
{request.answer}

Response Mode:
{request.responseMode}

{mode_instruction}

Evaluate the answer fairly and professionally.

IMPORTANT RULES:

1. Evaluate ONLY what the applicant actually provided.
2. Do not invent experience, achievements, skills, education,
   responsibilities, or results.
3. Do not assume the applicant is experienced or inexperienced.
4. Do not penalize an applicant simply because they are a student
   or recent graduate.
5. Evaluate relevance to the question.
6. Evaluate how clearly the answer communicates its ideas.
7. Evaluate whether the answer provides enough supporting detail.
8. Identify strengths based only on the answer.
9. Identify improvements that would make the answer stronger.
10. Word suggestions must preserve the applicant's meaning.
11. Do not rewrite the applicant's answer completely.
12. Do not make hiring decisions.
13. Do not say whether the applicant should be hired.
14. Be neutral across all professions.

SCORING:

score:
Overall answer score from 0 to 100.

contentScore:
How well the answer addresses the question and provides
useful information.

confidenceScore:
How confidently the answer communicates its ideas based
only on the provided response.

naturalScore:
How natural, clear, and conversational the answer sounds.

IMPORTANT:
Scores must be numbers from 0 to 100.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "score": 0,
    "contentScore": 0,
    "confidenceScore": 0,
    "naturalScore": 0,

    "feedback": "Overall feedback about the answer.",

    "toneAndModulation": "Feedback about tone or modulation. For text responses, do not claim actual vocal observations.",

    "wordChoiceSuggestions": [
        {{
            "original": "original phrase",
            "suggestion": "better phrase",
            "reason": "Why this wording could be clearer."
        }}
    ],

    "strengths": [
        "Strength 1",
        "Strength 2"
    ],

    "improvements": [
        "Improvement 1",
        "Improvement 2"
    ]
}}
"""

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        response_text = response.text.strip()

        # -----------------------------
        # CLEAN JSON
        # -----------------------------

        if response_text.startswith("```"):
            response_text = response_text.replace("```json", "")
            response_text = response_text.replace("```", "")
            response_text = response_text.strip()

        result = json.loads(response_text)

        # -----------------------------
        # NORMALIZE SCORES
        # -----------------------------

        def normalize_score(value):
            try:
                value = int(float(value))

                if value < 0:
                    return 0

                if value > 100:
                    return 100

                return value

            except Exception:
                return 0

        result["score"] = normalize_score(
            result.get("score", 0)
        )

        result["contentScore"] = normalize_score(
            result.get("contentScore", 0)
        )

        result["confidenceScore"] = normalize_score(
            result.get("confidenceScore", 0)
        )

        result["naturalScore"] = normalize_score(
            result.get("naturalScore", 0)
        )

        # -----------------------------
        # SAFE DEFAULTS
        # -----------------------------

        result.setdefault(
            "feedback",
            "No additional feedback was provided."
        )

        result.setdefault(
            "toneAndModulation",
            "No additional tone information was provided."
        )

        result.setdefault(
            "wordChoiceSuggestions",
            []
        )

        result.setdefault(
            "strengths",
            []
        )

        result.setdefault(
            "improvements",
            []
        )

        return {
            "success": True,
            "analysis": result
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned an invalid answer analysis format."
        )

    except HTTPException:
        raise

    except Exception as e:
        print("Analyze interview answer error:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze interview answer."
        )


@app.post("/analyze-interview-session")
async def analyze_interview_session(
    request: AnalyzeInterviewSessionRequest
):
    try:
        # -----------------------------
        # VALIDATION
        # -----------------------------

        if not request.targetJob.strip():
            raise HTTPException(
                status_code=400,
                detail="Target job is required."
            )

        if not request.questions:
            raise HTTPException(
                status_code=400,
                detail="Interview questions are required."
            )

        # -----------------------------
        # GEMINI PROMPT
        # -----------------------------

        questions_json = json.dumps(
            request.questions,
            ensure_ascii=False,
            indent=2
        )

        prompt = f"""
You are an AI mock interview session evaluator.

Target Job:
{request.targetJob}

Interview Category:
{request.interviewCategory}

Completed Interview:

{questions_json}

Evaluate the applicant's complete interview performance.

IMPORTANT RULES:

1. Evaluate only the answers provided.
2. Do not invent applicant information.
3. Do not assume missing experience or skills.
4. Do not make hiring decisions.
5. Do not say whether the applicant should be hired.
6. Be fair to students, graduates, career changers,
   and experienced applicants.
7. Consider the target job when evaluating relevance.
8. Use the individual answer scores when available.
9. The final score should represent the complete interview.

Skill breakdown:

communication:
How clearly the applicant communicates.

technicalKnowledge:
Relevant technical knowledge demonstrated in the answers.
If the interview does not provide enough technical evidence,
use a reasonable score based only on available evidence.

problemSolving:
Ability to explain reasoning, decisions, and solutions.

confidence:
Confidence demonstrated through the responses.
Do not infer psychological traits.

relevance:
How relevant the answers are to the questions and target job.

All scores must be from 0 to 100.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "overallScore": 0,

    "skillBreakdown": {{
        "communication": 0,
        "technicalKnowledge": 0,
        "problemSolving": 0,
        "confidence": 0,
        "relevance": 0
    }}
}}
"""

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        response_text = response.text.strip()

        # -----------------------------
        # CLEAN JSON
        # -----------------------------

        if response_text.startswith("```"):
            response_text = response_text.replace("```json", "")
            response_text = response_text.replace("```", "")
            response_text = response_text.strip()

        result = json.loads(response_text)

        # -----------------------------
        # NORMALIZE SCORE
        # -----------------------------

        def normalize_score(value):
            try:
                value = int(float(value))

                if value < 0:
                    return 0

                if value > 100:
                    return 100

                return value

            except Exception:
                return 0

        result["overallScore"] = normalize_score(
            result.get("overallScore", 0)
        )

        skill_breakdown = result.get(
            "skillBreakdown",
            {}
        )

        result["skillBreakdown"] = {
            "communication": normalize_score(
                skill_breakdown.get("communication", 0)
            ),
            "technicalKnowledge": normalize_score(
                skill_breakdown.get("technicalKnowledge", 0)
            ),
            "problemSolving": normalize_score(
                skill_breakdown.get("problemSolving", 0)
            ),
            "confidence": normalize_score(
                skill_breakdown.get("confidence", 0)
            ),
            "relevance": normalize_score(
                skill_breakdown.get("relevance", 0)
            )
        }

        return {
            "success": True,
            "analysis": result
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned an invalid session analysis format."
        )

    except HTTPException:
        raise

    except Exception as e:
        print("Analyze interview session error:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze interview session."
        )


@app.get("/")
async def root():

    return {
        "success": True,
        "message": "Gemini AI Resume Service is running"
    }