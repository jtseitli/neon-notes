export default function NavBar() {
    // TEMP STATE (replace with real auth later)
    const isLoggedIn = false;
    const username = "Josh"; // this will come from your auth later
  
    return (
      <nav className="navbar">
        <div className="navbar-left">
          <span className="logo-text">Neon Notes</span>
        </div>
  
        <div className="navbar-middle"></div>
  
        <div className="navbar-right">
          {!isLoggedIn ? (
            <button className="profile-btn">Login</button>
          ) : (
            <button className="profile-btn">{username}</button>
          )}
        </div>
      </nav>
    );
  }
  