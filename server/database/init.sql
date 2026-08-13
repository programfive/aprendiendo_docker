-- Docker crea y selecciona automáticamente la base de datos definida en MYSQL_DATABASE

CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some dummy data for testing
INSERT INTO todos (title, completed) VALUES 
('Aprender Docker', false),
('Diseñar base de datos MySQL', true),
('Construir backend en Node.js', false),
('Crear frontend minimalista', false);
