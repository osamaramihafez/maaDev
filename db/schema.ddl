-- This is a temporary db for the soccer league. Will have to eventually migrate the data from the db.

CREATE TABLE program(
  -- This is so that we can request all of the program names.
  
  pgid SERIAL PRIMARY KEY, 
  name VARCHAR(50) UNIQUE, --The name of the program, to be referenced in other tables.
  individualPrice INTEGER NOT NULL, -- Tells us the pricing for an individual. (0 if no individuals)
  groupPrice INTEGER DEFAULT 0, -- Tells us the pricing for a group. (0 if no groups)
  gender VARCHAR(10) NOT NULL,
  capacity INTEGER DEFAULT 0, -- Tells us the maximum capacity for a program, 0 if no capacity
  numRegistered INTEGER DEFAULT 0, -- The # of people registered for a programs
  photo BOOLEAN DEFAULT FALSE -- Tells us if we need registrants to upload photos for individual registration.
);

CREATE TABLE member
(
  -- This is so that we can store and retain information about members, it also allows us to filter them by program, gender, age... etc.

  id SERIAL PRIMARY KEY,
  fName VARCHAR(30) NOT NULL, -- First name
  lName VARCHAR(30) NOT NULL, -- Last name
  phone VARCHAR(20) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  birthday DATE NOT NULL,
  email VARCHAR(50) NOT NULL,
--   Also need to figure out how to store an image in this location (or atleast a reference to the image.) 

  UNIQUE (fname, lname, phone) --We will search for members based on a combination of these three names
);

CREATE TABLE programMember (
  -- Each member can be registered for a program.

  member INTEGER,
  program VARCHAR(50),
  paid BOOLEAN,

  constraint pmPk primary key (member, program),
  constraint memberFk foreign key (member) references member(id) on update cascade on delete cascade,
  constraint programFk foreign key (program) references program(name) on update cascade on delete cascade
);


CREATE TABLE division(
  -- Each program can have sub-divisions 
  division INTEGER NOT NULL,
  program VARCHAR(50) NOT NULL,
  capacity INTEGER NOT NULL,

  constraint programDivFk foreign key (program) references program(name) on update cascade on delete cascade,
  constraint divPk primary key (division, program) 
);

CREATE TABLE team
(
  teamId SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  division INTEGER NOT NULL,
  program VARCHAR(50) NOT NULL,
  captain INTEGER NOT NULL,
  paid BOOLEAN DEFAULT 'false',
  points INTEGER  DEFAULT 0,
  fixturesPlayed INTEGER   DEFAULT 0,
  wins INTEGER  DEFAULT 0,
  losses INTEGER  DEFAULT 0,
  draws INTEGER  DEFAULT 0,
  goalsFor INTEGER  DEFAULT 0,
  goalsAgainst INTEGER   DEFAULT 0,
  goalDifferential INTEGER   DEFAULT 0,
  
  -- UNIQUE (name, division, program),
  UNIQUE (name, program, captain),
  UNIQUE (program, captain, division),
  UNIQUE (program, captain),
  UNIQUE (name, program),
  constraint tDivisionFk foreign key (division, program) references division(division, program) on update cascade on delete cascade,
  constraint tCaptainFk foreign key (captain) references member(id) on update cascade on delete cascade
);

CREATE TABLE soccerPlayer(
  -- This table records the stats for individual league soccer players
  pid SERIAL PRIMARY KEY, 
  member INTEGER NOT NULL,
  program VARCHAR(50) NOT NULL,
  division INTEGER NOT NULL,
  team INTEGER NOT NULL,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellowCards INTEGER DEFAULT 0,
  redCards INTEGER DEFAULT 0,
  appearances INTEGER DEFAULT 0,

  constraint memberPlayerFk foreign key (member) references member(id) on update cascade on delete cascade,
  constraint playerDivisionFk foreign key (division, program) references division(division, program) on update cascade on delete cascade,
  UNIQUE (member, program),
  CONSTRAINT pteamFk FOREIGN KEY (team) REFERENCES team(teamId) on update cascade on delete cascade

);

-- insert into program (name, individualPrice, groupPrice, gender, capacity, registered) values ('active club', 113, 980, 0, 'Both', 0, 0);
-- insert into program (name, price, gender, capacity, registered) values ('ramadan wellness program', 0, 'Female', 0, 0);
insert into program (name, individualPrice, groupPrice, gender, capacity, photo) values ('mens over 18 soccer league covid 1', 113, 980, 'Male', 200, TRUE);
insert into division (division, program, capacity) values (1, 'mens over 18 soccer league covid 1', 16);
-- insert into division (division, program, capacity) values (2, 'mens over 18 soccer league covid 1', 4);
-- insert into division (division, program, capacity) values (3, 'mens over 18 soccer league covid 1', 4);
-- insert into division (division, program, capacity) values (4, 'mens over 18 soccer league covid 1', 4);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO maadmin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO maadmin;
