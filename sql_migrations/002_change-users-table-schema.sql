ALTER TABLE Users
    DROP COLUMN ID,
    ADD COLUMN id SERIAL PRIMARY KEY;