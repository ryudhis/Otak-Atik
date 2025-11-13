import React, { useState } from "react";

interface AccordionProps {
    title: string;
    answer: string;
}

const Accordion: React.FC<AccordionProps> = ({ title, answer }) => {
    const [accordionOpen, setAccordionOpen] = useState(false);

    return (
        <div data-aos="fade-up" data-aos-duration="600">
            <button onClick={() => setAccordionOpen(!accordionOpen)}
                className="flex justify-between w-full text-xl mb-1 hover:text-secondary transition-colors duration-200">
                <span>{title}</span>
                <span className="transition-transform duration-300" style={{ transform: accordionOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                    {accordionOpen ? <span>-</span> : <span>+</span>}
                </span>
            </button>
            <div
                className={`mb-2 grid overflow-hidden transition-all duration-300 text-secondary ease-in-out text-m ${
                    accordionOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}>
                <div className="overflow-hidden">{answer}</div>
            </div>
        </div>
    );
};

export default Accordion;
