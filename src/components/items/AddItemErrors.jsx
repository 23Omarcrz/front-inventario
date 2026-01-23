import './addItemErrors.css'

const AddItemErrors = ({backendErrors}) => {//error.response.data.error
    return (
        <div className="backend-errors">
                <h4>Error</h4>
                <ul>
                    {backendErrors.map((err, index) => (
                    <li key={index}>
                        <strong>{err.path[0]}:</strong> {err.message}
                    </li>
                    ))}
                </ul>
        </div>
    )
}

export default AddItemErrors