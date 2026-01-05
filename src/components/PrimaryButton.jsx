export default function PrimaryButton({ children, ...props }) {
    return (
        <button className="primary-btn" {...props}>
            {children}
        </button>
    );
}
