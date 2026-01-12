= PostgreSQL <sec:postgresql>

== Solution

=== Design and Motivations
The PostgreSQL Database follows the Entity-Relationship (ER) design. The data is organised as follows:
 - *Table `movies`:* the core entity, it stores the essential data related to the movies with a unique `id` that serves as a foreign key across the other tables.

 - *Key relationships and Design patterns:* With the `movies` tables as the core of the Database, we will design most of the relationships from this table. The E-R design offers different types of relationships:
 - *Many to Many:* to represent this relationship we need a table in the middle of our jucntion because, for example, *Many* can perform in *Many* movies, so we create a table called `movies_have_actors` in which are stored the `movie_id` the `actor_id` as well as the `role` the actor has in the movie, these three fields all together create a composite primary key for the jucntion table. Similarly, we create the tables:
 - `movie_has_genres`
 - `movies_have_countries`
 - `movies_have_studios`

 - *One to Many:* Several tables maintain this type od relationship between the `movies` table, for example the `crew` table stores the `name` and `role` of a person that has been part of the movie crew (producer, stunt, music composer ...), as well as the movie `id`, all of theese fields create a composite primary key for the table. This type of relationship is used to represent other data, such as:
 - `releases`
 - `country`
 - `languages`
 - `themes`

 - *One to One:* This type of relationship is used only once in the Database for the `posters` table, which contains a letterbox link to a movie poster, and we are sure that one movie has only one poster, so we can use the movie `id` as both primary and foreign key.

=== Implementation
For the implementations, we used the basic data types PostgreSQL offers:
 - *Integer:* for the IDs and other numbers (the year, for example).
 - *Numeric:* for the floating point numbers (`rating` column in `movies` table).
 - *Varchar:* for the strings such as names, roles and genre names, we used variable length (255, 999 or 50).
 - *Text:* for strings such as `description` and `tagline` because we do not know the dimension of the description or tagline of a movie, and we can not assume that it remains under `999` characters.
 - *Date:* for the dates, for example, in the `releases` table.
 - *Boolean:* used in the `oscar_awards` table to differentiate the nominees from the actual winner (false only nominated, true winner).

#figure(image("../img/banana_stem_structure.png"))
 
== Issues
=== Missing Indexes
While primary keys automatically create indexes, the database schema doesn't show explicit indexes on frequently queried foreign key columns, which could impact query performance on large datasets.

== Requirements
We adopted PostgreSQL version 18, the latest available when we started the project.

== Limitations
