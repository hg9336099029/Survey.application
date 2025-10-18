import React, { useState } from "react";
import { DashboardLayout } from "../../components/layout/dashboardLayout";
import { API_PATH } from "../../utils/apipath";
import { axioscreatepoll } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [selectedButton, setSelectedButton] = useState("");
  const [options, setOptions] = useState([]);
  const [fileInputs, setFileInputs] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const pollTypes = [
    { id: "yesno", label: "Yes/No", icon: "👍", desc: "Simple binary choice" },
    { id: "single choice", label: "Single Choice", icon: "✓", desc: "One answer only" },
    { id: "rating", label: "Rating", icon: "⭐", desc: "1-5 scale" },
    { id: "imagebased", label: "Image-Based", icon: "🖼", desc: "Visual options" },
    { id: "open ended", label: "Open-Ended", icon: "💬", desc: "Free text response" },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!question.trim()) newErrors.question = "Question is required";
    if (!selectedButton) newErrors.pollType = "Poll type must be selected";

    if (["single choice", "yesno", "rating"].includes(selectedButton)) {
      if (options.length < 2) newErrors.options = "At least 2 options required";
      else if (options.some(opt => !opt.trim())) newErrors.options = "No empty options";
    }

    if (selectedButton === "imagebased") {
      if (fileInputs.length < 2) newErrors.images = "At least 2 images required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors");
      return;
    }

    setLoading(true);
    try {
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

      const response = await axioscreatepoll.post(API_PATH.AUTH.CREATE_POLL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toast.success("Poll created successfully!");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create poll");
    } finally {
      setLoading(false);
    }
  };

  const handlePollTypeSelection = (type) => {
    setSelectedButton(type);
    setErrors({});
    if (type === "yesno") setOptions(["Yes", "No"]);
    else if (type === "rating") setOptions(["1", "2", "3", "4", "5"]);
    else setOptions([]);
    setFileInputs([]);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Create a Poll</h1>
            <p className="text-gray-600 mt-2">Engage your community with an interactive poll</p>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            {/* Question Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Poll Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                placeholder="Ask something interesting..."
                rows="4"
              />
              {errors.question && <p className="text-red-500 text-sm mt-2">{errors.question}</p>}
            </div>

            {/* Poll Type Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-4">Choose Poll Type</label>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {pollTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handlePollTypeSelection(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedButton === type.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 bg-white"
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <p className="font-bold text-sm text-gray-900">{type.label}</p>
                    <p className="text-xs text-gray-600 mt-1">{type.desc}</p>
                  </button>
                ))}
              </div>
              {errors.pollType && <p className="text-red-500 text-sm mt-2">{errors.pollType}</p>}
            </div>

            {/* Options Section */}
            {(selectedButton === "single choice" || selectedButton === "yesno" || selectedButton === "rating") && (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Options</label>
                <div className="space-y-2">
                  {options.map((option, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[idx] = e.target.value;
                          setOptions(newOptions);
                        }}
                        disabled={selectedButton === "yesno" || selectedButton === "rating"}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                      />
                      {selectedButton === "single choice" && (
                        <button
                          onClick={() => setOptions(options.filter((_, i) => i !== idx))}
                          className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {selectedButton === "single choice" && options.length < 4 && (
                  <button
                    onClick={() => setOptions([...options, ""])}
                    className="mt-3 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors font-medium"
                  >
                    + Add Option
                  </button>
                )}
                {errors.options && <p className="text-red-500 text-sm mt-2">{errors.options}</p>}
              </div>
            )}

            {/* Image Upload Section */}
            {selectedButton === "imagebased" && (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Upload Images</label>
                <div className="space-y-2">
                  {fileInputs.map((_, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const newFiles = [...fileInputs];
                          newFiles[idx] = e.target.files[0];
                          setFileInputs(newFiles);
                        }}
                        className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        onClick={() => setFileInputs(fileInputs.filter((_, i) => i !== idx))}
                        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                {fileInputs.length < 4 && (
                  <button
                    onClick={() => setFileInputs([...fileInputs, null])}
                    className="mt-3 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors font-medium"
                  >
                    + Add Image
                  </button>
                )}
                {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
              >
                {loading ? "Creating..." : "Create Poll"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreatePoll;