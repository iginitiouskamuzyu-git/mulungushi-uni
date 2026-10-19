CREATE DATABASE IF NOT EXISTS campus_crud;
USE campus_crud;

CREATE TABLE IF NOT EXISTS clubs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  description VARCHAR(255) NOT NULL,
  meeting_day VARCHAR(20) NOT NULL,
  president VARCHAR(120) NOT NULL,
  contact_email VARCHAR(150) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO clubs
(name, category, description, meeting_day, president, contact_email)
VALUES
('Coding Club', 'Technology', 'Learn programming', 'Friday', 'John Banda', 'coding@example.com'),
('Debate Club', 'Academic', 'Practice public speaking', 'Monday', 'Mary Phiri', 'debate@example.com'),
('Football Club', 'Sports', 'Play football together', 'Saturday', 'IGINITIOUS', 'football@example.com'),
('Drama Club', 'Arts', 'Perform plays and drama', 'Wednesday', 'Grace Tembo', 'drama@example.com'),
('Music Club', 'Arts', 'Learn and perform music', 'Tuesday', 'David Mwila', 'music@example.com'),
('Science Club', 'Academic', 'Explore science projects', 'Thursday', 'Ruth Bwalya', 'science@example.com'),
('Chess Club', 'Games', 'Play and learn chess', 'Friday', 'Paul Phiri', 'chess@example.com'),
('Photography Club', 'Arts', 'Learn photography', 'Saturday', 'Alice Zulu', 'photo@example.com'),
('Environment Club', 'Community', 'Promote environmental care', 'Monday', 'Brian Banda', 'environment@example.com'),
('Robotics Club', 'Technology', 'Build robotics projects', 'Wednesday', 'Esther Mwansa', 'robotics@example.com');