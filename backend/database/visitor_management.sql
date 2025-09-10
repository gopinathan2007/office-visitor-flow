-- Visitor Management System Database Schema
-- Run this script in phpMyAdmin or MySQL command line to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS visitor_management 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE visitor_management;

-- Main visitors table
CREATE TABLE visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company VARCHAR(100) NOT NULL,
    host_name VARCHAR(100) NOT NULL,
    purpose TEXT NOT NULL,
    department VARCHAR(50) NOT NULL,
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    check_out_time TIMESTAMP NULL,
    duration INT NULL COMMENT 'Duration in minutes',
    status ENUM('active', 'checked_out', 'no_show') DEFAULT 'active',
    badge_number VARCHAR(20) NULL,
    photo_path VARCHAR(255) NULL,
    emergency_contact VARCHAR(20) NULL,
    vehicle_number VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_check_in_time (check_in_time),
    INDEX idx_email (email),
    INDEX idx_department (department),
    INDEX idx_host_name (host_name)
);

-- Visitor activity logs table for audit trail
CREATE TABLE visitor_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_id INT NOT NULL,
    activity_type ENUM('check_in', 'check_out', 'badge_issued', 'badge_returned', 'photo_taken') NOT NULL,
    description TEXT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NULL COMMENT 'For future user management',
    ip_address VARCHAR(45) NULL,
    
    FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE,
    INDEX idx_visitor_id (visitor_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_timestamp (timestamp)
);

-- Departments table for better organization
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    contact_person VARCHAR(100) NULL,
    contact_email VARCHAR(150) NULL,
    contact_phone VARCHAR(20) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_is_active (is_active)
);

-- Hosts/Employees table
CREATE TABLE hosts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) NULL,
    department_id INT NOT NULL,
    employee_id VARCHAR(50) NULL,
    position VARCHAR(100) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (department_id) REFERENCES departments(id),
    INDEX idx_email (email),
    INDEX idx_department_id (department_id),
    INDEX idx_employee_id (employee_id),
    INDEX idx_is_active (is_active)
);

-- Visitor types for categorization
CREATE TABLE visitor_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    requires_escort BOOLEAN DEFAULT FALSE,
    max_duration INT NULL COMMENT 'Maximum visit duration in minutes',
    badge_color VARCHAR(20) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System settings table
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NULL,
    description TEXT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Blacklisted visitors
CREATE TABLE blacklisted_visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NULL,
    name VARCHAR(100) NULL,
    reason TEXT NOT NULL,
    blacklisted_by VARCHAR(100) NULL,
    blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_is_active (is_active)
);

-- Insert default departments
INSERT INTO departments (name, description) VALUES
('Reception', 'Main reception and general inquiries'),
('Human Resources', 'HR department for employee-related matters'),
('Sales', 'Sales and business development'),
('Marketing', 'Marketing and communications'),
('Engineering', 'Technical and development teams'),
('Finance', 'Finance and accounting'),
('Operations', 'Operations and facilities management'),
('Management', 'Executive and senior management');

-- Insert default visitor types
INSERT INTO visitor_types (name, description, requires_escort, max_duration, badge_color) VALUES
('Business Visitor', 'Regular business meetings and appointments', FALSE, 480, 'blue'),
('Contractor', 'External contractors and service providers', TRUE, 960, 'yellow'),
('Interview Candidate', 'Job interview candidates', FALSE, 120, 'green'),
('Delivery Person', 'Package and food delivery', FALSE, 30, 'orange'),
('VIP Guest', 'Important guests and executives', FALSE, NULL, 'gold'),
('Vendor', 'Suppliers and vendors', FALSE, 240, 'purple'),
('Student/Intern', 'Students and interns', TRUE, 480, 'white'),
('Emergency Services', 'Police, fire, medical emergency', FALSE, NULL, 'red');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('max_visitors_per_day', '1000', 'Maximum number of visitors allowed per day'),
('default_visit_duration', '120', 'Default visit duration in minutes'),
('require_photo', 'false', 'Whether to require visitor photos'),
('require_id_scan', 'false', 'Whether to require ID card scanning'),
('auto_checkout_hours', '12', 'Auto checkout visitors after X hours'),
('send_host_notifications', 'true', 'Send email notifications to hosts'),
('visitor_badge_required', 'true', 'Whether visitor badges are required'),
('max_concurrent_visitors', '100', 'Maximum concurrent active visitors');

