import AsyncStorage from "@react-native-async-storage/async-storage";

export const basicInfoHandler = ({
  resumeId,
  setResumeId,

  fullName,
  contactNumber,
  address,
  email,
  linkedInURL,
  portfolioLink,

  setFullName,
  setContactNumber,
  setAddress,
  setEmail,
  setLinkedInURL,
  setPortfolioLink,

  setFullNameError,
  setContactNumberError,
  setAddressError,
  setEmailError,
  setLinkedInURLError,
  setPortfolioLinkError,

  getDraft,
  create,
  saveBasic,
  navigation,
}) => {
  // LOAD EXISTING DRAFT
  const loadBasicInfoResume = async () => {
    try {
      const result = await getDraft();

      if (result.success && result.resume) {
        const resume = result.resume;

        setResumeId(resume._id);

        await AsyncStorage.setItem("resumeId", resume._id);

        if (resume.basicInfo) {
          setFullName(resume.basicInfo.fullName || "");

          setContactNumber(resume.basicInfo.contactNumber || "");

          setAddress(resume.basicInfo.address || "");

          setEmail(resume.basicInfo.email || "");

          setLinkedInURL(resume.basicInfo.linkedInURL || "");

          setPortfolioLink(resume.basicInfo.portfolioLink || "");
        }
      }
    } catch (error) {
      console.log("Load basic info error:", error);
    }
  };

  // CREATE DRAFT
  const createBasicInfoResume = async () => {
    try {
      const result = await create();

      if (!result.success) {
        console.log(result.message);
        return null;
      }

      const id = result.resume._id;

      setResumeId(id);

      await AsyncStorage.setItem("resumeId", id);

      return id;
    } catch (error) {
      console.log("Create resume error:", error);

      return null;
    }
  };

  // NEXT BUTTON
  const handleBasicInfoNext = async () => {
    try {
      // Clear previous errors
      setFullNameError("");
      setContactNumberError("");
      setAddressError("");
      setEmailError("");
      setLinkedInURLError("");
      setPortfolioLinkError("");

      let id = resumeId;

      // Create resume if one doesn't exist
      if (!id) {
        id = await createBasicInfoResume();

        if (!id) {
          return;
        }
      }

      const result = await saveBasic(id, {
        fullName,
        contactNumber,
        address,
        email,
        linkedInURL,
        portfolioLink,
      });

      // BACKEND VALIDATION
      if (!result.success) {
        const validationErrors = result.errors || {};

        setFullNameError(validationErrors.fullName || "");

        setContactNumberError(validationErrors.contactNumber || "");

        setAddressError(validationErrors.address || "");

        setEmailError(validationErrors.email || "");

        setLinkedInURLError(validationErrors.linkedInURL || "");

        setPortfolioLinkError(validationErrors.portfolioLink || "");

        console.log("Validation errors:", validationErrors);

        return;
      }

      navigation.navigate("TargetJobPosition", {
        resumeId: id,
      });
    } catch (error) {
      console.log("Basic info handler error:", error);
    }
  };

  return {
    loadBasicInfoResume,
    createBasicInfoResume,
    handleBasicInfoNext,
  };
};
