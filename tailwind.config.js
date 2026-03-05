// External Tailwind configuration used when building with the CLI or when
// loading via CDN. The same values previously inlined in <script> tags are
// defined here so they can be tracked separately and reused in build tools.

window.tailwind = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#FFD700", // Gold
                secondary: "#0033A0", // Deep Blue
                "background-light": "#abb1be", // dark navy primary background
                "background-dark": "#0F172A",
                "surface-light": "#FFFFFF",
                "surface-dark": "#1E293B",
                "text-light": "#F9FAFB", // white text on dark
                "text-dark": "#1F2937",
            },
            fontFamily: {
                display: ["Montserrat", "sans-serif"],
                accent: ["Playfair Display", "serif"],
            },
            borderRadius: {
                DEFAULT: "1rem",
                xl: "1.5rem",
                "2xl": "2rem",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
        },
    },
};
