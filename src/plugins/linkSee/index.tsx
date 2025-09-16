/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { definePluginSettings } from "@api/Settings";
import { classNameFactory } from "@api/Styles";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const cl = classNameFactory("vc-linksee-");

const settings = definePluginSettings({
  embedTitles: {
    type: OptionType.BOOLEAN,
    description: "Include the title of embeds in the link (almost always masked)",
    default: true
  },
  showLink: {
    type: OptionType.BOOLEAN,
    description: "Show the target link instead of \"Masked\"",
    default: false
  }
});

export default definePlugin({
  name: "LinkSee",
  description: "Adds a distinction between masked links and regular links.",
  authors: [Devs.fearless],
  settings,

  patches: [
    {
      find: "Z.MASKED_LINK",
      replacement: {
        match: /r\.jsx\)\(s\.eee/,
        replace: "r.jsx)($self.LinkBadge(s.eee)",
      }
    }

  ],

  LinkBadge(original) {
    const { embedTitles, showLink } = settings.use(["embedTitles", "showLink"]);
    return e => {
      const embedTitleLink = e?.className?.includes("embedTitleLink");

      if (embedTitleLink && !embedTitles) return original(e);
      if (e.title === e.href) return original(e);
      if (e?.children?.$$typeof !== undefined) return original(e);
      return (
        <>
          {original(e)}
          <span className={cl("badge")}>{showLink ? e.href : "Masked"}</span>
        </>
      );
    };
  }
});