-- Create some sample data for testing
INSERT INTO hosts (name, email, phone, department_id, employee_id, position) VALUES
('Sarah Johnson', 'sarah.johnson@company.com', '+1-555-0101', 3, 'EMP001', 'Sales Manager'),
('Mike Wilson', 'mike.wilson@company.com', '+1-555-0102', 5, 'EMP002', 'Senior Developer'),
('Lisa Brown', 'lisa.brown@company.com', '+1-555-0103', 8, 'EMP003', 'General Manager'),
('Tom Anderson', 'tom.anderson@company.com', '+1-555-0104', 4, 'EMP004', 'Marketing Director'),
('Jennifer Davis', 'jennifer.davis@company.com', '+1-555-0105', 5, 'EMP005', 'Technical Lead'),
('Mark Thompson', 'mark.thompson@company.com', '+1-555-0106', 6, 'EMP006', 'Finance Manager'),
('Rachel Green', 'rachel.green@company.com', '+1-555-0107', 8, 'EMP007', 'Operations Director');

-- Create views for reporting
CREATE VIEW active_visitors_view AS
SELECT 
    v.id,
    v.name,
    v.email,
    v.phone,
    v.company,
    v.host_name,
    v.department,
    v.purpose,
    v.check_in_time,
    TIMESTAMPDIFF(MINUTE, v.check_in_time, NOW()) as minutes_in_building,
    d.name as department_name
FROM visitors v
LEFT JOIN departments d ON v.department = d.name
WHERE v.status = 'active'
ORDER BY v.check_in_time DESC;

CREATE VIEW daily_visitor_stats AS
SELECT 
    DATE(check_in_time) as visit_date,
    COUNT(*) as total_visitors,
    COUNT(CASE WHEN status = 'checked_out' THEN 1 END) as completed_visits,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_visits,
    COUNT(CASE WHEN status = 'no_show' THEN 1 END) as no_shows,
    AVG(duration) as avg_duration_minutes,
    MIN(check_in_time) as first_checkin,
    MAX(check_in_time) as last_checkin
FROM visitors
WHERE check_in_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(check_in_time)
ORDER BY visit_date DESC;

CREATE VIEW department_visitor_stats AS
SELECT 
    v.department,
    COUNT(*) as total_visitors,
    COUNT(CASE WHEN v.status = 'checked_out' THEN 1 END) as completed_visits,
    AVG(v.duration) as avg_duration_minutes,
    MAX(v.check_in_time) as last_visitor
FROM visitors v
WHERE v.check_in_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY v.department
ORDER BY total_visitors DESC;

-- Create stored procedures for common operations
DELIMITER //

CREATE PROCEDURE GetVisitorReport(
    IN start_date DATE,
    IN end_date DATE,
    IN dept_filter VARCHAR(50)
)
BEGIN
    SELECT 
        v.id,
        v.name,
        v.email,
        v.company,
        v.host_name,
        v.department,
        v.purpose,
        v.check_in_time,
        v.check_out_time,
        v.duration,
        v.status
    FROM visitors v
    WHERE v.check_in_time BETWEEN start_date AND end_date
    AND (dept_filter IS NULL OR v.department = dept_filter)
    ORDER BY v.check_in_time DESC;
END //

CREATE PROCEDURE AutoCheckoutVisitors()
BEGIN
    UPDATE visitors 
    SET status = 'checked_out', 
        check_out_time = NOW(),
        duration = TIMESTAMPDIFF(MINUTE, check_in_time, NOW())
    WHERE status = 'active' 
    AND check_in_time < DATE_SUB(NOW(), INTERVAL 12 HOUR);
    
    SELECT ROW_COUNT() as visitors_auto_checked_out;
END //

DELIMITER ;

-- Create triggers for audit logging
DELIMITER //

CREATE TRIGGER visitor_update_trigger 
AFTER UPDATE ON visitors
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO visitor_logs (visitor_id, activity_type, description, timestamp)
        VALUES (NEW.id, 
                CASE 
                    WHEN NEW.status = 'checked_out' THEN 'check_out'
                    ELSE 'status_change'
                END,
                CONCAT('Status changed from ', OLD.status, ' to ', NEW.status),
                NOW());
    END IF;
END //

DELIMITER ;

-- Grant permissions (adjust as needed for your setup)
-- CREATE USER 'visitor_user'@'localhost' IDENTIFIED BY 'secure_password_123';
-- GRANT SELECT, INSERT, UPDATE ON visitor_management.* TO 'visitor_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Show table structure
SHOW TABLES;
DESCRIBE visitors;
DESCRIBE visitor_logs;
DESCRIBE departments;

SELECT 'Database setup completed successfully!' as Status;