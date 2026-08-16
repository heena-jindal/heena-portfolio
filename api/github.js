export default async function handler(req, res) {
    try {
        const username = "heena-jindal";

        // Get GitHub profile
        const profileResponse = await fetch(
            `https://api.github.com/users/${username}`,
            {
                headers: {
                    Accept: "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2026-03-10"
                }
            }
        );

        if (!profileResponse.ok) {
            throw new Error("Failed to fetch GitHub profile");
        }

        const profile = await profileResponse.json();

        // Get public repositories
        const reposResponse = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
            {
                headers: {
                    Accept: "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2026-03-10"
                }
            }
        );

        if (!reposResponse.ok) {
            throw new Error("Failed to fetch GitHub repositories");
        }

        const repositories = await reposResponse.json();

        // Calculate total stars
        const totalStars = repositories.reduce(
            (total, repo) => total + repo.stargazers_count,
            0
        );

        // Return only the data our portfolio needs
        const data = {
            username: profile.login,
            name: profile.name,
            avatar: profile.avatar_url,

            followers: profile.followers,
            following: profile.following,
            publicRepos: profile.public_repos,

            totalStars,

            repositories: repositories
                .filter(repo => !repo.fork)
                .slice(0, 6)
                .map(repo => ({
                    name: repo.name,
                    description: repo.description,
                    language: repo.language,
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    updatedAt: repo.updated_at,
                    url: repo.html_url
                }))
        };

        res.status(200).json(data);

    } catch (error) {

        console.error("GitHub API Error:", error);

        res.status(500).json({
            error: "Unable to fetch GitHub data"
        });
    }
}
