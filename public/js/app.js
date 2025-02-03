const logout = async () => {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(data.message);
            window.location.href = '/';
        } else {
            console.error(data.message); 
        }
    } catch (error) {
        console.error('Logout failed:', error);
    }
};
