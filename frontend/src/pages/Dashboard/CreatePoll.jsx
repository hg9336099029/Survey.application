import React, { useState } from "react";
import { DashboardLayout } from "../../components/layout/dashboardLayout";
import { API_PATH } from "../../utils/apipath";
import { axioscreatepoll } from "../../utils/axiosInstance";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [selectedButton, setSelectedButton] = useState("");
  const [options, setOptions] = useState([]);
  const [fileInputs, setFileInputs] = useState([]);
  const [errors, setErrors] = useState({});

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!question.trim()) newErrors.question = "Question is required.";
    if (!selectedButton) newErrors.pollType = "Poll type must be selected.";

    if (selectedButton === "single choice" || selectedButton === "yesno" || selectedButton === "rating") {
      if (options.length < 2) {
        newErrors.options = "At least two options are required.";
      } else if (options.some(opt => !opt.trim())) {
        newErrors.options = "Options cannot be empty.";
      }
    }

    if (selectedButton === "imagebased") {
      if (fileInputs.length < 2) {
        newErrors.images = "At least two images must be uploaded.";
      } else {
        fileInputs.forEach(file => {
          if (file.size > 5000000) {
            newErrors.images = "Each image must be less than 5MB.";
          }
          const filetypes = /jpeg|jpg|png|gif/;
          const extname = filetypes.test(file.name.toLowerCase());
          const mimetype = filetypes.test(file.type);
          if (!mimetype || !extname) {
            newErrors.images = "Images must be in jpeg, jpg, png, or gif format.";
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle poll submission using axioscreatepoll instance
  const handleSubmit = async () => {
    if (validateForm()) {
      const formData = new FormData();
      formData.append("question", question);
      formData.append("pollType", selectedButton);

      if (selectedButton === "imagebased") {
        fileInputs.forEach(file => {
          if (file) formData.append("images", file);
        });
      } else {
        formData.append("options", JSON.stringify(options));
      }

      try {
        console.log("Submitting formData:", [...formData.entries()]);
        const response = await axioscreatepoll.post(API_PATH.AUTH.CREATE_POLL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 5000,
        });

        console.log("Response:", response);
        if (response.status === 201) {
          alert("Poll Created Successfully!");
          setQuestion("");
          setSelectedButton("");
          setOptions([]);
          setFileInputs([]);
          setErrors({});
        } else {
          console.log("Error in poll creation:", response.data);
        }
      } catch (error) {
        console.error("Error creating poll:", error.response?.data || error.message);
      }
    }
  };

  // Handle poll type selection
  const handlePollTypeSelection = (type) => {
    setSelectedButton(type);
    setErrors({});

    if (type === "yesno") {
      setOptions(["Yes", "No"]); // Always set default options for Yes/No polls
    } else if (type === "rating") {
      setOptions(["1", "2", "3", "4", "5"]); // Default rating options
    } else {
      setOptions([]); // Reset options for other poll types
    }

    if (type !== "imagebased") {
      setFileInputs([]); // Reset file inputs only if not image-based poll
    }
  };

  return (
    <DashboardLayout>
      <div className="h-auto m-2 border-2 border-gray-100 rounded-md p-5 shadow-2xl">
        <h1 className="text-2xl font-bold mb-3">Create Poll</h1>

        <h3 className="text-base mb-1">Question</h3>
        <textarea
          className="resize-none h-1/2 w-full border-2 border-gray-100 rounded-lg p-2"
          placeholder="What's on your mind?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        ></textarea>
        {errors.question && <p className="text-red-500 text-sm">{errors.question}</p>}

        <h3 className="text-base mb-2">Poll Type</h3>
        <div className="flex flex-row gap-5">
          {["yesno", "single choice", "imagebased", "rating", "open ended"].map(type => (
            <button
              key={type}
              className={`mt-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-400 px-6 py-2 ${selectedButton === type ? "bg-blue-700" : ""
                }`}
              onClick={() => handlePollTypeSelection(type)}
            >
              {type.replace("-", " ")}
            </button>
          ))}
        </div>
        {errors.pollType && <p className="text-red-500 text-sm">{errors.pollType}</p>}

        {(selectedButton === "single choice") && (
          <div className="flex flex-col gap-2 mt-3">
            {options.map((option, index) => (
              <input
                key={index}
                className="w-1/2 border-2 border-gray-100 rounded-md p-1"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
              />
            ))}
            {selectedButton === "single choice" && options.length < 4 && (
              <button
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400"
                onClick={() => setOptions([...options, ""])}
              >
                Add Option
              </button>
            )}
            {errors.options && <p className="text-red-500 text-sm">{errors.options}</p>}
          </div>
        )}

        {selectedButton === "imagebased" && (
          <div className="flex flex-col gap-2 mt-3">
            {fileInputs.map((_, index) => (
              <input
                key={index}
                type="file"
                className="w-auto border-2 border-gray-100 rounded-md p-1"
                onChange={(e) => {
                  const newFiles = [...fileInputs];
                  newFiles[index] = e.target.files[0];
                  setFileInputs(newFiles);
                }}
              />
            ))}
            {fileInputs.length < 4 && (
              <button
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400"
                onClick={() => setFileInputs([...fileInputs, ""])}
              >
                Add Image
              </button>
            )}
            {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
          </div>
        )}

        <button className="mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-400 w-full py-2" onClick={handleSubmit}>
          Create Poll
        </button>
      </div>
    </DashboardLayout>
  );
};

export default CreatePoll;