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
        url="#"
      />
      <ExternalLink
        iconComponent={IconTwitter}
        title="Stay updated with our latest news and join the conversation."
        url="#"
      />
      <ExternalLink
        iconComponent={IconDiscord}
        title="Join our community."
        url="#"
      />
    </div>
  )
}

export default SocialLinks;