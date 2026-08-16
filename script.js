from pathlib import Path

src = Path("/mnt/data/Pasted text(7).txt")
text = src.read_text(encoding="utf-8")

# Keep the original portfolio logic through the closing of the DOMContentLoaded handler.
marker = "\n\nasync function loadGitHubData()"
base = text.split(marker, 1)[0]

new_api_code = r'''
 
// =============================================
// LIVE GITHUB + LEETCODE PROGRESS
// =============================================

async function loadProgressData() {
  try {
    const [githubResponse, leetcodeResponse] = await Promise.all([
      fetch("/api/github"),
      fetch("/api/leetcode")
    ]);

    if (!githubResponse.ok) {
      throw new Error("GitHub API request failed");
    }

    if (!leetcodeResponse.ok) {
      throw new Error("LeetCode API request failed");
    }

    const github = await githubResponse.json();
    const leetcode = await leetcodeResponse.json();

    // ---------------------------------------------
    // LEETCODE
    // ---------------------------------------------

    const leetcodeSolved = document.getElementById("leetcode-solved");
    const leetcodeEasy = document.getElementById("leetcode-easy");
    const leetcodeMedium = document.getElementById("leetcode-medium");
    const leetcodeHard = document.getElementById("leetcode-hard");
    const leetcodeProgressText =
      document.getElementById("leetcode-progress-text");

    if (leetcodeSolved) {
      leetcodeSolved.textContent = leetcode.solved.all;
    }

    if (leetcodeEasy) {
      leetcodeEasy.textContent = leetcode.solved.easy;
    }

    if (leetcodeMedium) {
      leetcodeMedium.textContent = leetcode.solved.medium;
    }

    if (leetcodeHard) {
      leetcodeHard.textContent = leetcode.solved.hard;
    }

    if (leetcodeProgressText) {
      leetcodeProgressText.textContent =
        `${leetcode.solved.all} solved • ${leetcode.streak} day streak`;
    }

    // Update the LeetCode link automatically.
    const leetcodeLinks =
      document.querySelectorAll('a[href*="leetcode.com"]');

    leetcodeLinks.forEach(link => {
      link.href = leetcode.profileUrl;
    });

    // ---------------------------------------------
    // GITHUB
    // ---------------------------------------------

    const githubRepos = document.getElementById("github-repos");
    const githubFollowers =
      document.getElementById("github-followers");
    const githubStars = document.getElementById("github-stars");

    if (githubRepos) {
      githubRepos.textContent = github.publicRepos;
    }

    if (githubFollowers) {
      githubFollowers.textContent = github.followers;
    }

    if (githubStars) {
      githubStars.textContent = github.totalStars;
    }

    // ---------------------------------------------
    // RECENT GITHUB REPOSITORIES
    // ---------------------------------------------

    const repoContainer =
      document.getElementById("github-repositories");

    if (repoContainer) {
      repoContainer.innerHTML = "";

      github.repositories.slice(0, 4).forEach(repo => {
        const repoElement = document.createElement("a");

        repoElement.href = repo.url;
        repoElement.target = "_blank";
        repoElement.rel = "noopener noreferrer";
        repoElement.className = "github-repo";

        repoElement.innerHTML = `
          <div class="github-repo-info">
            <strong>${repo.name}</strong>
            <small>${repo.language || "Project"}</small>
          </div>

          <span>⭐ ${repo.stars}</span>
        `;

        repoContainer.appendChild(repoElement);
      });
    }

    const githubStatus =
      document.getElementById("github-activity-status");

    if (githubStatus) {
      githubStatus.textContent = "Updated automatically";
    }

  } catch (error) {
    console.error("Progress data error:", error);

    const githubStatus =
      document.getElementById("github-activity-status");

    if (githubStatus) {
      githubStatus.textContent = "Live data unavailable";
    }

    const leetcodeProgressText =
      document.getElementById("leetcode-progress-text");

    if (leetcodeProgressText) {
      leetcodeProgressText.textContent = "Live data unavailable";
    }
  }
}

loadProgressData();
'''

final_text = base.rstrip() + "\n" + new_api_code.strip() + "\n"

out = Path("/mnt/data/script_live_progress.js")
out.write_text(final_text, encoding="utf-8")

print(f"Created: {out}")
print(f"Lines: {len(final_text.splitlines())}")
