document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (result.success) {
            alert("Đăng nhập thành công!");
            window.location.href = "/home.html";
        } else {
            document.getElementById('error-message').innerText = result.message || 'Đăng nhập thất bại!';
        }
    } catch (error) {
        document.getElementById('error-message').innerText = 'Lỗi kết nối!';
    }
});
