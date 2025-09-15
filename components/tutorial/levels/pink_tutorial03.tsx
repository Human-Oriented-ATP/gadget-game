import { InteractiveLevel, TUTORIAL_SETTINGS } from "../InteractiveLevel";
import { PinkHole } from "../TutorialSetup";

export const pink_tutorial03: InteractiveLevel = {
    settings: TUTORIAL_SETTINGS,
    steps: [{
        content: {
            jsx: <>Try this one on your own! <br />
                The ordering of the numbers below <PinkHole />is important as well.</>,
        },
    }]
};
