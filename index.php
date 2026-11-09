<?php  
session_start();  
  
/* DATABASE CONNECTION */  
$pdo = new PDO(  
    "mysql:host=localhost;dbname=university_system;charset=utf8mb4",  
    "root",  
    "",  
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]  
);  
  
/* CREATE TABLES */  
$pdo->exec("  
CREATE TABLE IF NOT EXISTS users (  
 id INT AUTO_INCREMENT PRIMARY KEY,  
 student_id VARCHAR(50) UNIQUE,  
 name VARCHAR(100),  
 password VARCHAR(255),  
 role VARCHAR(20)  
)");  
  
$pdo->exec("  
CREATE TABLE IF NOT EXISTS notices (  
 id INT AUTO_INCREMENT PRIMARY KEY,  
 title VARCHAR(200),  
 body TEXT,  
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
)");  
  
$pdo->exec("  
CREATE TABLE IF NOT EXISTS routines (  
 id INT AUTO_INCREMENT PRIMARY KEY,  
 type VARCHAR(30),  
 department VARCHAR(50),  
 semester VARCHAR(30),  
 day_date VARCHAR(50),  
 time_text VARCHAR(50),  
 course VARCHAR(50)  
)");  
  
$pdo->exec("  
CREATE TABLE IF NOT EXISTS applications (  
 id INT AUTO_INCREMENT PRIMARY KEY,  
 user_id INT,  
 app_type VARCHAR(100),  
 details TEXT,  
 status VARCHAR(30) DEFAULT 'Pending',  
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
)");  
  
/* CREATE DEMO USERS */  
$count = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();  
  
if ($count == 0) {  
    $stmt = $pdo->prepare(  
        "INSERT INTO users  
        (student_id,name,password,role)  
        VALUES (?,?,?,?)"  
    );  
  
    $stmt->execute([  
        "2026001",  
        "Demo Student",  
        password_hash("student123", PASSWORD_DEFAULT),  
        "student"  
    ]);  
  
    $stmt->execute([  
        "admin",  
        "System Admin",  
        password_hash("admin123", PASSWORD_DEFAULT),  
        "admin"  
    ]);  
}  
  
/* SAMPLE DATA */  
$count = $pdo->query("SELECT COUNT(*) FROM notices")->fetchColumn();  
  
if ($count == 0) {  
    $pdo->exec("  
    INSERT INTO notices(title,body)  
    VALUES  
    ('Welcome Notice','Welcome to University Portal')  
    ");  
}  
  
$count = $pdo->query("SELECT COUNT(*) FROM routines")->fetchColumn();  
  
if ($count == 0) {  
    $pdo->exec("  
    INSERT INTO routines  
    (type,department,semester,day_date,time_text,course)  
    VALUES  
    ('Class','CSE','5th','Sunday','10-11 AM','CSE-301'),  
    ('Class','CSE','5th','Monday','11-12 PM','CSE-302'),  
    ('Exam','CSE','5th','10/11/2026','10 AM','CSE-301')  
    ");  
}  
  
/* HELPER FUNCTIONS */  
function e($value) {  
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');  
}  
  
function loggedIn() {  
    return isset($_SESSION['user']);  
}  
  
function isAdmin() {  
    return loggedIn() && $_SESSION['user']['role'] == 'admin';  
}  
  
function goHome() {  
    header("Location: index.php");  
    exit;  
}  
  
/* LOGIN */  
if (isset($_POST['login'])) {  
  
    $id = trim($_POST['student_id']);  
    $password = $_POST['password'];  
  
    $stmt = $pdo->prepare(  
        "SELECT * FROM users WHERE student_id=?"  
    );  
  
    $stmt->execute([$id]);  
    $user = $stmt->fetch(PDO::FETCH_ASSOC);  
  
    if ($user && password_verify($password, $user['password'])) {  
  
        session_regenerate_id(true);  
  
        $_SESSION['user'] = [  
            'id' => $user['id'],  
            'name' => $user['name'],  
            'student_id' => $user['student_id'],  
            'role' => $user['role']  
        ];  
  
        goHome();  
  
    } else {  
        $error = "Invalid ID or Password!";  
    }  
}  
  
/* LOGOUT */  
if (isset($_GET['logout'])) {  
    session_destroy();  
    goHome();  
}  
  
/* STUDENT APPLICATION SUBMISSION */  
if (isset($_POST['submit_application']) && loggedIn() && !isAdmin()) {  
  
    $type = $_POST['app_type'];  
    $details = trim($_POST['details']);  
  
    $allowed = [  
        'Exam Permission',  
        'Lost ID Card',  
        'Transport Fee Off',  
        'Other Application'  
    ];  
  
    if (in_array($type, $allowed, true) && $details != '') {  
  
        $stmt = $pdo->prepare("  
        INSERT INTO applications  
        (user_id,app_type,details)  
        VALUES (?,?,?)  
        ");  
  
        $stmt->execute([  
            $_SESSION['user']['id'],  
            $type,  
            $details  
        ]);  
  
        $message = "Application Submitted Successfully!";  
    }  
}  
  
/* ADMIN APPROVE / REJECT */  
if (isset($_POST['review']) && isAdmin()) {  
  
    $status = $_POST['status'];  
  
    if (in_array($status, ['Approved','Rejected'], true)) {  
  
        $stmt = $pdo->prepare("  
        UPDATE applications  
        SET status=?  
        WHERE id=?  
        ");  
  
        $stmt->execute([  
            $status,  
            (int)$_POST['application_id']  
        ]);  
  
        $message = "Application Status Updated!";  
    }  
}  
  
/* ADMIN ADD NOTICE */  
if (isset($_POST['add_notice']) && isAdmin()) {  
  
    $stmt = $pdo->prepare("  
    INSERT INTO notices(title,body)  
    VALUES (?,?)  
    ");  
  
    $stmt->execute([  
        trim($_POST['title']),  
        trim($_POST['body'])  
    ]);  
  
    $message = "Notice Added Successfully!";  
}  
  
/* ADMIN ADD ROUTINE */  
if (isset($_POST['add_routine']) && isAdmin()) {  
  
    $stmt = $pdo->prepare("  
    INSERT INTO routines  
    (type,department,semester,day_date,time_text,course)  
    VALUES (?,?,?,?,?,?)  
    ");  
  
    $stmt->execute([  
        $_POST['type'],  
        trim($_POST['department']),  
        trim($_POST['semester']),  
        trim($_POST['day_date']),  
        trim($_POST['time_text']),  
        trim($_POST['course'])  
    ]);  
  
    $message = "Routine Added Successfully!";  
}  
?>  <!DOCTYPE html>  <html>  
<head>  <title>University Information System</title>  <meta name="viewport" content="width=device-width, initial-scale=1">  <style>  
  
* {  
    box-sizing: border-box;  
}  
  
body {  
    margin: 0;  
    font-family: Arial, sans-serif;  
    background: #f1f5f9;  
    color: #222;  
}  
  
header {  
    background: #173b67;  
    color: white;  
    padding: 20px;  
    text-align: center;  
}  
  
nav {  
    background: #245786;  
    padding: 15px;  
    text-align: center;  
}  
  
nav a {  
    color: white;  
    text-decoration: none;  
    margin: 8px;  
    display: inline-block;  
}  
  
.container {  
    width: 90%;  
    max-width: 1000px;  
    margin: 25px auto;  
}  
  
.card {  
    background: white;  
    padding: 22px;  
    margin-bottom: 20px;  
    border-radius: 10px;  
    box-shadow: 0 2px 8px #ccc;  
}  
  
input, select, textarea {  
    width: 100%;  
    padding: 12px;  
    margin: 8px 0 15px;  
    border: 1px solid #bbb;  
    border-radius: 5px;  
}  
  
button {  
    background: #1764a5;  
    color: white;  
    padding: 11px 20px;  
    border: none;  
    border-radius: 5px;  
    cursor: pointer;  
}  
  
button:hover {  
    background: #104b7d;  
}  
  
table {  
    width: 100%;  
    border-collapse: collapse;  
}  
  
th, td {  
    border: 1px solid #ddd;  
    padding: 10px;  
    text-align: left;  
}  
  
th {  
    background: #e5edf5;  
}  
  
.message {  
    background: #d9f5df;  
    padding: 12px;  
    margin-bottom: 15px;  
}  
  
footer {  
    background: #173b67;  
    color: white;  
    text-align: center;  
    padding: 18px;  
    margin-top: 40px;  
}  
  
</style>  </head>  <body>  <header>  
<h1>University Information & Application System</h1>  
<p>Welcome to University Portal</p>  
</header>  <?php if (!loggedIn()): ?>  <div class="container">  <div class="card">  <h2>Student / Admin Login</h2>  <?php if(isset($error)) echo "<p style='color:red'>".e($error)."</p>"; ?>  <form method="POST">  <label>Student ID</label>

<input type="text" name="student_id" required>  <label>Password</label>

<input type="password" name="password" required>  <button type="submit" name="login">LOGIN</button>

</form>  </div>  </div>  <?php else: ?>  <nav>  <a href="index.php">Dashboard</a>

<a href="?page=notice">Official Notice</a>

<a href="?page=class">Class Routine</a>

<a href="?page=exam">Exam Routine</a>

<?php if(!isAdmin()): ?>  <a href="?page=apply">Applications</a>

<a href="?page=status">Application Status</a>

<?php endif; ?>  <?php if(isAdmin()): ?>  <a href="?page=admin">Admin Dashboard</a>

<?php endif; ?>  <a href="?logout=1">Logout</a>

</nav>  <div class="container">  <?php  
  
if(isset($message)) {  
    echo "<div class='message'>".e($message)."</div>";  
}  
  
$page = $_GET['page'] ?? 'dashboard';  
  
/* STUDENT DASHBOARD */  
if($page == 'dashboard') {  
  
    echo "<div class='card'>";  
    echo "<h2>Welcome, ".e($_SESSION['user']['name'])."!</h2>";  
    echo "<p>Student ID: ".e($_SESSION['user']['student_id'])."</p>";  
    echo "<p>Welcome to your University Dashboard.</p>";  
    echo "</div>";  
  
    $notices = $pdo->query(  
        "SELECT * FROM notices ORDER BY id DESC LIMIT 3"  
    )->fetchAll(PDO::FETCH_ASSOC);  
  
    echo "<div class='card'><h2>Latest Notices</h2>";  
  
    foreach($notices as $n) {  
        echo "<h3>".e($n['title'])."</h3>";  
        echo "<p>".nl2br(e($n['body']))."</p>";  
    }  
  
    echo "</div>";  
}  
  
/* OFFICIAL NOTICE */  
elseif($page == 'notice') {  
  
    echo "<div class='card'><h2>Official Notices</h2>";  
  
    $rows = $pdo->query(  
        "SELECT * FROM notices ORDER BY id DESC"  
    )->fetchAll(PDO::FETCH_ASSOC);  
  
    foreach($rows as $r) {  
        echo "<h3>".e($r['title'])."</h3>";  
        echo "<p>".nl2br(e($r['body']))."</p><hr>";  
    }  
  
    echo "</div>";  
}  
  
/* CLASS AND EXAM ROUTINE */  
elseif($page == 'class' || $page == 'exam') {  
  
    $type = ($page == 'class') ? 'Class' : 'Exam';  
  
    echo "<div class='card'>";  
    echo "<h2>".e($type)." Routine</h2>";  
  
    $stmt = $pdo->prepare(  
        "SELECT * FROM routines WHERE type=?"  
    );  
  
    $stmt->execute([$type]);  
  
    echo "<table>  
    <tr>  
    <th>Department</th>  
    <th>Semester</th>  
    <th>Day/Date</th>  
    <th>Time</th>  
    <th>Course</th>  
    </tr>";  
  
    while($r = $stmt->fetch(PDO::FETCH_ASSOC)) {  
  
        echo "<tr>  
        <td>".e($r['department'])."</td>  
        <td>".e($r['semester'])."</td>  
        <td>".e($r['day_date'])."</td>  
        <td>".e($r['time_text'])."</td>  
        <td>".e($r['course'])."</td>  
        </tr>";  
    }  
  
    echo "</table></div>";  
}  
  
/* APPLICATION FORM */  
elseif($page == 'apply' && !isAdmin()) {  
  
?>  <div class="card">  <h2>Online Application Form</h2>  <form method="POST">  <label>Application Type</label>

<select name="app_type" required>  <option>Exam Permission</option>  <option>Lost ID Card</option>  <option>Transport Fee Off</option>  <option>Other Application</option>  </select>  <label>Reason / Details</label>

<textarea name="details" rows="5" required></textarea>  <button type="submit" name="submit_application">  
SUBMIT APPLICATION  
</button>  </form>  </div>  <?php  
}  
  
/* APPLICATION STATUS */  
elseif($page == 'status' && !isAdmin()) {  
  
    echo "<div class='card'><h2>Application Status</h2>";  
  
    $stmt = $pdo->prepare("  
    SELECT * FROM applications  
    WHERE user_id=?  
    ORDER BY id DESC  
    ");  
  
    $stmt->execute([$_SESSION['user']['id']]);  
  
    echo "<table>  
    <tr>  
    <th>ID</th>  
    <th>Type</th>  
    <th>Details</th>  
    <th>Status</th>  
    </tr>";  
  
    while($r = $stmt->fetch(PDO::FETCH_ASSOC)) {  
  
        echo "<tr>  
        <td>#".e($r['id'])."</td>  
        <td>".e($r['app_type'])."</td>  
        <td>".e($r['details'])."</td>  
        <td>".e($r['status'])."</td>  
        </tr>";  
    }  
  
    echo "</table></div>";  
}  
  
/* ADMIN DASHBOARD */  
elseif($page == 'admin' && isAdmin()) {  
  
?>  <div class="card">  <h2>Admin Dashboard</h2>  <h3>Publish Official Notice</h3>  <form method="POST">  <input type="text" name="title" placeholder="Notice Title" required>  <textarea name="body" placeholder="Notice Details" required></textarea>  <button name="add_notice">Publish Notice</button>

</form>  </div>  <div class="card">  <h2>Add Class / Exam Routine</h2>  <form method="POST">  <label>Routine Type</label>

<select name="type">  
<option>Class</option>  
<option>Exam</option>  
</select>  <input name="department" placeholder="Department (CSE)" required>  <input name="semester" placeholder="Semester (5th)" required>  <input name="day_date" placeholder="Day or Date" required>  <input name="time_text" placeholder="Time" required>  <input name="course" placeholder="Course Code" required>  <button name="add_routine">Add Routine</button>

</form>  </div>  <div class="card">  <h2>Review Student Applications</h2>  <table>  <tr>  
<th>ID</th>  
<th>Student</th>  
<th>Type</th>  
<th>Details</th>  
<th>Status</th>  
<th>Action</th>  
</tr>  <?php  
  
$apps = $pdo->query("  
SELECT applications.*, users.name  
FROM applications  
JOIN users ON applications.user_id=users.id  
ORDER BY applications.id DESC  
")->fetchAll(PDO::FETCH_ASSOC);  
  
foreach($apps as $a) {  
  
?>  <tr>  <td>#<?=e($a['id'])?></td>  <td><?=e($a['name'])?></td>  <td><?=e($a['app_type'])?></td>  <td><?=e($a['details'])?></td>  <td><?=e($a['status'])?></td>  <td>  <?php if($a['status']=='Pending'): ?>  <form method="POST">  <input type="hidden" name="application_id"  
value="<?=e($a['id'])?>">

<button name="review" value="1"  
onclick="this.form.status.value='Approved'">
Approve
</button>

<button name="review" value="1"  
onclick="this.form.status.value='Rejected'">
Reject
</button>

<input type="hidden" name="status" value="">  </form>  <?php endif; ?>  </td>  </tr>  <?php } ?>  </table>  </div>  <?php  
}  
  
?>  </div>  <?php endif; ?>  <footer>  
<p>University Information and Application System</p>  
<p>Academic Project Demo</p>  
</footer>  </body>  
</html>