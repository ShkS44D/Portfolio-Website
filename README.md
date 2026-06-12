# Muhammad Saad Ahmed - S44D

A responsive, interactive personal portfolio website for Muhammad Saad Ahmed, a Cybersecurity Professional specializing in penetration testing, vulnerability assessment, and security tool development. This static website showcases technical skills, featured projects, professional experience, and includes a live interactive network tool. 

## ✨ Features

* **Interactive Particle Canvas:** The hero section features a dynamic, network-graph style particle background.
* **Live Network Tools:** Includes a built-in, terminal-themed DNS lookup tool. It performs live forward (A record) and reverse (PTR) DNS lookups using the Google Public DNS API. 
* **Custom UI Elements & Animations:** The interface includes a custom animated cursor, text glitch effects, a typewriter greeting, and scroll-triggered reveal animations utilizing the `IntersectionObserver` API.
* **Animated Data:** The "About" section features statistic counters that animate dynamically as the user scrolls them into view. 
* **Working Contact Form:** The contact section is integrated with Formspree for live, asynchronous message submission with built-in client-side validation. 
* **Fully Responsive:** The layout utilizes CSS Grid and Flexbox to ensure seamless scaling across desktop, tablet, and mobile devices, along with a custom mobile navigation drawer.

## 🛠️ Technologies Used

* **Markup:** HTML5
* **Styling:** Custom CSS3 with extensive use of CSS variables for theming, glassmorphism, and neon-glow effects.
* **Scripting:** Vanilla JavaScript (ES6+).
* **Typography:** Google Fonts (Orbitron for displays, Rajdhani for headings/body, and Share Tech Mono for code elements).

## 📂 Highlighted Projects Displayed

The portfolio highlights several cybersecurity and development projects:
* **Sentinel AI:** A Network Intrusion Detection System built with Python and Streamlit, utilizing a Random Forest model.
* **Solidity Sentinel:** A Flask-based Ethereum smart contract security auditor using Slither.
* **VulnScanner:** A multi-threaded web and network scanner integrating NVD CVE lookups.
* **Vanguard SIEM:** A lightweight SIEM for log correlation and threat detection.

## 🚀 Getting Started

Since this is a static website, no complex build tools or backend servers are required to run it locally.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/ShkS44D/Portfolio-Website.git](https://github.com/ShkS44D/Portfolio-Website.git)
   ```
2. **Navigate to the directory:**
   ```bash
   cd Portfolio-Website
   ```
3. **Run the site:**
   Simply open the `index.html` file in your preferred web browser. Alternatively, you can use an extension like VS Code Live Server to run it on a local development port.

## ⚙️ Configuration

**Contact Form Setup:**
The contact form is currently configured to send messages to a specific Formspree endpoint. To receive emails to your own inbox:
1. Create a free account at [Formspree](https://formspree.io/).
2. Create a new form and copy your unique endpoint URL.
3. Open `index.html` and locate the `<form id="contact-form">` tag in the Contact section.
4. Replace the `action="https://formspree.io/f/xojzeqkd"` attribute with your new Formspree URL.

## 📄 License

© 2026 Saad Ahmed. All rights reserved.
