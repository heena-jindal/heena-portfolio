export default async function handler(req, res) {
    try {
        const username = "heena03";

        const query = `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {

                    username

                    submitStats: submitStatsGlobal {
                        acSubmissionNum {
                            difficulty
                            count
                        }
                    }

                    userCalendar {
                        streak
                        totalActiveDays
                    }
                }
            }
        `;

        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Referer": `https://leetcode.com/u/${username}/`,
                "User-Agent": "Mozilla/5.0"
            },

            body: JSON.stringify({
                query,
                variables: {
                    username
                }
            })
        });

        if (!response.ok) {
            throw new Error("LeetCode request failed");
        }

        const result = await response.json();

        if (result.errors) {
            throw new Error(result.errors[0].message);
        }

        const user = result.data?.matchedUser;

        if (!user) {
            throw new Error("LeetCode user not found");
        }

        const stats = user.submitStats.acSubmissionNum;

        const getCount = (difficulty) => {
            const item = stats.find(
                stat => stat.difficulty === difficulty
            );

            return item ? item.count : 0;
        };

        const solved = {
            all: getCount("All"),
            easy: getCount("Easy"),
            medium: getCount("Medium"),
            hard: getCount("Hard")
        };

        res.status(200).json({
            username: user.username,

            solved,

            streak: user.userCalendar?.streak || 0,

            totalActiveDays:
                user.userCalendar?.totalActiveDays || 0,

            profileUrl:
                `https://leetcode.com/u/${username}/`
        });

    } catch (error) {

        console.error("LeetCode API Error:", error);

        res.status(500).json({
            error: "Unable to fetch LeetCode data"
        });
    }
}
