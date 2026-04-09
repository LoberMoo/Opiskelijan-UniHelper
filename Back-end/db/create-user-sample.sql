CREATE USER '(your username here)'@'localhost' IDENTIFIED BY '(your password here)';
GRANT ALL PRIVILEGES ON `HealthDiary` .* TO 'healthdiary'@'localhost';
FLUSH PRIVILEGES;
