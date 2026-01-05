import { Link } from "react-router-dom";

export default function AuthFooter({ text, linkText, linkHref }) {
    return (
        <div className="auth-footer">
            {text}
            <Link to={linkHref}>{linkText}</Link>
            {/* <a href={linkHref}>{linkText}</a> */}
        </div>
    );
}
