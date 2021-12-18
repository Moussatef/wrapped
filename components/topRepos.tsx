import React from "react";
import { User, Stat } from "../types/common";
import BlockChart from "./blockChart";
import Hide from "./hide";

/**
 * Display the user's top repositories
 * @returns {element} div with text
 */
function TopRepos({ user, hidden, setHidden, showHide }: Stat) {
  const stat: keyof User = "topRepos";
  if (!user || !user.topRepos || hidden.includes(stat)) return <></>;

  // Formatting data in chart-friendly format
  const chartData = {
    names: user.topRepos.map((repo) => repo.name),
    namesWithOwner: user.topRepos.map((repo) => repo.nameWithOwner),
    isPrivate: user.topRepos.map((repo) => repo.isPrivate),
    url: user.topRepos.map((repo) => repo.url),
    avatarUrl: user.topRepos.map((repo) => repo.avatarUrl),
    stars: user.topRepos.map((repo) => repo.stars),
    values: user.topRepos.map((repo) => repo.contributions),
    colors: ["bg-orange-600/80", "bg-green-600/80", "bg-purple-600/80"],
  };

  return (
    <div className="text-left p-5 text-white group relative">
      <h1 className="text-gray-200 text-xl mb-2 font-medium">
        {
          [
            "You're an absolute beast",
            "You get around",
            "You code far and wide",
          ][~~(Math.random() * 3)]
        }
      </h1>
      <BlockChart chartData={chartData} />
      {showHide && (
        <Hide stat={stat} user={user} hidden={hidden} setHidden={setHidden} />
      )}
    </div>
  );
}

export default TopRepos;
