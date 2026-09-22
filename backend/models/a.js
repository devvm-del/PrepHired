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