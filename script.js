::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
::-webkit-scrollbar-track {
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.4);
    border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
    background: rgba(107, 114, 128, 0.6);
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
input[type=number] {
    -moz-appearance: textfield;
}

.glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(226, 232, 240, 0.8);
}
.dark .glass-card {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
}
.glass-card:hover {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(59, 130, 246, 0.4);
}
.dark .glass-card:hover {
    background: rgba(30, 41, 59, 0.7);
    border-color: rgba(96, 165, 250, 0.3);
}
