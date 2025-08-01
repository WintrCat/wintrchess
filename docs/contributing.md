# ☕ Contributing

If you'd like to contribute to the WintrChess platform, you can get started by reading this guide. Thank you for considering a contribution!

## 🏰 The State of WintrChess

This is a project that I worked on throughout my spare time for 14 months. I learnt a lot of things on the go while building this, and it was (mostly) super fun!

I think I've left the project in an *okay...* state, but there are still a lot of features or improvements that can be made from here. I've compiled a list of what the community has asked for the most:

- Algorithm that estimates a player's performance rating "Elo" in a game.
- A better accuracy algorithm; I still receive a lot of feedback saying it's too high.
- The news article editor in the internal dashboard kind of sucks. The system for adding images is super duct tape.
- Some actual piece themes for the settings page, since we only have the default one right now.
- Performance metrics (accuracies etc.) for each stage of the game; opening, middlegame, endgame...
- Ability to explore a Chess masters database when analysing opening moves.
- Flipping the board to match the viewpoint of the user, when selecting games from Chess.com / Lichess.
- More documentational content for the Help Center page. Currently, the only tutorial is on loading a game for analysis.

One thing that I left in the code but never had time to implement is the "Risky" classification, which is given to moves that have good win rates in the database, but are objectively dubious according to the engine. The icon and constant values are already there, but the classifier does not distribute it.

There were also a bunch of larger systems on the roadmap; hopefully we can all work together on building these ☕

- A puzzles page; this was suggested a lot, but I'm not immediately sure what would be nice to have on it that's any different from Lichess for example.
- A "lessons" page where you can train / learn openings, tactics, endgames etc. Not idea how to produce the content.
- Explanations on Chess moves, like Chess.com's coach. This may be a monumental challenge! I would love to see something on par with or even better than Chess.com's.
- Automated classifier testing? A large set of pre-evaluated games to test the brilliant move algorithm on etc.

If you'd like to contribute to WintrChess, but don't know where to start, this list may give you some inspiration 💙

## 📋 Code Style

There is a particular coding style that I've used across this project that I would hope you can adhere to in your contributions. At the root of the project there is `eslint.config.js`, so you can use ESLint to help match code style. You can also have a look at other code in the project if you'd like :)

Some other weird things I got into the habit of:

```tsx
// Sorting imports

// External libraries first (react at top if applicable)
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chess } from "chess.js";

// Then imports from shared, and elsewhere in the same package
import { PieceColour } from "shared/constants/PieceColour";
import { archiveGame } from "@/lib/gameArchive";

// Then props for component & CSS modules
import AwesomeThingProps from "./AwesomeThingProps";
import * as styles from "./AwesomeThing.module.css";

// Then asset imports if you have any
import iconLogo from "@assets/img/logo.svg";

// Component should be normal function, not arrow function
function AwesomeThing({ children }: AwesomeThingProps) {
    return <img src={iconLogo} />;
}

// Component should be default export
export default AwesomeThing;
```

If you can, try not to use classes unless you absolutely have to - use functions and interfaces!

## 🎋 Opening a Pull Request

Pull request / commit names generally follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary):

```
<type of change>(<optional scope>): <present tense description>

feat(fe): add cool new feature
docs: add funny message
```

The scopes are `fe` (Frontend), `be` (Backend), and `sh` (Shared). You can omit the scope if multiple packages or root-level files are substantially changed.

If your changes deal in personal information, please make sure you describe what kind of data is collected, and what security considerations you've taken into account. This makes it easier to make any necessary amendments to the privacy policy thereafter.

Please be nice when discussing things in pull requests! 💙

## 🔐 Reporting security vulnerabilities

If you have found a security vulnerability, please report it responsibly! Some that do not cause that much damage can be opened as an issue, though if you have found a critical vulnerability that could, for example, affect the safety of user information, please instead send an email to:

[contact@wintrchess.com](mailto:contact@wintrchess.com)