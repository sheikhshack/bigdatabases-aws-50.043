USE mysql;

CREATE USER 'admin'@'%' IDENTIFIED BY '50043Admin';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'% 'WITH GRANT OPTION;
FLUSH PRIVILEGES;