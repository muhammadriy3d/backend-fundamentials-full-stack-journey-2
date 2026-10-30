// A simple command line interface (CLI)
// to fetch the recent activity of a GitHub user
// and display it in the terminal

// 1. get the args
const username = process.argv[2];

if (!username) {
  console.error("Please enter a username.");
  process.exit(1);
}

getUserEvents(username).catch((error) => {
  console.error("Failed to fetch events:", error.message);
  process.exitCode = 1;
});

async function getUserEvents(username) {
  const events = await fetchApi(
    `https://api.github.com/users/${username}/events`,
  );

  if (events.length === 0) {
    console.log(`${username} has no recent public activity.`);
    return;
  }

  for (const event of events) {
    console.log(`- ${event.type} in ${event.repo.name}`);
  }
}

async function fetchApi(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "gh-activity-cli",
    },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API responded with ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
