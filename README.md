# The Gadget Game

## Setup instructions

1. You need to have the package manager `npm` and `Node.js` installed.
2. Open a console and navigate to this directory.
3. Run `npm ci` which should install the required packages. 
4. Run `npm run dev` to run the development version of the game. 
5. Click the link (which is probably something like `http://localhost:3000`) to access the game in a web browser. 

You can also run unit tests using `npm run test`.

### Database setup

Errors around database access can be ignored for those not wishing to integrate a database.
However, if you want to store questionnaire data and user solution analytics, the server can
connect to a PostgreSQL database.

* If using Vercel, set up a PostgreSQL integration and connect it to the project.
* If self-hosting, set the environment variable `GADGET_SELFHOST=true`,
  and specify environmental variables required for establishing a connection
  (documented at https://www.postgresql.org/docs/current/libpq-envars.html
  and https://node-postgres.com/apis/client).
  These variables can also be set using `.env.local`.

Migrations are automatically run for production vercel deployments, or for those self-hosting
by using `npm run build` or `npm run migrate` (standalone).

## Writing problem files

You can create your own problem files and put them in the folder `problems` to add them to the game. They then automatically appear on the page `internal` under Unlisted Problems. Take a look at the files already present in that folder to learn more about the syntax. The following colours are available: 

| Abbreviation | Colour |
| ------------ | ----- |
| r | red |
| y | yellow | 
| g | green | 
| b | blue |
| w | white |
| bl | black | 
| o | orange | 
| p | purple | 
| c | cyan | 

Appending `striped_` will give the cell black stripes and counts as different colour. For example, a gadget could be given by `striped_r(A) :- b(A).` There are many examples of problem files in the `problems` folder, take some inspiration! 

## Configuring a study

The folder `study_setup` contains configuration files for setting up Gadget Game experiments. They can be used to specify which problems will be shown to the participants and in which order, how long they need to wait until they can skip a problem etc. It is possible to set up A/B tests by using two separate configuration files and making sure that group A receives the link pointing to the study with configuration A and vice-versa for group B.  

## Architecture

The Gadget Game is a full-stack web app. There is a database (PostgreSQL) and functions running on a server (Node.js) that can interact with the database. On the frontend side, the game uses React and Typescript algonside Tailwind for styling. The game crucially relies on the library [ReactFlow](https://reactflow.dev/) for node-edge diagrams and uses [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction) for managing the game state. 

### Key Concepts 

What a gadget is should become clear from playing the [tutorial](https://gadget-game.vercel.app/showcase). A gadget contains coloured cells which can either be in an input or output position. The cells in turn contain slots which can  be empty or be filled with a number or letter. Every cell has a source or target connector which is where the player draws a line from or to when making a connection.  

The words "node" and "edge" in the source code always refer to the respective concepts in ReactFlow. Thus, gadgets correspond to nodes and the connections between gadgets correspond to edges. Note that there are two different types of connections: the ones connecting different gadgets as well as the ones connecting different slots within one gadget. The latter are called `InternalConnection` in the code.

### State Management 

The game has a global state which is created in `components/game/FlowContainer.tsx`. All child components can access it through the hook `useGameStateContext`. The state consists of a hierarchy of slices (`lib/state/slices`) which correspond e.g. to the state of edges or nodes in the ReactFlow diagram. The `history` slice contains a log that records all (logical) interactions the player makes with the game. This log is important for sending player interaction data to the server. It is also used for determining which nodes and edges currently exist before running the unification algorithm. 
