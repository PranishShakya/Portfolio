import React from "react";
import {
  FaEnvelope,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaPhone,
} from "react-icons/fa";

const Contact = () => {
  return (
    <section
      id="contact"
      className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12 mt-10"
    >
      <div className="w-full max-w-xl bg-gray-800 p-8  shadow-xl text-white text-center ">
        <h2 className="text-4xl font-bold text-orange-500 mb-6">Contact Me</h2>
        <p className="text-gray-300 mb-8">
          Feel free to reach out through any of the platforms below!
        </p>

        <div className="space-y-5 text-left text-lg">
          <div className="flex items-center gap-4">
            <FaEnvelope className="text-orange-400 text-3xl" />
            <a
              href="mailto:pranishshakya942@gmail.com"
              className="hover:text-orange-400"
            >
              pranishshakya942@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-4">
            <FaPhone className="text-orange-400 text-3xl" />
            <span className="hover:text-orange-400">+977-9845754168</span>
          </div>

          <div className="flex items-center gap-4">
            <FaLinkedin className="text-orange-400 text-3xl" />
            <a
              href="https://www.linkedin.com/in/pranish-shakya-2252a627a/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400"
            >
              LinkedIn:Pranish Shakya
            </a>
          </div>

          <div className="flex items-center gap-4">
            <FaFacebook className="text-orange-400 text-3xl" />
            <a
              href="https://www.facebook.com/alex.shakya.10"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400"
            >
              Pranish Shakya
            </a>
          </div>

          <div className="flex items-center gap-4">
            <FaInstagram className="text-orange-400 text-3xl" />
            <a
              href="https://www.instagram.com/pranish_shakya001"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400"
            >
              pranish_shakya001
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
