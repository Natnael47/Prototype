import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { backendUrl } from "../App";
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
                const response = await axios.get(backendUrl + "/api/user/check", {
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
                backendUrl + "/api/user/update-term",
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
                backendUrl + "/api/user/payment",
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
            const response = await axios.get(backendUrl + "/api/user/select-winner");

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload(); // Refresh to remove token and re-render the page
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-300 to-blue-500 p-6">
            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="absolute top-6 right-6 px-4 py-2 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
            >
                Logout
            </button>

            {userTermStatus === null ? (
                <div className="text-center text-lg font-semibold text-gray-700">Loading...</div>
            ) : (
                <>
                    {userTermStatus ? (
                        <>
                            <button
                                onClick={handlePay}
                                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-xl hover:bg-blue-700 transition duration-300"
                            >
                                Make Payment
                            </button>
                            {lotteryNumber && (
                                <div className="mt-6 text-center">
                                    <h3 className="text-3xl font-semibold text-white">
                                        Your Lottery Number: <span className="text-yellow-300">{lotteryNumber}</span>
                                    </h3>
                                    <button
                                        onClick={handleCheckWinner}
                                        className="mt-4 px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-xl hover:bg-green-700 transition duration-300"
                                    >
                                        Check Winner
                                    </button>
                                </div>
                            )}
                            {winnerDetails && (
                                <div className="mt-8 text-center bg-yellow-200 border-l-4 border-yellow-500 p-6 rounded-lg shadow-xl">
                                    <h3 className="text-3xl font-bold text-yellow-700">🎉 Congratulations! 🎉</h3>
                                    <p className="mt-4 text-xl text-gray-800">Winner Name: <span className="font-semibold">{winnerDetails.name}</span></p>
                                    <p className="text-xl text-gray-800">Phone: <span className="font-semibold">{winnerDetails.phone}</span></p>
                                    <p className="text-xl text-gray-800">Winning Lottery Number: <span className="font-semibold">{winnerDetails.lotteryNumber}</span></p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center text-white text-lg">
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
                                    1. You will send a fee of 1 Birr every time you make a transaction to enter the lottery.
                                </p>
                                <p className="text-gray-700 mb-4">
                                    2. You understand that this lottery awards a grand prize of 100,000 Birr every week.
                                </p>
                                <p className="text-gray-700 mb-4">
                                    3. All transactions are final and cannot be refunded once completed.
                                </p>
                                <button
                                    className="block mx-auto mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
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
