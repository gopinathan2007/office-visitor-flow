<?php
/**
 * Visitor Management API
 * Place this file in your XAMPP htdocs/visitor-management/backend/api/ directory
 */

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

class VisitorAPI {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->connect();
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $path_parts = explode('/', trim($path, '/'));
        
        switch ($method) {
            case 'GET':
                if (isset($_GET['action'])) {
                    switch ($_GET['action']) {
                        case 'active':
                            $this->getActiveVisitors();
                            break;
                        case 'history':
                            $this->getVisitorHistory();
                            break;
                        case 'analytics':
                            $this->getAnalytics();
                            break;
                        default:
                            $this->getAllVisitors();
                    }
                } else {
                    $this->getAllVisitors();
                }
                break;
            
            case 'POST':
                if (isset($_GET['action']) && $_GET['action'] === 'checkin') {
                    $this->checkInVisitor();
                } else {
                    $this->createVisitor();
                }
                break;
            
            case 'PUT':
                if (isset($_GET['action']) && $_GET['action'] === 'checkout') {
                    $this->checkOutVisitor();
                } else {
                    $this->updateVisitor();
                }
                break;
            
            case 'DELETE':
                $this->deleteVisitor();
                break;
            
            default:
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
        }
    }

    private function checkInVisitor() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$this->validateCheckInData($data)) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid data provided']);
            return;
        }

        try {
            $query = "INSERT INTO visitors (name, email, phone, company, host_name, purpose, department, check_in_time, status) 
                     VALUES (:name, :email, :phone, :company, :host_name, :purpose, :department, NOW(), 'active')";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':phone', $data['phone']);
            $stmt->bindParam(':company', $data['company']);
            $stmt->bindParam(':host_name', $data['hostName']);
            $stmt->bindParam(':purpose', $data['purpose']);
            $stmt->bindParam(':department', $data['department']);
            
            if ($stmt->execute()) {
                $visitor_id = $this->conn->lastInsertId();
                
                // Log the check-in
                $this->logVisitorActivity($visitor_id, 'check_in');
                
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Visitor checked in successfully',
                    'visitor_id' => $visitor_id
                ]);
            } else {
                throw new Exception('Failed to check in visitor');
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error: ' . $e->getMessage()]);
        }
    }

    private function checkOutVisitor() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['visitor_id'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Visitor ID is required']);
            return;
        }

        try {
            $query = "UPDATE visitors SET 
                        status = 'checked_out', 
                        check_out_time = NOW(),
                        duration = TIMESTAMPDIFF(MINUTE, check_in_time, NOW())
                      WHERE id = :visitor_id AND status = 'active'";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':visitor_id', $data['visitor_id']);
            
            if ($stmt->execute()) {
                if ($stmt->rowCount() > 0) {
                    // Log the check-out
                    $this->logVisitorActivity($data['visitor_id'], 'check_out');
                    
                    echo json_encode([
                        'success' => true,
                        'message' => 'Visitor checked out successfully'
                    ]);
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Active visitor not found']);
                }
            } else {
                throw new Exception('Failed to check out visitor');
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error: ' . $e->getMessage()]);
        }
    }

    private function getActiveVisitors() {
        try {
            $query = "SELECT * FROM visitors WHERE status = 'active' ORDER BY check_in_time DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            $visitors = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $visitors
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error: ' . $e->getMessage()]);
        }
    }

    private function getVisitorHistory() {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        $status_filter = isset($_GET['status']) ? $_GET['status'] : '';
        $search = isset($_GET['search']) ? $_GET['search'] : '';

        try {
            $where_conditions = [];
            $params = [];

            if ($status_filter && $status_filter !== 'all') {
                $where_conditions[] = "status = :status";
                $params[':status'] = $status_filter;
            }

            if ($search) {
                $where_conditions[] = "(name LIKE :search OR company LIKE :search2 OR host_name LIKE :search3)";
                $params[':search'] = '%' . $search . '%';
                $params[':search2'] = '%' . $search . '%';
                $params[':search3'] = '%' . $search . '%';
            }

            $where_clause = '';
            if (!empty($where_conditions)) {
                $where_clause = 'WHERE ' . implode(' AND ', $where_conditions);
            }

            $query = "SELECT * FROM visitors $where_clause ORDER BY check_in_time DESC LIMIT :limit OFFSET :offset";
            $stmt = $this->conn->prepare($query);
            
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            
            $stmt->execute();
            $visitors = $stmt->fetchAll();

            // Get total count
            $count_query = "SELECT COUNT(*) as total FROM visitors $where_clause";
            $count_stmt = $this->conn->prepare($count_query);
            foreach ($params as $key => $value) {
                $count_stmt->bindValue($key, $value);
            }
            $count_stmt->execute();
            $total = $count_stmt->fetch()['total'];

            echo json_encode([
                'success' => true,
                'data' => $visitors,
                'total' => $total,
                'limit' => $limit,
                'offset' => $offset
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error: ' . $e->getMessage()]);
        }
    }

    private function getAnalytics() {
        try {
            // Daily visits for the last 30 days
            $daily_query = "SELECT DATE(check_in_time) as date, COUNT(*) as visits 
                           FROM visitors 
                           WHERE check_in_time >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
                           GROUP BY DATE(check_in_time) 
                           ORDER BY date DESC";
            $daily_stmt = $this->conn->prepare($daily_query);
            $daily_stmt->execute();
            $daily_visits = $daily_stmt->fetchAll();

            // Department visits
            $dept_query = "SELECT department, COUNT(*) as visits 
                          FROM visitors 
                          WHERE check_in_time >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
                          GROUP BY department 
                          ORDER BY visits DESC";
            $dept_stmt = $this->conn->prepare($dept_query);
            $dept_stmt->execute();
            $dept_visits = $dept_stmt->fetchAll();

            // Monthly stats
            $stats_query = "SELECT 
                              COUNT(*) as total_visitors,
                              AVG(duration) as avg_duration,
                              DAYNAME(check_in_time) as peak_day
                           FROM visitors 
                           WHERE check_in_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
            $stats_stmt = $this->conn->prepare($stats_query);
            $stats_stmt->execute();
            $monthly_stats = $stats_stmt->fetch();

            // Peak day
            $peak_query = "SELECT DAYNAME(check_in_time) as day, COUNT(*) as visits
                          FROM visitors 
                          WHERE check_in_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                          GROUP BY DAYNAME(check_in_time)
                          ORDER BY visits DESC
                          LIMIT 1";
            $peak_stmt = $this->conn->prepare($peak_query);
            $peak_stmt->execute();
            $peak_day = $peak_stmt->fetch();

            // Top department
            $top_dept_query = "SELECT department, COUNT(*) as visits
                              FROM visitors 
                              WHERE check_in_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                              GROUP BY department
                              ORDER BY visits DESC
                              LIMIT 1";
            $top_dept_stmt = $this->conn->prepare($top_dept_query);
            $top_dept_stmt->execute();
            $top_dept = $top_dept_stmt->fetch();

            echo json_encode([
                'success' => true,
                'data' => [
                    'daily_visits' => $daily_visits,
                    'department_visits' => $dept_visits,
                    'monthly_stats' => [
                        'total_visitors' => (int)$monthly_stats['total_visitors'],
                        'avg_duration' => round($monthly_stats['avg_duration'], 0),
                        'peak_day' => $peak_day['day'] ?? 'N/A',
                        'top_department' => $top_dept['department'] ?? 'N/A'
                    ]
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error: ' . $e->getMessage()]);
        }
    }

    private function logVisitorActivity($visitor_id, $activity_type) {
        try {
            $query = "INSERT INTO visitor_logs (visitor_id, activity_type, timestamp) VALUES (:visitor_id, :activity_type, NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':visitor_id', $visitor_id);
            $stmt->bindParam(':activity_type', $activity_type);
            $stmt->execute();
        } catch (Exception $e) {
            // Log error but don't fail the main operation
            error_log("Failed to log visitor activity: " . $e->getMessage());
        }
    }

    private function validateCheckInData($data) {
        $required_fields = ['name', 'email', 'phone', 'company', 'hostName', 'purpose', 'department'];
        
        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                return false;
            }
        }

        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        return true;
    }

    private function getAllVisitors() {
        try {
            $query = "SELECT * FROM visitors ORDER BY check_in_time DESC LIMIT 100";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            $visitors = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $visitors
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error: ' . $e->getMessage()]);
        }
    }

    private function createVisitor() {
        // Implementation for creating visitor (similar to checkInVisitor)
        $this->checkInVisitor();
    }

    private function updateVisitor() {
        // Implementation for updating visitor details
        echo json_encode(['message' => 'Update visitor functionality']);
    }

    private function deleteVisitor() {
        // Implementation for deleting visitor (admin function)
        echo json_encode(['message' => 'Delete visitor functionality']);
    }
}

// Initialize and handle the request
try {
    $api = new VisitorAPI();
    $api->handleRequest();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}
?>