-- Create the database
CREATE DATABASE wastesorting;
\c wastesorting

-- Create the 'users' table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL CHECK (role IN ('Admin', 'User')),
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    gender CHAR(1) CHECK (gender IN ('f', 'm')),
    urlPhoto TEXT
);

-- Create the 'machine' table
CREATE TABLE machine (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    state VARCHAR(50) DEFAULT 'on' CHECK (state IN ('on', 'off', 'maintenance', 'inOrder')),
    sorted BOOLEAN DEFAULT FALSE,
    estimatedTime TIME
);

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    recyclable BOOLEAN DEFAULT FALSE
);

CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cat_id INT REFERENCES category(id) ON DELETE CASCADE,
    url_photo TEXT
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    machine_id INT REFERENCES machine(id) ON DELETE SET NULL,
    confirmed BOOLEAN DEFAULT FALSE,
    maintained BOOLEAN DEFAULT FALSE , 
    list INT[]
);
CREATE TABLE last_report(
    machine_id INT UNIQUE REFERENCES machine(id) ON DELETE SET NULL,
    content TEXT 
);

CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    machine_id INT REFERENCES machine(id) ON DELETE SET NULL,
    content TEXT,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION notify_machine_addition()
RETURNS TRIGGER AS $$
BEGIN
    
    PERFORM pg_notify('machine_add', json_build_object(
        'id', NEW.id,
        'name', NEW.name,
        'latitude', NEW.latitude,
        'longitude', NEW.longitude,
        'state', NEW.state
    )::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER add_machine
AFTER INSERT ON machine
FOR EACH ROW
EXECUTE FUNCTION notify_machine_addition();

CREATE OR REPLACE FUNCTION notify_machine_update()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('machine_update', json_build_object(
        'id', NEW.id,
        'name', NEW.name,
        'latitude', NEW.latitude,
        'longitude', NEW.longitude,
        'state', NEW.state,
        'sorted', NEW.sorted,
        'estimatedTime', NEW.estimatedTime
    )::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_machine
AFTER UPDATE ON machine
FOR EACH ROW
EXECUTE FUNCTION notify_machine_update();

CREATE OR REPLACE FUNCTION notify_machine_deletion()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('machine_delete', json_build_object(
        'id', OLD.id,
        'name', OLD.name
    )::text);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_machine
AFTER DELETE ON machine
FOR EACH ROW
EXECUTE FUNCTION notify_machine_deletion();


INSERT INTO category (name, recyclable)
VALUES
    ('Plastic', TRUE),
    ('Paper', TRUE),
    ('Metal', TRUE),
    ('Glass', TRUE),
    ('Electronics', FALSE),
    ('Organic Waste', FALSE),
    ('Cloth', FALSE);


INSERT INTO materials (name, cat_id, url_photo)
VALUES
    ('Plastic Bottle', 1, '/images/materials/plastic_bottle.jpg'),
    ('Paper Bag', 2, '/images/materials/paper_bag.jpg'),
    ('Aluminum Can', 3, '/images/materials/aluminum_can.jpg'),
    ('Glass Bottle', 4, '/images/materials/glass_bottle.jpg'),
    ('Laptop', 5, '/images/materials/laptop.jpg'),
    ('Apple Peel', 6, '/images/materials/apple_peel.jpg'),
    ('Plastic Straw', 1, '/images/materials/plastic_straw.jpg'),
    ('Charger', 5, '/images/materials/charger.jpg'),
    ('Metal Spoon', 3, '/images/materials/metal_spoon.jpg'),
    ('Clothes', 7, '/images/materials/clothes.jpg'),
    ('Glass Jar', 4, '/images/materials/glass_jar.jpg');
