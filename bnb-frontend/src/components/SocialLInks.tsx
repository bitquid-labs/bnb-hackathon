import React from "react";
import ExternalLink from "components/ExternalLink";
import IconDocs from "assets/icons/IconDocs";
import IconTwitter from "assets/icons/IconTwitter";
import IconDiscord from "assets/icons/IconDiscord";


const SocialLinks: React.FC = () => {
  return (
    <div className="relative w-full mt-70 flex flex-col gap-20">
      <ExternalLink
        iconComponent={IconDocs}
        title="Explore BQ Labs Docs."
        url="https://docs.bqlabs.xyz/"
      />
      <ExternalLink
        iconComponent={IconTwitter}
        title="Stay updated with our latest news and join the conversation."
        url="https://twitter.com/BQ_Labs"
      />
      <ExternalLink
        iconComponent={IconDiscord}
        title="Join our community."
        url="https://discord.gg/GzC7DZDN"
      />
    </div>
  )
}

export default SocialLinks;