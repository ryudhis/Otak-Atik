import React, {useState} from "react";

const Accordion = ({ title, answer }) => {
    const [accordionOpen, setAccordionOpen] = useState(false);

    return(
        <div>
            <button onClick={() => setAccordionOpen(!accordionOpen)}
            className="flex justify-between w-full text-xl mb-1">
                <span>{title}</span>
                {accordionOpen ? <span>-</span> : <span>+</span>}
            </button>
            <div
                className={`mb-2 grid overflow-hidden transition-all duration-300 ease-in-out text-slate-300 text-m ${
                    accordionOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}>
                    <div className="overflow-hidden">{answer}</div>
            </div>
        </div>
    )
}

export default Accordion;