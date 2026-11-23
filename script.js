document.addEventListener("DOMContentLoaded", () => {
  // UI Elements
  const form = document.getElementById("readmeForm");
  const rawMarkdownInput = document.getElementById("rawMarkdown");
  const markdownPreview = document.getElementById("markdownPreview");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  let activeTab = "form";

  // Tab Switcher
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      activeTab = btn.dataset.tab;
      document.getElementById(`${activeTab}View`).classList.add("active");

      if (activeTab === "raw") {
        rawMarkdownInput.value = generateMarkdownFromForm();
      } else {
        updateFromMarkdownText(rawMarkdownInput.value);
      }
      renderPreview();
    });
  });

  // Generate Markdown string from Form Inputs
  function generateMarkdownFromForm() {
    const name = document.getElementById("name").value.trim();
    const title = document.getElementById("title").value.trim();
    const githubUser = document.getElementById("githubUser").value.trim();
    const about = document.getElementById("about").value.trim();
    const twitter = document.getElementById("twitter").value.trim();
    const linkedin = document.getElementById("linkedin").value.trim();

    // Selected tech badges
    const selectedTechs = Array.from(
      document.querySelectorAll('#skillsContainer input[type="checkbox"]:checked')
    ).map((cb) => cb.value);

    let md = "";

    // Header
    if (name) md += `# Hi there, I'm ${name} 👋\n\n`;
    if (title) md += `### ${title}\n\n`;

    // About Section
    if (about) {
      md += `${about}\n\n`;
    }

    // Tech Stack Badges
    if (selectedTechs.length > 0) {
      md += `## 🛠 Tech Stack\n\n`;
      const badges = selectedTechs
        .map(
          (tech) =>
            `![${tech}](https://img.shields.io/badge/-${encodeURIComponent(
              tech
            )}-333333?style=flat-square&logo=${tech})`
        )
        .join(" ");
      md += `${badges}\n\n`;
    }

    // GitHub Stats
    if (githubUser) {
      md += `## 📊 GitHub Stats\n\n`;
      md += `![${githubUser}'s GitHub stats](https://github-readme-stats.vercel.app/api?username=${githubUser}&show_icons=true&theme=dark)\n\n`;
    }

    // Connect / Socials
    if (twitter || linkedin) {
      md += `## 📫 Connect with me\n\n`;
      if (twitter)
        md += `[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=flat-square&logo=twitter&logoColor=white)](https://twitter.com/${twitter}) `;
      if (linkedin)
        md += `[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/${linkedin}) `;
      md += `\n`;
    }

    return md;
  }

  // Update HTML Preview
  function renderPreview() {
    const markdownText =
      activeTab === "form" ? generateMarkdownFromForm() : rawMarkdownInput.value;
    markdownPreview.innerHTML = marked.parse(markdownText);
  }

  // Listeners for Live Updates
  form.addEventListener("input", () => {
    if (activeTab === "form") renderPreview();
  });

  rawMarkdownInput.addEventListener("input", () => {
    if (activeTab === "raw") renderPreview();
  });

  // Copy Markdown to Clipboard
  copyBtn.addEventListener("click", () => {
    const markdownText =
      activeTab === "form" ? generateMarkdownFromForm() : rawMarkdownInput.value;
    navigator.clipboard.writeText(markdownText).then(() => {
      const originalText = copyBtn.innerText;
      copyBtn.innerText = "Copied!";
      setTimeout(() => (copyBtn.innerText = originalText), 2000);
    });
  });

  // Download README.md File
  downloadBtn.addEventListener("click", () => {
    const markdownText =
      activeTab === "form" ? generateMarkdownFromForm() : rawMarkdownInput.value;
    const blob = new Blob([markdownText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Initial Render
  renderPreview();
});
