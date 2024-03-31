const Alert = ({ message, type }) => {
        // Define a function to determine the alert's style based on the type
        const alertStyle = (type) => {
            switch (type) {
                case 'success':
                    return 'alert-success';
                case 'error':
                    return 'alert-error';
                case 'info':
                default:
                    return 'alert-info';
            }
        };
    
        return (
            <div className={`alert ${alertStyle(type)}`}>
                {message}
            </div>
        );
    };
    
    export default Alert;
    