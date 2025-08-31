import React, { useState } from 'react'
import HomeLayout from '../layout/HomeLayout'
import toast from 'react-hot-toast';
import axiosInstance from '../helpars/axiosi';

const ContactUs = () => {
    const [inputValue, setInputValue] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [focus, setFocus] = useState({ name: false, email: false, message: false });

    function handleInput(e) {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value
        });
    }

    // Helper for floating label
    const floatLabel = (field) => (focus[field] || inputValue[field]) ? 'text-xs -top-3.5 left-3 bg-gray-900 px-1' : 'text-base top-2 left-4';

    async function onFormSubmit(e) {
        e.preventDefault();
        if (!inputValue.name || !inputValue.email || !inputValue.message) {
            toast.error("Enter all value");
            return;
        }
        if (!inputValue.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            toast.error("Enter a valid email");
            return;
        }
        if (inputValue.message.length <= 50) {
            toast.error("Message is too short");
            return;
        }
        try {
            const response = axiosInstance.post('contect', inputValue);
            toast.promise(response, {
                loading: "Message is sending...",
                success: "Sent successfully!",
                error: (err) => err?.response?.data?.message || 'Something went wrong'
            });
            const res = await response;
            if (res?.data?.success) {
                setInputValue({
                    name: "",
                    email: "",
                    message: ""
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <HomeLayout>
            <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900">
                <form
                    onSubmit={onFormSubmit}
                    noValidate
                    className="flex flex-col items-center justify-center gap-8 p-10 rounded-2xl w-full max-w-md bg-white/10 backdrop-blur-lg border-2 border-transparent shadow-2xl animate-fade-in-up relative group transition-all duration-300 hover:shadow-yellow-400/30 hover:border-yellow-400 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-tr before:from-yellow-400 before:via-yellow-200 before:to-yellow-500 before:opacity-0 group-hover:before:opacity-40 before:transition-all before:duration-300 overflow-hidden"
                >
                    <h1 className="text-3xl font-extrabold text-gray-100 tracking-tight mb-2 z-10">Contact Form</h1>
                    {/* Name */}
                    <div className="relative w-full z-10">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            autoComplete="off"
                            placeholder=" "
                            className="peer px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all duration-200 placeholder-transparent w-full"
                            value={inputValue.name}
                            onChange={handleInput}
                            onFocus={() => setFocus(f => ({ ...f, name: true }))}
                            onBlur={() => setFocus(f => ({ ...f, name: false }))}
                            aria-label="Name"
                        />
                        <label
                            htmlFor="name"
                            className={`absolute pointer-events-none transition-all duration-200 text-gray-400 font-semibold bg-transparent px-1 ${floatLabel('name')}`}
                        >
                            Name
                        </label>
                    </div>
                    {/* Email */}
                    <div className="relative w-full z-10">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="off"
                            placeholder=" "
                            className="peer px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all duration-200 placeholder-transparent w-full"
                            value={inputValue.email}
                            onChange={handleInput}
                            onFocus={() => setFocus(f => ({ ...f, email: true }))}
                            onBlur={() => setFocus(f => ({ ...f, email: false }))}
                            aria-label="Email"
                        />
                        <label
                            htmlFor="email"
                            className={`absolute pointer-events-none transition-all duration-200 text-gray-400 font-semibold bg-transparent px-1 ${floatLabel('email')}`}
                        >
                            Email
                        </label>
                    </div>
                    {/* Message */}
                    <div className="relative w-full z-10">
                        <textarea
                            id="message"
                            name="message"
                            autoComplete="off"
                            placeholder=" "
                            className="peer px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all duration-200 placeholder-transparent w-full resize-none h-40"
                            value={inputValue.message}
                            onChange={handleInput}
                            onFocus={() => setFocus(f => ({ ...f, message: true }))}
                            onBlur={() => setFocus(f => ({ ...f, message: false }))}
                            aria-label="Message"
                        />
                        <label
                            htmlFor="message"
                            className={`absolute pointer-events-none transition-all duration-200 text-gray-400 font-semibold bg-transparent px-1 ${floatLabel('message')}`}
                        >
                            Message
                        </label>
                    </div>
                    <button type="submit" className="w-full bg-yellow-400 rounded-full font-bold hover:bg-yellow-500 py-3 capitalize transition-all duration-200 text-lg cursor-pointer text-gray-900 shadow-lg z-10">
                        Submit
                    </button>
                </form>
            </div>
        </HomeLayout>
    )
}

export default ContactUs