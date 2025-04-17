import { FaTh, FaSuitcase, FaShieldAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import OptimizedImage from "../../shared/OptimizedImage";

const SettingHeader = ({ formData }) => {
    const [profileImage, setProfileImage] = useState(null);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        if (formData) {
            if (formData.images && formData.images.length > 0 && formData.images[0]) {
                setProfileImage(formData.images[0]);
            }
            if (formData.userRecord) {
                if (formData.userRecord.name){
                    const nameParts = formData.userRecord.name.split(' ');
                    setUserName(nameParts[nameParts.length - 1]);
                }
            }
        }
    }, [formData]);

    const defaultProfileImage = "https://i.ibb.co/LZPVKq9/card1.png";

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                marginTop: '5px',
                padding: "15px",
                background: "linear-gradient(to right, #ff416c, #ff4b2b)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        overflow: "hidden",
                        marginRight: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {profileImage ? (
                        <OptimizedImage
                            src={profileImage}
                            alt="Profile"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            fallbackSrc={defaultProfileImage}
                            placeholderColor="#f8e1f4"
                        />
                    ) : (
                        <img
                            src={defaultProfileImage}
                            alt="Default Profile"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    )}
                </div>
                <span style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>
                    {userName || "User Profile"}
                </span>
                {formData.type === 'PREMIUM' && (
                    <img
                        src="https://www.freepnglogos.com/uploads/diamond-png/diamond-icon-download-icons-3.png"
                        alt="Diamond Icon"
                        width="30"
                        height="30"
                        style={{ marginRight: '10px' }}
                    />
                )}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#651515",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <FaShieldAlt style={{ color: "white", fontSize: "18px" }} />
                </div>
            </div>
        </div>
    );
};

export default SettingHeader;
