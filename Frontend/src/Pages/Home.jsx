import React from "react";

export default function Home(){
    return(
        <>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0F0F] text-white">

            <h1 className="text-3xl font-bold mb-10">
                Ready to Run?
            </h1>

            <a href="/track">

                <button
                className="w-40 h-40 rounded-full bg-[#F97316] text-white text-xl font-semibold shadow-lg hover:bg-[#FB923C] transition active:scale-95">
                    Start Run
                </button>

            </a>

        </div>
        </>
    )
}