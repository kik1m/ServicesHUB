import React from 'react';

const SuccessMessage = ({ type, toolName }) => {
    return (
        <p className="success-message-text">
            {type === 'account_premium'
                ? "Authentication successful! Your account has been upgraded to Lifetime Premium. You now have unlimited submissions and priority support."
                : `Success! Your tool ${toolName ? `"${toolName}"` : ""} has been promoted. It will now appear in the featured sections across the platform.`
            }
        </p>
    );
};

export default SuccessMessage;
