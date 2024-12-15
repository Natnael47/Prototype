import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from "../context/context";

const Home = () => {
    const [userTermStatus, setUserTermStatus] = useState(null); // State to store the term status
    const [showPopup, setShowPopup] = useState(false); // State to control the visibility of the popup
    const { token } = useContext(Context); // Accessing token from context

    useEffect(() => {
        // Fetch user term status from backend
        const checkUserTerms = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user/check', {
                    headers: { token } // Correctly include token in headers
                });

                if (response.data.success) {
                    const { userTermStatus } = response.data;
                    setUserTermStatus(userTermStatus); // Set userTermStatus from response
                    console.log(userTermStatus);

                    if (!userTermStatus) {
                        setShowPopup(true); // Show popup if terms not accepted
                    }
                }
            } catch (error) {
                console.error("Error fetching user terms status", error);
            }
        };

        checkUserTerms();
    }, [token]); // Depend on token to ensure it gets rechecked if token changes

    const handleAcceptTerms = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/user/update-term', {
                user_Term: true, // Mark terms as accepted
            }, {
                headers: { token } // Include token in request
            });

            if (response.data.success) {
                setUserTermStatus(true); // Set the terms status to true
                setShowPopup(false); // Close the popup
            }
        } catch (error) {
            console.error("Error updating user terms", error);
        }
    };

    const handleCancelTerms = () => {
        setShowPopup(false); // Close the popup without accepting terms
    };

    return (
        <div>
            {userTermStatus === null ? (
                <div>Loading...</div> // Show loading until userTermStatus is fetched
            ) : (
                <>
                    {/* Show Pay button if user has accepted terms */}
                    {userTermStatus ? (
                        <button>Pay</button>
                    ) : (
                        <div>Please accept the terms and conditions to continue.</div> // Message if terms are not accepted
                    )}

                    {/* Show Terms and Conditions Popup if user has not accepted the terms */}
                    {showPopup && (
                        <div className="popup">
                            <div className="popup-content">
                                <h2>Terms and Conditions</h2>
                                <p>
                                    {/* Display example terms and conditions */}
                                    By continuing, you agree to the following terms and conditions:
                                    <br />
                                    1. You must not share your password with others.
                                    <br />
                                    2. You agree to the privacy policy.
                                    <br />
                                    3. You consent to us processing your data as per our privacy policy.
                                </p>
                                <button onClick={handleAcceptTerms}>Accept</button>
                                <button onClick={handleCancelTerms}>Cancel</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
