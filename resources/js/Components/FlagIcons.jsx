import React from 'react';

export const FlagEN = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className={className}>
        <clipPath id="s">
            <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
);

export const FlagVI = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className={className}>
        <rect width="3" height="2" fill="#da251d" />
        <polygon points="1.5,0.4 1.617,0.762 2,0.762 1.69,0.988 1.809,1.35 1.5,1.125 1.191,1.35 1.31,0.988 1,0.762 1.383,0.762" fill="#ffff00" />
    </svg>
);
