<?php
/**
 * Database Configuration for Visitor Management System
 * Place this file in your XAMPP htdocs/visitor-management/backend/config/ directory
 */

class Database {
    private $host = "localhost";
    private $db_name = "visitor_management";
    private $username = "root";  // Default XAMPP MySQL username
    private $password = "";      // Default XAMPP MySQL password (empty)
    private $conn;

    public function connect() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            echo "Connection Error: " . $e->getMessage();
            return null;
        }
        
        return $this->conn;
    }
}
?>