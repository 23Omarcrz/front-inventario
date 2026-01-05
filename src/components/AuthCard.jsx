export default function AuthCard({ title, subtitle, children, icon}) {
    return (
        <div className="auth-card">

            <div className="icon-wrapper">
                <div className="auth-icon">
                    {/* AQUI va tu icono: */}
                    {<img src={icon} className="icon"/> } 
                </div>
            </div>

            <h2 className="auth-title">{title}</h2>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}

            {children}
        </div>
    );
}
