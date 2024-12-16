import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/context";

const Home = () => {
    const [userTermStatus, setUserTermStatus] = useState(null); // User terms status
    const [showPopup, setShowPopup] = useState(false); // Terms popup
    const [lotteryNumber, setLotteryNumber] = useState(null); // Lottery number after payment
    const [winnerDetails, setWinnerDetails] = useState(null); // Winner details after checking
    const { token } = useContext(Context); // User token from context

    useEffect(() => {
        const checkUserTerms = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/user/check", {
                    headers: { token },
                });

                if (response.data.success) {
                    const { userTermStatus } = response.data;
                    setUserTermStatus(userTermStatus);

                    if (!userTermStatus) {
                        setShowPopup(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching user terms status:", error);
            }
        };

        checkUserTerms();
    }, [token]);

    const handleAcceptTerms = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/user/update-term",
                { user_Term: true },
                { headers: { token } }
            );

            if (response.data.success) {
                setUserTermStatus(true);
                setShowPopup(false);
            }
        } catch (error) {
            console.error("Error updating terms status:", error);
        }
    };

    const handlePay = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/user/payment",
                {},
                { headers: { token } }
            );

            if (response.data.success) {
                setLotteryNumber(response.data.lottery_number);
                alert(`Payment Successful! Your Lottery Number: ${response.data.lottery_number}`);
            } else {
                alert("Payment Failed! Please try again.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("An error occurred during payment.");
        }
    };

    const handleCheckWinner = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/user/select-winner");

            if (response.data.success) {
                const { name, phone, lotteryNumber } = response.data.winnerDetails;
                setWinnerDetails({ name, phone, lotteryNumber });
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error checking winner:", error);
            alert("An error occurred while checking the winner.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-4">
            {userTermStatus === null ? (
                <div className="text-center text-lg font-semibold text-gray-700">Loading...</div>
            ) : (
                <>
                    {userTermStatus ? (
                        <>
                            <button
                                onClick={handlePay}
                                className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                            >
                                Make Payment
                            </button>
                            {lotteryNumber && (
                                <div className="mt-6 text-center">
                                    <h3 className="text-2xl font-semibold text-gray-800">
                                        Your Lottery Number: <span className="text-blue-600">{lotteryNumber}</span>
                                    </h3>
                                    <button
                                        onClick={handleCheckWinner}
                                        className="mt-4 px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
                                    >
                                        Check Winner
                                    </button>
                                </div>
                            )}
                            {winnerDetails && (
                                <div className="mt-8 text-center bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow-md">
                                    <h3 className="text-2xl font-bold text-yellow-700">🎉 Congratulations! 🎉</h3>
                                    <p className="mt-2 text-lg text-gray-800">Winner Name: {winnerDetails.name}</p>
                                    <p className="text-lg text-gray-800">Phone: {winnerDetails.phone}</p>
                                    <p className="text-lg text-gray-800">Winning Lottery Number: {winnerDetails.lotteryNumber}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center text-gray-700 text-lg">
                            Please accept the terms and conditions to continue.
                        </div>
                    )}

                    {showPopup && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 overflow-y-auto max-h-[80vh]">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Terms and Conditions</h2>
                                <p className="text-gray-700 mb-4">
                                    By proceeding, you agree to the following:
                                </p>
                                <p className="text-gray-700 mb-4">
                                    1. You will send a fee of 1 Birr every time you make a transaction to
                                    enter the lottery.
                                </p>
                                <p className="text-gray-700 mb-4">
                                    2. You understand that this lottery awards a grand prize of 100,000
                                    Birr every week.
                                </p>
                                <p className="text-gray-700 mb-4">
                                    3. All transactions are final and cannot be refunded once completed.
                                </p>
                                <button
                                    className="block mx-auto mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    onClick={handleAcceptTerms}
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
