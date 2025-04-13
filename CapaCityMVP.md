CapaCity will be a tool which enables Airport planners to forecast the capacity of the key elements of an airport, based upon the capability of the airports facilities and maintenance works planned. The demand can then be overlaid via uploaded information (in the form of flight schedules), to then support analysis of over facility utilisation - via analysis that provides insights and oversights of any issues identified, or potential optimisations that can be made to utilise the capacilities better. Or even make recommendations on what facility developments could be made and have the biggest impact.

This tool will be a web application that is supported by a relational database. It will have AI workflows/agents built into the tool to support users and maintain it. It will also utilise AI to provide oversight/insight analysis of the outputs. The tool will be built in a way that all of the functions within it, will be tools that an overall AI Agent can use to answer problem statements shared by the user - which will have a chatbot interface that the airport planners can interact with.

MVP Scope
The MVP for the tool will be to create the frontend, backend & database. Create the enablement for the user to set a base airport location and then create a repository of stands. There needs to be a stand maintanance section, where requests to perform maintenance on the stands can be raised. 

There should be an authentication method set up and a PostgresSQL DB created in Supabase, with a user table created to set up access accounts, with CRUD access.

A git hub repo should be created to track the changes and store the code of the solution.

Initial pages will be a homepage, a login page and then a configuration page, where the user can select an airport to be the base airport. There needs to be a stands page, which shows any stands created and provides the ability to create and edit them. In addition, a maintenance page should be created which enables users to raise maintenance requests and show any existing active or inactive requests.

The interface should be based around airport signage, which is primarily black, with yellow highlights and white font colour - may need to confirm what font is used. We should also use the icons that are used on airport signs.

The layout should clean and modern, with a menu always visable to allow easy navigation.

- Frontend - DONE
- Supabase (Authentication & PostgreSQL DB) - Initiated
- Backend - Initiated - DONE
- Initial Pages - Initiated
- git repo
- UI - Initiated - Icons and yellow accents

Release 1
Building upon the MVP, then there should be an output which shows the capacity for the airport stands. Showing the key statistics over a period of time. So the airport has clear visibility of its capacity.

Release 2
Next step will be to build out a repository of airports in the tool and create a table in the DB that the users can select from for their base location, all European airports should be loaded in (you'll have to look online for the list of airports) with the industry standard references also stored (I think its IATA & ICAO) so when standard references are used, we know which airport is being referred too.

Release 3
Then there needs to be the ability to upload flight schedules or create flights to outline the demand. So there will be an import tool which can accept excel or csv files.

This tool will need to have certain minimum requirements for data logged, which will ensure that the uploaded data is structured correctly - this could be an AI agent? Take your guidance.

Release 4
Add the ability to create terminals and piers for the airport (build relationships as well)

Release 5
Add the ability to add airlines to a repository at the airport

Release 6
Create a repository of airlines in a DB with standard reference codes stored for reference - include a location option to outline which terminal they are based in.

Release 7
Add adjacancy info tracking on stands

Release 8
Then a stand allocation tool needs creating, that can take the capability of stands, the maintenance planned, adjacencies, airline locations and then the demand and then allocate the demand the stands available. To output analysis which shows the capacity vs demand. Test with minor test information.

Release 9
Gantt Chart output to show the outputs of the analysis - test with minimul information.

Release 10
Plane repository - with standard references and data stored

Release 11
Add a map layout for stands and location storing of stands

Release 12


Baggage
Buses
Gates
Check-in
Towing