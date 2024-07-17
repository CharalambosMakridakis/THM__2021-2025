CREATE DATABASE IF NOT EXISTS gradedb;
USE gradedb;

CREATE TABLE IF NOT EXISTS grade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modulename VARCHAR(255),
    grade INT,
    crp INT,
    grade_weight FLOAT,
    grade_index VARCHAR(255),
    grade_owner VARCHAR(255)
);

INSERT INTO grade (modulename, grade, crp, grade_weight, grade_index, grade_owner) VALUES ('CA', 100, 6, 1, 'dssSdf-S2ds-Gsvcs', 'Lukas');
INSERT INTO grade (modulename, grade, crp, grade_weight, grade_index, grade_owner) VALUES ('DevOps', 100, 3, 0.5, 'lOs233d-1337xD-LoLSWAG', 'Lukas');
INSERT INTO grade (modulename, grade, crp, grade_weight, grade_index, grade_owner) VALUES ('LA', 0, 6, 1, 'GlnT-gGbG-koLx', 'Lukas');