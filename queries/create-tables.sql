CREATE TABLE IF NOT EXISTS deals (
    id uuid,
    owner uuid,
    timestamp timestamptz
);

CREATE TABLE IF NOT EXISTS users (
    id uuid
);
