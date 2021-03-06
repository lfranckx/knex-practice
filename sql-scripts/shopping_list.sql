
-- This file should contain the SQL to create a new 
-- TYPE called grocery and a new TABLE called shopping_list. 
-- The table will contain 6 columns and you will need to 
-- decide which SQL data types to use for each column. 
-- We'll supply you with a second SQL file that you will 
-- use to seed the shopping_list table items.

-- The grocery TYPE should be an ENUM that can be one of the 
-- following possible values:
-- [x] Main
-- [x] Snack
-- [x] Lunch
-- [x] Breakfast

-- The shopping_list table should have the following 6 columns. 
-- [x] None of the columns should allow null values.

-- [x] A primary key column id
-- [x] A name column
-- [x] A price column that should not be a string and support 2 decimal places.
-- [x] A date_added column that should default to now().
-- [x] A checked column that should be a BOOLEAN with a default of false.
-- [x] A category column. Use the grocery type you created for this column.

DROP TYPE IF EXISTS grocery;
CREATE TYPE grocery AS ENUM (
    'Main',
    'Snack',
    'Lunch',
    'Breakfast'
);

CREATE TABLE IF NOT EXISTS shopping_list (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    price decimal(12, 2) NOT NULL,
    date_added TIMESTAMP DEFAULT now() NOT NULL,
    checked BOOLEAN DEFAULT FALSE,
    category grocery NOT NULL
);