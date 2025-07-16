import { InteractiveLevel } from "./InteractiveLevel";
import { tutorial01 } from "./levels/tutorial01";
import { tutorial01a } from "./levels/tutorial01a";
import { tutorial02 } from "./levels/tutorial02";
import { tutorial03 } from "./levels/tutorial03";
import { tutorial04 } from "./levels/tutorial04";
import { tutorial05 } from "./levels/tutorial05";
import { tutorial06 } from "./levels/tutorial06";
import { pink_tutorial04 } from "./levels/pink_tutorial04";
import { pink_tutorial05 } from "./levels/pink_tutorial05";
import { pink_tutorial01 } from "./levels/pink_tutorial01";
import { pink_tutorial02 } from "./levels/pink_tutorial02";
import { pink_tutorial03 } from "./levels/pink_tutorial03";

const firstLevelAfterTutorial: InteractiveLevel = {
    steps: [{
        content: {
            jsx: <div>
                <p>You&apos;ve finished the tutorial! Click the Help button if you get stuck.</p>
            </div>,
        }
    }]
}

export const interactiveTutorialLevels: Map<string, InteractiveLevel> = new Map([
    ["tutorial01", tutorial01],
    ["tutorial01a", tutorial01a],
    ["tutorial02", tutorial02],
    ["tutorial03", tutorial03],
    ["tutorial04", tutorial04],
    ["tutorial05", tutorial05],
    ["tutorial06", tutorial06],
    ["pink_tutorial01", pink_tutorial01],
    ["pink_tutorial02", pink_tutorial02],
    ["pink_tutorial03", pink_tutorial03],
    ["pink_tutorial04", pink_tutorial04],
    ["pink_tutorial05", pink_tutorial05],
    ["t_e10", firstLevelAfterTutorial],
])