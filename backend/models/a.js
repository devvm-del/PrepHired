/*

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
                indent=2,
                ensure_ascii=False
            )
            if has_target_job
            else ""
        )

        work_experiences = (
            json.dumps(
                data.workExperiences,
                indent=2,
                ensure_ascii=False
            )
            if has_work_experience
            else ""
        )

        educations = (
            json.dumps(
                data.educations,
                indent=2,
                ensure_ascii=False
            )
            if has_education
            else ""
        )

        projects = (
            json.dumps(
                data.projects,
                indent=2,
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

        Analyze the applicant's resume based ONLY on the
        information provided.

        Do not invent information.

        Do not assume the applicant has skills, experience,
        certifications, achievements, or qualifications that
        are not explicitly provided.

        ========================================
        TARGET JOB
        ========================================

        {target_job if has_target_job else "NOT PROVIDED"}

        ========================================
        WORK EXPERIENCE
        ========================================

        {work_experiences if has_work_experience else "EMPTY - IGNORE THIS SECTION"}

        ========================================
        EDUCATION
        ========================================

        {educations if has_education else "EMPTY - IGNORE THIS SECTION"}

        ========================================
        SKILLS
        ========================================

        {skills if has_skills else "EMPTY - IGNORE THIS SECTION"}

        ========================================
        PROJECTS
        ========================================

        {projects if has_projects else "EMPTY - IGNORE THIS SECTION"}

        ========================================
        CERTIFICATES
        ========================================

        {certificates if has_certificates else "EMPTY - IGNORE THIS SECTION"}

        ========================================
        RESUME SECTION RULE
        ========================================

        The following sections are OPTIONAL in this resume builder:

        - Work Experience
        - Education
        - Skills
        - Projects
        - Certificates

        An optional section being empty is completely valid.

        If an optional section is empty:

        - Ignore the section completely.
        - Do NOT deduct ATS points.
        - Do NOT consider it a weakness.
        - Do NOT consider it missing information.
        - Do NOT include it in recommendations.
        - Do NOT create an analysis for it.
        - Do NOT create fake content.
        - Do NOT create keywords from it.
        - Do NOT lower the ATS score because it is empty.

        The ATS score must be based ONLY on the information
        that the applicant actually provided.

        A resume does NOT need to contain every optional section
        to receive a strong ATS score.

        ========================================
        WORK EXPERIENCE RULE
        ========================================

        Work experience is OPTIONAL.

        If work experience is provided:
        - Analyze its relevance to the target job.
        - Analyze its descriptions and keywords.
        - Use it when calculating the ATS score.

        If work experience is empty:
        - Ignore it completely.
        - Do not deduct points.
        - Return an empty experienceAnalysis.
        - Do not recommend adding work experience simply because
          it is empty.

        ========================================
        CERTIFICATE RULE
        ========================================

        Certificates are OPTIONAL.

        If certificates are provided:
        - Analyze their relevance to the target job.
        - Use relevant certificates when evaluating the resume.

        If certificates are empty:
        - Ignore them completely.
        - Do not deduct points.
        - Return an empty certificateAnalysis.
        - Do not recommend adding certificates simply because
          they are empty.

        ========================================
        PROJECT RULE
        ========================================

        Projects are OPTIONAL.

        If projects are provided:
        - Analyze their relevance to the target job.
        - Use them when evaluating the resume.

        If projects are empty:
        - Ignore them completely.
        - Do not deduct points.
        - Return an empty projectAnalysis.
        - Do not recommend adding projects simply because
          they are empty.

        ========================================
        EDUCATION RULE
        ========================================

        Education is OPTIONAL.

        If education is provided:
        - Analyze its relevance to the target job.
        - Use it when evaluating the resume.

        If education is empty:
        - Ignore it completely.
        - Do not deduct points.
        - Return an empty educationAnalysis.
        - Do not recommend adding education simply because
          it is empty.

        ========================================
        SKILLS RULE
        ========================================

        Skills are OPTIONAL.

        If skills are provided:
        - Identify relevant skills.
        - Compare them with the target job.
        - Identify matching keywords.
        - Use them when calculating the ATS score.

        If skills are empty:
        - Ignore them completely.
        - Do not deduct points.
        - Return an empty skillsAnalysis.
        - Do not recommend adding skills simply because
          the field is empty.

        ========================================
        ATS SCORING
        ========================================

        Calculate an ATS score from 0 to 100.

        The score must evaluate ONLY information that exists
        in the applicant's resume.

        Consider:

        - Relevance to the target job
        - Keyword matching
        - Quality of provided information
        - Clarity of provided information
        - Relevance of provided education
        - Relevance of provided skills
        - Relevance of provided work experience
        - Relevance of provided projects
        - Relevance of provided certificates

        ONLY evaluate these factors when the corresponding
        information was actually provided.

        IMPORTANT:

        Empty optional sections must have ZERO effect on the score.

        Do NOT use missing optional sections as negative scoring factors.

        ========================================
        ANALYSIS REQUIREMENTS
        ========================================

        Analyze the resume and return:

        1. Overall ATS score from 0 to 100.

        2. Strengths:

        Identify the strongest parts of the resume that are
        relevant to the target job.

        Only use information actually provided.

        3. Missing keywords:

        Identify important keywords from the target job that
        are not supported by the applicant's provided information.

        Only identify meaningful job-related keywords.

        Do NOT treat an empty optional section as a missing keyword.

        4. Matching keywords:

        Identify keywords from the target job that are already
        supported by the applicant's information.

        5. Recommendations:

        Give practical recommendations for improving the
        information that was actually provided.

        Do NOT recommend filling an optional empty section
        simply because it is empty.

        6. Experience analysis:

        Analyze work experience ONLY if work experience exists.

        If work experience is empty, return:

        ""

        7. Education analysis:

        Analyze education ONLY if education exists.

        If education is empty, return:

        ""

        8. Skills analysis:

        Analyze skills ONLY if skills exist.

        If skills are empty, return:

        ""

        9. Project analysis:

        Analyze projects ONLY if projects exist.

        If projects are empty, return:

        ""

        10. Certificate analysis:

        Analyze certificates ONLY if certificates exist.

        If certificates are empty, return:

        ""

        ========================================
        IMPORTANT RULES
        ========================================

        - Never invent information.
        - Never create fake skills.
        - Never create fake experience.
        - Never create fake certifications.
        - Never create fake achievements.
        - Never create fake numbers.
        - Never create fake statistics.
        - Never claim the applicant has a skill that was not provided.
        - Never claim the applicant has experience that was not provided.
        - Never create qualifications that were not provided.

        - Empty optional sections are valid.
        - Empty optional sections must not reduce the ATS score.
        - Empty optional sections must not be called weaknesses.
        - Empty optional sections must not appear in recommendations.
        - Empty optional sections must not be analyzed.

        - Only use information provided by the applicant.
        - Recommendations must be suggestions.
        - Recommendations must not fabricate resume content.
        - Use professional language.

        ========================================
        OUTPUT FORMAT
        ========================================

        Return ONLY valid JSON.

        Use exactly this structure:

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

        if result_text.startswith("```json"):
            result_text = result_text[7:]

        if result_text.startswith("```"):
            result_text = result_text[3:]

        if result_text.endswith("```"):
            result_text = result_text[:-3]

        result_text = result_text.strip()

        try:

            analysis = json.loads(
                result_text
            )

        except json.JSONDecodeError:

            print(
                "Invalid Gemini JSON:",
                result_text
            )

            raise HTTPException(
                status_code=500,
                detail="Gemini returned invalid analysis format"
            )

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


        if not isinstance(
            analysis.get("atsScore"),
            (int, float)
        ):
            analysis["atsScore"] = 0

        if not isinstance(
            analysis.get("strengths"),
            list
        ):
            analysis["strengths"] = []

        if not isinstance(
            analysis.get("missingKeywords"),
            list
        ):
            analysis["missingKeywords"] = []

        if not isinstance(
            analysis.get("matchingKeywords"),
            list
        ):
            analysis["matchingKeywords"] = []

        if not isinstance(
            analysis.get("recommendations"),
            list
        ):
            analysis["recommendations"] = []


        analysis["atsScore"] = max(
            0,
            min(
                100,
                int(analysis["atsScore"])
            )
        )

        return {
            "success": True,
            "analysis": analysis
        }

    except HTTPException:
        raise

    except Exception as error:

        print(
            "AI analysis error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze resume"
        )

        */


/*
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

        */