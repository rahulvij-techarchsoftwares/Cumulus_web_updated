import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaEnvelope, FaPlay, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import phoneIcon from "../../assets/phone-icon.png";
import emailIcon from "../../assets/email-icon.png";
import youtube from "../../assets/youtube.png";
import checkSecurity from "../../assets/check-security.png";
import { API_URL } from "../utils/Apiconfig";
const Help = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [question, setQuestion] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const predefinedFAQs = [
    {
      question: "What is Cumulus?",
      answer:
        "Cumulus is a secure digital vault platform designed to store, manage, and share your important documents. It offers features like after-life access, designee workflows, and secure document sharing.",
    },
    {
      question: "Who can use Cumulus?",
      answer:
        "Anyone who needs to securely store and manage important documents can use Cumulus.",
    },
    {
      question: "What makes Cumulus secure?",
      answer:
        "Cumulus uses advanced encryption and security protocols to ensure your documents are safe and secure.",
    },
  ];
  useEffect(() => {
    // Fetch FAQs from the backend
    const fetchFAQs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/help-support/my-questions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch FAQs');
        }
        const data = await response.json();
        setFaqs(data.interactions || []);
      } catch (error) {
        console.error('Error fetching FAQs:', error.message);
      }
    };
    fetchFAQs();
  }, []);
  const handleSend = async () => {
    if (!question.trim()) {
      setStatusMessage('Question cannot be empty');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/help-support/add-helpquestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
        },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (response.ok) {
        setStatusMessage('Question added successfully!');
        setQuestion(''); // Clear the textarea
      } else {
        setStatusMessage(data.message || 'Failed to add question');
      }
    } catch (error) {
      console.error('Error adding question:', error.message);
      setStatusMessage('An error occurred. Please try again.');
    }
  };
  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };
  return (
    <div className="mx-auto p-4">
      <div className="flex justify-between items-center my-6 gap-4 flex-wrap ">
        <h1 className="text-2xl font-semibold">Help & Support</h1>
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2">
            {/* <FaPhoneAlt /> */}
            <img src={phoneIcon} className="h-[20px]" alt="" />
            <span>Contact Us</span>
          </button>
          <button className="flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2">
            {/* <FaEnvelope /> */}
            <img src={emailIcon} className="h-[16px]" alt="" />
            <span>Email Us</span>
          </button>
        </div>
      </div>
      <div className='overflow-y-auto h-[70vh] w-full border border-gray-300 p-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100'>
        <div className="flex flex-col md:flex-row gap-6 px-2">
          <div className="md:w-2/5 flex flex-col w-full gap-6">
            <p className="text-base font-normal text-[#212636]">Watch Demo Video</p>
            <div className="relative group mx-2">
              <img
                alt="Screenshot of Cumulus platform with a play button overlay"
                className="rounded-lg shadow-md transition-transform duration-300 group-hover:scale-100"
                height="400"
                src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2Vic2l0ZSUyMGRhc2hib2FyZCUyMHNjcmVlbnxlbnwwfHwwfHx8MA%3D%3D"
                width="550"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 rounded-lg group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="rounded-full transform scale-100 group-hover:scale-110 transition-transform duration-300">
                  <img src={youtube} className="h-[35px]" alt="Play button" />
                  {/* <FaPlay className="text-2xl text-gray-700" /> */}
                </button>
              </div>
            </div>
            <p className="text-base text-[#667085]">Watch Demo Video</p>
          </div>
          <div className="md:w-3/5 flex flex-col w-full gap-6">
            <h2 className="text-base font-normal text-[#212636]">General Questions FAQs</h2>
            <div className="bg-[#F6F7F9] rounded-lg shadow-md">
              {/* <div className="space-y-4">
              <div>
                <button
                  className="faq-button flex justify-between items-center w-full text-left text-gray-700 font-medium"
                  onClick={() => toggleFAQ(0)}
                >
                  <span>What is Cumulus?</span>
                  {activeFAQ === 0 ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {activeFAQ === 0 && (
                  <p className="mt-2 text-gray-600">
                    Cumulus is a secure digital vault platform designed to store, manage, and share your important documents. It offers features like after-life access, designee workflows, and secure document sharing.
                  </p>
                )}
              </div>
              <div>
                <button
                  className="faq-button flex justify-between items-center w-full text-left text-gray-700 font-medium"
                  onClick={() => toggleFAQ(1)}
                >
                  <span>Who can use Cumulus?</span>
                  {activeFAQ === 1 ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {activeFAQ === 1 && (
                  <p className="mt-2 text-gray-600">
                    Anyone who needs to securely store and manage important documents can use Cumulus.
                  </p>
                )}
              </div>
              <div>
                <button
                  className="faq-button flex justify-between items-center w-full text-left text-gray-700 font-medium"
                  onClick={() => toggleFAQ(2)}
                >
                  <span>What makes Cumulus secure?</span>
                  {activeFAQ === 2 ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {activeFAQ === 2 && (
                  <p className="mt-2 text-gray-600">
                    Cumulus uses advanced encryption and security protocols to ensure your documents are safe and secure.
                  </p>
                )}
              </div>
              {faqs.length > 0 ? (
          faqs.map((faq, index) => (
            <div key={index}>
              <button
                className="faq-button flex justify-between items-center w-full text-left text-gray-700 font-medium"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                {activeFAQ === index ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {activeFAQ === index && (
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No FAQs available.</p>
        )}
            </div> */}
              <div className="space-y-4">
                {/* Render predefined FAQs */}
                {predefinedFAQs.map((faq, index) => (
                  <div className='border-b-2 border-[#DCDFE4] p-4 !my-1 mr-5' key={`predefined-${index}`}>
                    <button
                      className="faq-button flex justify-between items-center w-full text-left text-gray-700 font-medium"
                      onClick={() => toggleFAQ(index)}
                    >
                      <span>{faq.question}</span>
                      {activeFAQ === index ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    {activeFAQ === index && (
                      <p className="p-3 text-gray-600">{faq.answer}</p>
                    )}
                  </div>
                ))}
                {/* Render dynamic FAQs */}
                {faqs.length > 0 ? (
                  faqs.map((faq, index) => {
                    const adjustedIndex = index + predefinedFAQs.length; // Offset the index
                    return (
                      <div className='border-b-2 border-[#DCDFE4] p-4 !my-1 mr-5' key={`dynamic-${index}`}>
                        <button
                          className="faq-button flex justify-between items-center w-full text-left text-gray-700 font-medium"
                          onClick={() => toggleFAQ(adjustedIndex)}
                        >
                          <span>{faq.question}</span>
                          {activeFAQ === adjustedIndex ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {activeFAQ === adjustedIndex && (
                          <p className=" text-gray-600 p-4">{faq.answer}</p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-600 p-4">No FAQs available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-base mb-2 text-[#212636]">Encountering an Issue? Let Us Know</h2>
        <textarea
          className="w-full border font-medium text-lg border-gray-300 rounded-lg p-4 placeholder-gray-900"
          placeholder="Describe the issue you're experiencing here."
          rows="4"
          onChange={(e) => setQuestion(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-2">
          <button onClick={handleSend} className="bg-[#0067FF] text-white px-6 py-2 rounded-lg">Send</button>
        </div>
        {statusMessage && (
          <p className="mt-2 text-sm text-gray-600">{statusMessage}</p>
        )}
      </div>
      <div className="flex justify-end items-center mt-6 text-gray-500 text-sm">
        <img src={checkSecurity} className="h-[16px] mr-2" alt="" />
        <span>Terms and Policy</span>
      </div>
    </div>
  );
};
export default Help;