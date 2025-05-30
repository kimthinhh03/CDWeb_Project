document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const userData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        fullname: document.getElementById('fullname').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value
    };

    try {
        const response = await fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (result.success) {
            alert("Đăng ký thành công!");
            window.location.href = "signin.html";
        } else {
            document.getElementById('error-message').innerText = result.message || 'Đăng ký thất bại!';
        }
    } catch (error) {
        document.getElementById('error-message').innerText = 'Lỗi khi đăng ký!';
    }
});
