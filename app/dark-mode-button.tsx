"use client";

import { applyDarkMode } from './apply-dark-mode';

export default function DarkModeButton() {
    return (
        <button onClick={() => {
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                localStorage.theme = 'light';
            } else {
                localStorage.theme = 'dark';
            }
            applyDarkMode();
        }}>
            <SunIcon />
        </button>
    );
}

function SunIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 32 32"
            fill="currentcolor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="16"
                cy="16"
                r="6" />
            <g
                stroke="currentcolor"
                strokeWidth="3"
                strokeLinecap="round"
            >
                <path d="M 16,6 V 2" />
                <path d="M 16,30 V 26" />
                <path d="m 26,16 h 4" />
                <path d="M 26,6 23,9" />
                <path d="M 9,23 6,26" />
                <path d="M 26,26 23,23" />
                <path d="M 9,9 6,6" />
                <path d="M 2,16 H 6" />
            </g>
        </svg >
    );
}