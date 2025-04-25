import './media-card.css';

import '../profiles-grid.css';
import '../title.css';
import {useEffect, useState, useCallback, useMemo, memo} from "react";
import TinderCard from "react-tinder-card";
import {FaHeart, FaTimes, FaStar, FaArrowRight, FaArrowLeft, FaCity} from "react-icons/fa";
import { GrNext, GrPrevious } from "react-icons/gr";
import { motion } from "framer-motion";
import Typography from '@mui/material/Typography';
import {Box, Chip} from "@mui/material";
import InterestsIcon from '@mui/icons-material/Interests';
import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";
import {baseAxios, createCancelToken, matchesAxios} from "../../../config/axiosConfig.jsx";
import matchicon from '../../../assets/images/Match.png'
import nopeicon from '../../../assets/images/Nope.png'

const MemoizedChip = memo(Chip);

function MediaCard({interests, type, profiles, index, setindexskip, indexSkip}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipeEffect, setSwipeEffect] = useState(null);
    const [imageIndex, setImageIndex] = useState(() => Array(Array.isArray(profiles) ? profiles.length : 1).fill(0));
    const [imagePreviewIndex, setImagePreviewIndex] = useState(0);
    const [error, setError] = useState(null);
    const calculateAge = useCallback((dob) => {
        if (!dob) return 0;
        
        try {
            const birth = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            const dayDiff = today.getDate() - birth.getDate();
    
            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                age--;
            }
    
            return age;
        } catch (error) {
            console.error("Error calculating age:", error);
            return 0;
        }
    }, []);
    
    // Memoize event handlers to prevent unnecessary recreations
    const handleButtonClick = useCallback((direction) => {
        setSwipeEffect(direction);
        
        const timer = setTimeout(() => {
            setSwipeEffect(null);
            setCurrentIndex(prevIndex => prevIndex + 1);
        }, 300);
        
        return () => clearTimeout(timer);
    }, []);
    const handleLikeButtonClick = useCallback((direction) => {
        setSwipeEffect(direction);
        const timer = setTimeout(() => {
            setSwipeEffect(null);
            setCurrentIndex(prevIndex => prevIndex + 1);
        }, 300);
        if (setindexskip && profiles && profiles[currentIndex] && profiles[currentIndex].userRecord) {
            const userId = profiles[currentIndex].userRecord.User_ID;
            if (userId) {
                setindexskip(prev => [...prev, userId]);
            }
        }
        return () => clearTimeout(timer);
    }, []);
    const handleVisitButtonClick = useCallback((direction) => {
        setSwipeEffect(direction);
        const timer = setTimeout(() => {
            setSwipeEffect(null);
            setCurrentIndex(prevIndex => {
                return direction === "left" ? prevIndex - 1 : prevIndex + 1;
            });
        }, 300);
        if (setindexskip && profiles && profiles[currentIndex] && profiles[currentIndex].userRecord) {
            const userId = profiles[currentIndex].userRecord.User_ID;
            if (userId) {
                setindexskip(prev => [...prev, userId]);
            }
        }
        return () => clearTimeout(timer);
    }, []);
    // Optimize image navigation with memoized handlers
    const handleNextImage = useCallback((profileIndex) => {
        if (!profiles || !profiles[profileIndex] || !profiles[profileIndex].images) return;
        
        setImageIndex(prev => {
            const newIndex = [...prev];
            newIndex[profileIndex] = (newIndex[profileIndex] + 1) % profiles[profileIndex].images.length;
            return newIndex;
        });
    }, [profiles]);
    
    const handlePreviewNextImage = useCallback(() => {
        if (!profiles || !profiles.images) return;
        
        setImagePreviewIndex(prev => (prev + 1) % profiles.images.length);
    }, [profiles]);
    
    const handlePrevImage = useCallback((profileIndex) => {
        if (!profiles || !profiles[profileIndex] || !profiles[profileIndex].images) return;
        
        setImageIndex(prev => {
            const newIndex = [...prev];
            const imagesLength = profiles[profileIndex].images.length;
            newIndex[profileIndex] = (newIndex[profileIndex] - 1 + imagesLength) % imagesLength;
            return newIndex;
        });
    }, [profiles]);
    
    const handlePreviewPrevImage = useCallback(() => {
        if (!profiles || !profiles.images) return;
        
        setImagePreviewIndex(prev => (prev - 1 + profiles.images.length) % profiles.images.length);
    }, [profiles]);
    
    // Simplify card click handlers by reusing the navigation functions
    const handleCardClick = useCallback((profileIndex) => {
        handleNextImage(profileIndex);
    }, [handleNextImage]);
    
    const handlePreviewCardClick = useCallback(() => {
        handlePreviewNextImage();
    }, [handlePreviewNextImage]);
    const handleSkipSuggestion = useCallback((currentIndex) => {
        if (setindexskip && profiles && profiles[currentIndex] && profiles[currentIndex].userRecord) {
            const userId = profiles[currentIndex].userRecord.User_ID;
            if (userId) {
                setindexskip(prev => [...prev, userId]);
            }
        }
    }, [setindexskip, profiles]);
    
    const handleLikeSuggestion = useCallback(async (currentIndex, userID) => {
        if (!userID) return;
        
        try {
            if (setindexskip) {
                setindexskip(prev => [...prev, userID]);
            }
            
            // Create cancel token for request
            const cancelTokenSource = createCancelToken();
            
            // Make API call
            const response = await matchesAxios.post('/like/add', {
                UserIdTarget: userID
            }, {
                cancelToken: cancelTokenSource.token
            });
            
            // Success handling (already updated UI optimistically)
        } catch (err) {
            // Revert optimistic update on error
            if (setindexskip) {
                setindexskip(prev => prev.filter(id => id !== userID));
            }
            
            // Error handling
            if (err.response?.status === 400) {
                setError(err.response.data);
            } else {
                console.error("Error liking profile:", err);
            }
        }
    }, [setindexskip]);
    
    const handleCreateMatches = useCallback(async (userID) => {
        if (!userID) return;
        
        try {
            const cancelTokenSource = createCancelToken();
            
            const response = await matchesAxios.post('/matches/create', {
                UserIdTarget: userID
            }, {
                cancelToken: cancelTokenSource.token
            });
            
            if (response.data) {
                alert("Ghép đôi thành công")
                console.log("Match created:", response.data);
            }
        } catch (err) {
            if (err.response?.status === 400) {
                setError(err.response.data);
            } else {
                console.error("Error creating match:", err);
            }
        }
    }, []);
    const onSwipe = (direction) => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
    };
    useEffect(() => {
        if (!profiles || !Array.isArray(profiles) || profiles.length === 0 || !indexSkip || !Array.isArray(indexSkip)) {
            return;
        }
        
        // Check if current profile should be skipped
        if (profiles[currentIndex] && profiles[currentIndex].userRecord && 
            indexSkip.includes(profiles[currentIndex].userRecord.User_ID)) {
            
            // Find next valid index
            let nextIndex = currentIndex + 1;
            let foundValidProfile = false;
            
            while (nextIndex < profiles.length) {
                if (profiles[nextIndex] && profiles[nextIndex].userRecord && 
                    !indexSkip.includes(profiles[nextIndex].userRecord.User_ID)) {
                    foundValidProfile = true;
                    break;
                }
                nextIndex++;
            }
            
            if (foundValidProfile) {
                setCurrentIndex(nextIndex);
            }
        }
        
        console.log("Current index skip list:", indexSkip);
    }, [currentIndex, indexSkip, profiles]);
    return (
        (type === 'liking') ? (
            <div className="tinderCards">
                <div className="tinderCards__container">
                    {profiles[currentIndex] && (
                        <TinderCard
                            className="swipe"
                            key={profiles[currentIndex].userRecord.User_ID}
                            preventSwipe={["up", "down"]}
                            onSwipe={onSwipe}
                        >
                                <motion.div
                                    className="card"
                                    style={{
                                        backgroundImage: `url(${profiles[currentIndex].images[imageIndex[currentIndex]]})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                    initial={{ x: 0, opacity: 1 }}
                                    animate={
                                        swipeEffect === "left"
                                            ? { x: -200, opacity: 0 }
                                            : swipeEffect === "right"
                                                ? { x: 200, opacity: 0 }
                                                : swipeEffect === "up"
                                                    ? { y: -200, opacity: 0 }
                                                    : {}
                                    }
                                    transition={{ duration: 0.3 }}
                                    onClick={() => handleCardClick(currentIndex)}
                                >
                                    <div className="image-progress-bar">
                                        {profiles[currentIndex].images.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`progress-segment ${idx === imageIndex[currentIndex] ? "active" : ""}`}
                                            />
                                        ))}
                                    </div>
                                    <button className="prevImage" onClick={(e) => { e.stopPropagation(); handlePrevImage(currentIndex); }}>
                                        <FaArrowLeft size={15} />
                                    </button>
                                    <button className="nextImage" onClick={(e) => { e.stopPropagation(); handleNextImage(currentIndex); }}>
                                        <FaArrowRight size={15} />
                                    </button>
                                    <div className="cardInfo">
                                        <Box
                                            sx={{
                                                position: "relative",
                                                bottom: 20,
                                                width: "100%",
                                                color: "#fff",
                                                left: 5,
                                                maxWidth: 300,
                                            }}
                                        >
                                            {imageIndex[currentIndex] === 0  && (
                                                <>
                                                    <div style={{ display: "flex", alignItems: "baseline" }}>
                                                        <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                            fontSize: "32px", // Adjust to match the image size
                                                            color: "white", // White text fill
                                                            WebkitTextStroke: "0.2x black", // Thicker black outline
                                                            letterSpacing: "0.5px", // Slight spacing for clarity
                                                            lineHeight: 1.2}}>
                                                            {profiles[currentIndex].userRecord.name.split(' ').pop()}
                                                        </Typography>
                                                        <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                            fontSize: "32px", // Adjust to match the image size
                                                            color: "white", // White text fill
                                                            WebkitTextStroke: "0.2x black", // Thicker black outline
                                                            letterSpacing: "0.5px", // Slight spacing for clarity
                                                            lineHeight: 1.2, marginLeft: '4px'}}>
                                                            {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                        </Typography>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <InterestsIcon style={{ color: '#dcdcdc' }} />
                                                        <Typography sx={{ fontWeight: "bold", fontSize: "15px", marginRight: "5px" , marginLeft: '4px'}}>
                                                            Sở thích
                                                        </Typography>
                                                    </div>
                                                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                                                        {profiles[currentIndex].interest.map((interest) => {
                                                            const interestObj = interests.find((item) => item.InterestID == interest);
                                                            return (
                                                                interestObj && (
                                                                    <Chip
                                                                        key={interest}
                                                                        label={interestObj.name}
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: "#35363a",
                                                                            color: "#dcdcdc",
                                                                            fontWeight: "bold",
                                                                        }}
                                                                    />
                                                                )
                                                            );
                                                        })}
                                                    </Box>
                                                </>
                                            )}

                                            {imageIndex[currentIndex] === 1 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "baseline" }}>
                                                        <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                            fontSize: "32px", // Adjust to match the image size
                                                            color: "white", // White text fill
                                                            WebkitTextStroke: "0.2x black", // Thicker black outline
                                                            letterSpacing: "0.5px", // Slight spacing for clarity
                                                            lineHeight: 1.2}}>
                                                            {profiles[currentIndex].userRecord.name.split(' ').pop()}
                                                        </Typography>
                                                        <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                            fontSize: "32px", // Adjust to match the image size
                                                            color: "white", // White text fill
                                                            WebkitTextStroke: "0.2x black", // Thicker black outline
                                                            letterSpacing: "0.5px", // Slight spacing for clarity
                                                            lineHeight: 1.2, marginLeft: '4px'}}>
                                                            {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                        </Typography>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center" , columnGap: 2 }}>
                                                        <FaCity style={{ color: 'white', fontSize: '20px', marginRight: '5px' }} />
                                                        <Typography sx={{ fontSize: "16px", alignItems: "bottom", marginLeft: '4px' }}>
                                                            Sống tại {profiles[currentIndex].userRecord.city}
                                                        </Typography>
                                                        <img
                                                            src="https://cdn-icons-png.flaticon.com/512/3199/3199999.png"
                                                            alt="Education Icon"
                                                            width="35"
                                                            height="35"
                                                        />
                                                        <Typography sx={{ fontSize: "16px", alignItems: "bottom", marginLeft: '4px' }}>
                                                            Đang tìm kiếm {profiles[currentIndex].userRecord.relationship}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            )}

                                            {imageIndex[currentIndex] === 2 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "baseline" }}>
                                                        <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                            fontSize: "32px", // Adjust to match the image size
                                                            color: "white", // White text fill
                                                            WebkitTextStroke: "0.2x black", // Thicker black outline
                                                            letterSpacing: "0.5px", // Slight spacing for clarity
                                                            lineHeight: 1.2}}>
                                                            {profiles[currentIndex].userRecord.name.split(' ').pop()}
                                                        </Typography>
                                                        <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                            fontSize: "32px", // Adjust to match the image size
                                                            color: "white", // White text fill
                                                            WebkitTextStroke: "0.2x black", // Thicker black outline
                                                            letterSpacing: "0.5px", // Slight spacing for clarity
                                                            lineHeight: 1.2,marginLeft: '4px'}}>
                                                            {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                        </Typography>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "baseline" }}>
                                                        <ImQuotesLeft style={{ color: "white", fontSize: '15px' }} />
                                                        <Typography sx={{ fontSize: "16px", alignItems: "bottom" , marginLeft: '4px', marginRight: '4px'}}>
                                                            {profiles[currentIndex].userRecord.about}
                                                            <ImQuotesRight style={{ color: "white", fontSize: '15px' }} />
                                                        </Typography>
                                                    </div>
                                                </div>
                                            )}

                                            {imageIndex[currentIndex] >= 3 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "baseline" }}>
                                                        <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                            fontSize: "32px", // Adjust to match the image size
                                                            color: "white", // White text fill
                                                            WebkitTextStroke: "0.2px black", // Thicker black outline
                                                            letterSpacing: "0.5px", // Slight spacing for clarity
                                                            lineHeight: 1.2,}}>
                                                            {profiles[currentIndex].userRecord.name.split(' ').pop()}
                                                        </Typography>
                                                        <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                            fontSize: "32px", // Adjust to match the image size
                                                            color: "white", // White text fill
                                                            WebkitTextStroke: "0.2x black", // Thicker black outline
                                                            letterSpacing: "0.5px", // Slight spacing for clarity
                                                            lineHeight: 1.2,
                                                            marginLeft: '4px'}}>
                                                            {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                        </Typography>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <img
                                                            src="https://static.thenounproject.com/png/142747-200.png"
                                                            alt="Education Icon"
                                                            width="30"
                                                            height="30"
                                                            style={{filter: "brightness(0) invert(1)"}}
                                                        />
                                                        <Typography sx={{ fontSize: "18px", alignItems: "bottom", marginLeft: '4px' }}>
                                                            {profiles[currentIndex].userRecord.height} cm
                                                        </Typography>
                                                    </div>
                                                </div>
                                            )}
                                        </Box>
                                    </div>
                                </motion.div>
                        </TinderCard>
                    )}
                </div>
                <div className="buttons">
                    <button className="prevLiking" onClick={() => handleVisitButtonClick("left")}>
                        <GrPrevious size={40}/>
                    </button>
                    <button className="nextLiking" onClick={() => handleVisitButtonClick("right")}>
                        <GrNext size={40}/>
                    </button>
                </div>
            </div>
        ) : (
            (type === 'like') ? (
                <div className="tinderCards">
                    <div className="tinderCards__container">
                        {profiles[currentIndex] && (
                            <TinderCard
                                className="swipe"
                                key={profiles[currentIndex].userRecord.User_ID}
                                preventSwipe={["up", "down"]}
                                onSwipe={onSwipe}
                            >
                                    <motion.div
                                        className="card"
                                        style={{
                                            backgroundImage: `url(${profiles[currentIndex].images[imageIndex[currentIndex]]})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                        initial={{ x: 0, opacity: 1 }}
                                        animate={
                                            swipeEffect === "left"
                                                ? { x: -200, opacity: 0 }
                                                : swipeEffect === "right"
                                                    ? { x: 200, opacity: 0 }
                                                    : swipeEffect === "up"
                                                        ? { y: -200, opacity: 0 }
                                                        : {}
                                        }
                                        transition={{ duration: 0.3 }}
                                        onClick={() => handleCardClick(currentIndex)}
                                    >
                                        <img
                                            src={nopeicon}
                                            alt="Nope"
                                            style={{
                                                position: 'absolute',
                                                top: 40,
                                                left: 20,
                                                width: 200,
                                                height: 200,
                                                opacity: swipeEffect === 'left' ? 1 : 0,
                                                transition: 'opacity 0.2s',
                                                transform: swipeEffect === 'left' ? 'rotate(-20deg)' : 'none',
                                            }}
                                        />
                                        <img
                                            src={matchicon}
                                            alt="Match"
                                            style={{
                                                position: 'absolute',
                                                top: 40,
                                                right: 20,
                                                width: 200,
                                                height: 200,
                                                opacity: swipeEffect === 'right' ? 1 : 0,
                                                transition: 'opacity 0.2s',
                                                transform: swipeEffect === 'right' ? 'rotate(20deg)' : 'none',
                                            }}
                                        />
                                        <div className="image-progress-bar">
                                            {profiles[currentIndex].images.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`progress-segment ${idx === imageIndex[currentIndex] ? "active" : ""}`}
                                                />
                                            ))}
                                        </div>
                                        <button className="prevImage" onClick={(e) => { e.stopPropagation(); handlePrevImage(currentIndex); }}>
                                            <FaArrowLeft size={15} />
                                        </button>
                                        <button className="nextImage" onClick={(e) => { e.stopPropagation(); handleNextImage(currentIndex); }}>
                                            <FaArrowRight size={15} />
                                        </button>
                                        <div className="cardInfo">
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                    bottom: 20,
                                                    width: "100%",
                                                    color: "#fff",
                                                    left: 5,
                                                    maxWidth: 300,
                                                }}
                                            >
                                                {imageIndex[currentIndex] === 0  && (
                                                    <>
                                                        <div style={{ display: "flex", alignItems: "baseline" }}>
                                                            <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                                fontSize: "32px", // Adjust to match the image size
                                                                color: "white", // White text fill
                                                                WebkitTextStroke: "0.2x black", // Thicker black outline
                                                                letterSpacing: "0.5px", // Slight spacing for clarity
                                                                lineHeight: 1.2}}>
                                                                {profiles[currentIndex].userRecord.name.split(' ').pop()}
                                                            </Typography>
                                                            <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                                fontSize: "32px", // Adjust to match the image size
                                                                color: "white", // White text fill
                                                                WebkitTextStroke: "0.2x black", // Thicker black outline
                                                                letterSpacing: "0.5px", // Slight spacing for clarity
                                                                lineHeight: 1.2, marginLeft: '4px'}}>
                                                                {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                            </Typography>
                                                        </div>
                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                            <InterestsIcon style={{ color: '#dcdcdc' }} />
                                                            <Typography sx={{ fontWeight: "bold", fontSize: "15px", marginRight: "5px" , marginLeft: '4px'}}>
                                                                Sở thích
                                                            </Typography>
                                                        </div>
                                                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                                                            {profiles[currentIndex].interest.map((interest) => {
                                                                const interestObj = interests.find((item) => item.InterestID == interest);
                                                                return (
                                                                    interestObj && (
                                                                        <Chip
                                                                            key={interest}
                                                                            label={interestObj.name}
                                                                            size="small"
                                                                            sx={{
                                                                                backgroundColor: "#35363a",
                                                                                color: "#dcdcdc",
                                                                                fontWeight: "bold",
                                                                            }}
                                                                        />
                                                                    )
                                                                );
                                                            })}
                                                        </Box>
                                                    </>
                                                )}

                                                {imageIndex[currentIndex] === 1 && (
                                                    <div>
                                                        <div style={{ display: "flex", alignItems: "baseline" }}>
                                                            <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                                fontSize: "32px", // Adjust to match the image size
                                                                color: "white", // White text fill
                                                                WebkitTextStroke: "0.2x black", // Thicker black outline
                                                                letterSpacing: "0.5px", // Slight spacing for clarity
                                                                lineHeight: 1.2}}>
                                                                {profiles[currentIndex].userRecord.name.split(' ').pop()}
                                                            </Typography>
                                                            <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                                fontSize: "32px", // Adjust to match the image size
                                                                color: "white", // White text fill
                                                                WebkitTextStroke: "0.2x black", // Thicker black outline
                                                                letterSpacing: "0.5px", // Slight spacing for clarity
                                                                lineHeight: 1.2, marginLeft: '4px'}}>
                                                                {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                            </Typography>
                                                        </div>
                                                        <div style={{ display: "flex", alignItems: "center" , columnGap: 2 }}>
                                                            <FaCity style={{ color: 'white', fontSize: '20px', marginRight: '5px' }} />
                                                            <Typography sx={{ fontSize: "16px", alignItems: "bottom", marginLeft: '4px' }}>
                                                                Sống tại {profiles[currentIndex].userRecord.city}
                                                            </Typography>
                                                            <img
                                                                src="https://cdn-icons-png.flaticon.com/512/3199/3199999.png"
                                                                alt="Education Icon"
                                                                width="35"
                                                                height="35"
                                                            />
                                                            <Typography sx={{ fontSize: "16px", alignItems: "bottom", marginLeft: '4px' }}>
                                                                Đang tìm kiếm {profiles[currentIndex].userRecord.relationship}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                )}

                                                {imageIndex[currentIndex] === 2 && (
                                                    <div>
                                                        <div style={{ display: "flex", alignItems: "baseline" }}>
                                                            <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                                fontSize: "32px", // Adjust to match the image size
                                                                color: "white", // White text fill
                                                                WebkitTextStroke: "0.2x black", // Thicker black outline
                                                                letterSpacing: "0.5px", // Slight spacing for clarity
                                                                lineHeight: 1.2}}>
                                                                {profiles[currentIndex].userRecord.name.split(' ').pop()}
                                                            </Typography>
                                                            <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                                fontSize: "32px", // Adjust to match the image size
                                                                color: "white", // White text fill
                                                                WebkitTextStroke: "0.2x black", // Thicker black outline
                                                                letterSpacing: "0.5px", // Slight spacing for clarity
                                                                lineHeight: 1.2,marginLeft: '4px'}}>
                                                                {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                            </Typography>
                                                        </div>
                                                        <div style={{ display: "flex", alignItems: "baseline" }}>
                                                            <ImQuotesLeft style={{ color: "white", fontSize: '15px' }} />
                                                            <Typography sx={{ fontSize: "16px", alignItems: "bottom" , marginLeft: '4px', marginRight: '4px'}}>
                                                                {profiles[currentIndex].userRecord.about}
                                                                <ImQuotesRight style={{ color: "white", fontSize: '15px' }} />
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                )}

                                                {imageIndex[currentIndex] >= 3 && (
                                                    <div>
                                                        <div style={{ display: "flex", alignItems: "baseline" }}>
                                                            <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                                fontSize: "32px", // Adjust to match the image size
                                                                color: "white", // White text fill
                                                                WebkitTextStroke: "0.2px black", // Thicker black outline
                                                                letterSpacing: "0.5px", // Slight spacing for clarity
                                                                lineHeight: 1.2,}}>
                                                                {profiles[currentIndex].userRecord.name.split(' ').pop()}
                                                            </Typography>
                                                            <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                                fontSize: "32px", // Adjust to match the image size
                                                                color: "white", // White text fill
                                                                WebkitTextStroke: "0.2x black", // Thicker black outline
                                                                letterSpacing: "0.5px", // Slight spacing for clarity
                                                                lineHeight: 1.2,
                                                                marginLeft: '4px'}}>
                                                                {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                            </Typography>
                                                        </div>
                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                            <img
                                                                src="https://static.thenounproject.com/png/142747-200.png"
                                                                alt="Education Icon"
                                                                width="30"
                                                                height="30"
                                                                style={{filter: "brightness(0) invert(1)"}}
                                                            />
                                                            <Typography sx={{ fontSize: "18px", alignItems: "bottom", marginLeft: '4px' }}>
                                                                {profiles[currentIndex].userRecord.height} cm
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                )}
                                            </Box>
                                        </div>
                                    </motion.div>
                            </TinderCard>
                        )}
                    </div>
                    <div className="buttons">
                        <button className="dislike" onClick={() => {
                            handleLikeButtonClick("left")
                        }}>
                            <FaTimes size={35}/>
                        </button>
                        <button className="like" onClick={() => {
                            handleLikeButtonClick("right")
                            handleCreateMatches(profiles[currentIndex].userRecord.User_ID);
                        }}>
                            <FaHeart size={40}/>
                        </button>
                    </div>
                </div>
            ) : (
                (type === 'preview') ? (
                        <div className="tinderCards">
                            <div className="tinderCards__container">
                                {profiles && (
                                    <TinderCard
                                        className="swipe"
                                        key={profiles.userRecord.name}
                                        preventSwipe={["up", "down"]}
                                        onSwipe={onSwipe}
                                    >
                                        <motion.div
                                            className="card"
                                            style={{
                                                backgroundImage: `url(${profiles.images[imagePreviewIndex]})`
                                            }}
                                            initial={{ x: 0, opacity: 1 }}
                                            animate={
                                                swipeEffect === "left"
                                                    ? { x: -200, opacity: 0 }
                                                    : swipeEffect === "right"
                                                        ? { x: 200, opacity: 0 }
                                                        : swipeEffect === "up"
                                                            ? { y: -200, opacity: 0 }
                                                            : {}
                                            }
                                            transition={{ duration: 0.3 }}
                                            onClick={() => handlePreviewCardClick()}
                                        >
                                            <div className="image-progress-bar">
                                                {profiles.images.map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`progress-segment ${idx === imagePreviewIndex ? "active" : ""}`}
                                                    />
                                                ))}
                                            </div>
                                            <button className="prevImage" onClick={(e) => { e.stopPropagation(); handlePreviewPrevImage(); }}>
                                                <FaArrowLeft size={15} />
                                            </button>
                                            <button className="nextImage" onClick={(e) => { e.stopPropagation(); handlePreviewNextImage(); }}>
                                                <FaArrowRight size={15} />
                                            </button>
                                            <div className="cardInfo">
                                                <Box
                                                    sx={{
                                                        position: "relative",
                                                        bottom: 20,
                                                        width: "100%",
                                                        color: "#fff",
                                                        left: 5,
                                                        maxWidth: 300,
                                                    }}
                                                >
                                                    {imagePreviewIndex === 0  && (
                                                        <>
                                                            <div style={{ display: "flex", alignItems: "baseline" }}>
                                                                <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                                        fontSize: "32px", // Adjust to match the image size
                                                                        color: "white", // White text fill
                                                                        WebkitTextStroke: "0.2x black", // Thicker black outline
                                                                        letterSpacing: "0.5px", // Slight spacing for clarity
                                                                        lineHeight: 1.2}}>
                                                                    {profiles.userRecord.name.split(' ').pop()}
                                                                </Typography>
                                                                <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                                    fontSize: "32px", // Adjust to match the image size
                                                                    color: "white", // White text fill
                                                                    WebkitTextStroke: "0.2x black", // Thicker black outline
                                                                    letterSpacing: "0.5px", // Slight spacing for clarity
                                                                    lineHeight: 1.2, marginLeft: '4px'}}>
                                                                    {profiles.userRecord.age}
                                                                </Typography>
                                                            </div>
                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <InterestsIcon style={{ color: '#dcdcdc' }} />
                                                                <Typography sx={{ fontWeight: "bold", fontSize: "15px", marginRight: "5px" , marginLeft: '4px'}}>
                                                                    Sở thích
                                                                </Typography>
                                                            </div>
                                                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                                                                {profiles.interest.map((interest) => {
                                                                    const interestObj = interests.find((item) => item.InterestID == interest);
                                                                    return (
                                                                        interestObj && (
                                                                            <Chip
                                                                                key={interest}
                                                                                label={interestObj.name}
                                                                                size="small"
                                                                                sx={{
                                                                                    backgroundColor: "#35363a",
                                                                                    color: "#dcdcdc",
                                                                                    fontWeight: "bold",
                                                                                }}
                                                                            />
                                                                        )
                                                                    );
                                                                })}
                                                            </Box>
                                                        </>
                                                    )}

                                                    {imagePreviewIndex === 1 && (
                                                        <div>
                                                            <div style={{ display: "flex", alignItems: "baseline" }}>
                                                                <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                                        fontSize: "32px", // Adjust to match the image size
                                                                        color: "white", // White text fill
                                                                        WebkitTextStroke: "0.2x black", // Thicker black outline
                                                                        letterSpacing: "0.5px", // Slight spacing for clarity
                                                                        lineHeight: 1.2}}>
                                                                    {profiles.userRecord.name.split(' ').pop()}
                                                                </Typography>
                                                                <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                                    fontSize: "32px", // Adjust to match the image size
                                                                    color: "white", // White text fill
                                                                    WebkitTextStroke: "0.2x black", // Thicker black outline
                                                                    letterSpacing: "0.5px", // Slight spacing for clarity
                                                                    lineHeight: 1.2, marginLeft: '4px'}}>
                                                                    {profiles.userRecord.age}
                                                                </Typography>
                                                            </div>
                                                            <div style={{ display: "flex", alignItems: "center" , columnGap: 2 }}>
                                                                <FaCity style={{ color: 'white', fontSize: '20px', marginRight: '5px' }} />
                                                                <Typography sx={{ fontSize: "16px", alignItems: "bottom", marginLeft: '4px' }}>
                                                                    Sống tại {profiles.userRecord.city}
                                                                </Typography>
                                                                <img
                                                                    src="https://cdn-icons-png.flaticon.com/512/3199/3199999.png"
                                                                    alt="Education Icon"
                                                                    width="35"
                                                                    height="35"
                                                                />
                                                                <Typography sx={{ fontSize: "16px", alignItems: "bottom", marginLeft: '4px' }}>
                                                                    Đang tìm kiếm {profiles.userRecord.relationship}
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {imagePreviewIndex === 2 && (
                                                        <div>
                                                            <div style={{ display: "flex", alignItems: "baseline" }}>
                                                                <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                                        fontSize: "32px", // Adjust to match the image size
                                                                        color: "white", // White text fill
                                                                        WebkitTextStroke: "0.2x black", // Thicker black outline
                                                                        letterSpacing: "0.5px", // Slight spacing for clarity
                                                                        lineHeight: 1.2}}>
                                                                    {profiles.userRecord.name.split(' ').pop()}
                                                                </Typography>
                                                                <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                                    fontSize: "32px", // Adjust to match the image size
                                                                    color: "white", // White text fill
                                                                    WebkitTextStroke: "0.2x black", // Thicker black outline
                                                                    letterSpacing: "0.5px", // Slight spacing for clarity
                                                                    lineHeight: 1.2,marginLeft: '4px'}}>
                                                                    {profiles.userRecord.age}
                                                                </Typography>
                                                            </div>
                                                            <div style={{ display: "flex", alignItems: "baseline" }}>
                                                                <ImQuotesLeft style={{ color: "white", fontSize: '15px' }} />
                                                                <Typography sx={{ fontSize: "16px", alignItems: "bottom" , marginLeft: '4px', marginRight: '4px'}}>
                                                                    {profiles.userRecord.about}
                                                                    <ImQuotesRight style={{ color: "white", fontSize: '15px' }} />
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {imagePreviewIndex >= 3 && (
                                                        <div>
                                                            <div style={{ display: "flex", alignItems: "baseline" }}>
                                                                <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                                    fontSize: "32px", // Adjust to match the image size
                                                                    color: "white", // White text fill
                                                                    WebkitTextStroke: "0.2px black", // Thicker black outline
                                                                    letterSpacing: "0.5px", // Slight spacing for clarity
                                                                    lineHeight: 1.2,}}>
                                                                    {profiles.userRecord.name.split(' ').pop()}
                                                                </Typography>
                                                                <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                                    fontSize: "32px", // Adjust to match the image size
                                                                    color: "white", // White text fill
                                                                    WebkitTextStroke: "0.2x black", // Thicker black outline
                                                                    letterSpacing: "0.5px", // Slight spacing for clarity
                                                                    lineHeight: 1.2,
                                                                    marginLeft: '4px'}}>
                                                                    {profiles.userRecord.age}
                                                                </Typography>
                                                            </div>
                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <img
                                                                    src="https://static.thenounproject.com/png/142747-200.png"
                                                                    alt="Education Icon"
                                                                    width="30"
                                                                    height="30"
                                                                    style={{filter: "brightness(0) invert(1)"}}
                                                                />
                                                                <Typography sx={{ fontSize: "18px", alignItems: "bottom", marginLeft: '4px' }}>
                                                                    {profiles.userRecord.height} cm
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Box>
                                            </div>
                                        </motion.div>
                                    </TinderCard>
                                )}
                            </div>
                        </div>
                ) : (
                    <div className="tinderCards">
                    <Typography style={{fontSize: '24px', fontWeight: 'bold', marginBottom:'10px'}}>{index === '1' ? 'Hẹn hò': 'Bạn bè'}</Typography>
                    <div className="tinderCards__container">
                        {profiles[currentIndex] && (
                            <TinderCard
                                className="swipe"
                                key={profiles[currentIndex].userRecord.User_ID}
                                preventSwipe={["up", "down"]}
                                onSwipe={onSwipe}
                            >
                                {profiles[currentIndex].userRecord && !indexSkip.includes(profiles[currentIndex].userRecord.User_ID) && (
                                <motion.div
                                    className="card"
                                    style={{
                                        backgroundImage: `url(${profiles[currentIndex].images[imageIndex[currentIndex]]})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                    initial={{ x: 0, opacity: 1 }}
                                    animate={
                                        swipeEffect === "left"
                                            ? { x: -200, opacity: 0 }
                                            : swipeEffect === "right"
                                                ? { x: 200, opacity: 0 }
                                                : swipeEffect === "up"
                                                    ? { y: -200, opacity: 0 }
                                                    : {}
                                    }
                                    transition={{ duration: 0.3 }}
                                    onClick={() => handleCardClick(currentIndex)}
                                >
                                    <img
                                        src={nopeicon}
                                        alt="Nope"
                                        style={{
                                            position: 'absolute',
                                            top: 40,
                                            left: 20,
                                            width: 200,
                                            height: 200,
                                            opacity: swipeEffect === 'left' ? 1 : 0,
                                            transition: 'opacity 0.2s',
                                            transform: swipeEffect === 'left' ? 'rotate(-20deg)' : 'none',
                                        }}
                                    />
                                    <img
                                        src={matchicon}
                                        alt="Match"
                                        style={{
                                            position: 'absolute',
                                            top: 40,
                                            right: 20,
                                            width: 200,
                                            height: 200,
                                            opacity: swipeEffect === 'right' ? 1 : 0,
                                            transition: 'opacity 0.2s',
                                            transform: swipeEffect === 'right' ? 'rotate(20deg)' : 'none',
                                        }}
                                    />
                                    <div className="image-progress-bar">
                                        {profiles[currentIndex].images.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`progress-segment ${idx === imageIndex[currentIndex] ? "active" : ""}`}
                                            />
                                        ))}
                                    </div>
                                    <button className="prevImage" onClick={(e) => { e.stopPropagation(); handlePrevImage(currentIndex); }}>
                                        <FaArrowLeft size={15} />
                                    </button>
                                    <button className="nextImage" onClick={(e) => { e.stopPropagation(); handleNextImage(currentIndex); }}>
                                        <FaArrowRight size={15} />
                                    </button>
                                    <div className="cardInfo">
                                        <Box
                                            sx={{
                                                position: "relative",
                                                bottom: 20,
                                                width: "100%",
                                                color: "#fff",
                                                left: 5,
                                                maxWidth: 300,
                                            }}
                                        >
                                            {imageIndex[currentIndex] === 0  && (
                                                <>
                                                    <div style={{ display: "flex", alignItems: "baseline" }}>
                                                        <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                            fontSize: "32px", // Adjust to match the image size
                                                            color: "white", // White text fill
                                                            WebkitTextStroke: "0.2x black", // Thicker black outline
                                                            letterSpacing: "0.5px", // Slight spacing for clarity
                                                            lineHeight: 1.2}}>
                                                            {profiles[currentIndex].userRecord.name.split(' ').pop()}
                                                        </Typography>
                                                        <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                            fontSize: "32px", // Adjust to match the image size
                                                            color: "white", // White text fill
                                                            WebkitTextStroke: "0.2x black", // Thicker black outline
                                                            letterSpacing: "0.5px", // Slight spacing for clarity
                                                            lineHeight: 1.2, marginLeft: '4px'}}>
                                                            {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                        </Typography>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <InterestsIcon style={{ color: '#dcdcdc' }} />
                                                        <Typography sx={{ fontWeight: "bold", fontSize: "15px", marginRight: "5px" , marginLeft: '4px'}}>
                                                            Sở thích
                                                        </Typography>
                                                    </div>
                                                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                                                        {profiles[currentIndex].interest.map((interest) => {
                                                            const interestObj = interests.find((item) => item.InterestID == interest);
                                                            return (
                                                                interestObj && (
                                                                    <Chip
                                                                        key={interest}
                                                                        label={interestObj.name}
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: "#35363a",
                                                                            color: "#dcdcdc",
                                                                            fontWeight: "bold",
                                                                        }}
                                                                    />
                                                                )
                                                            );
                                                        })}
                                                    </Box>
                                                </>
                                            )}

                                            {imageIndex[currentIndex] === 1 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "baseline" }}>
                                                        <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                            fontSize: "32px", // Adjust to match the image size
                                                            color: "white", // White text fill
                                                            WebkitTextStroke: "0.2x black", // Thicker black outline
                                                            letterSpacing: "0.5px", // Slight spacing for clarity
                                                            lineHeight: 1.2}}>
                                                            {profiles[currentIndex].userRecord.name.split(' ').pop()}
                                                        </Typography>
                                                        <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                            fontSize: "32px", // Adjust to match the image size
                                                            color: "white", // White text fill
                                                            WebkitTextStroke: "0.2x black", // Thicker black outline
                                                            letterSpacing: "0.5px", // Slight spacing for clarity
                                                            lineHeight: 1.2, marginLeft: '4px'}}>
                                                            {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                        </Typography>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center" , columnGap: 2 }}>
                                                        <FaCity style={{ color: 'white', fontSize: '20px', marginRight: '5px' }} />
                                                        <Typography sx={{ fontSize: "16px", alignItems: "bottom", marginLeft: '4px' }}>
                                                            Sống tại {profiles[currentIndex].userRecord.city}
                                                        </Typography>
                                                        <img
                                                            src="https://cdn-icons-png.flaticon.com/512/3199/3199999.png"
                                                            alt="Education Icon"
                                                            width="35"
                                                            height="35"
                                                        />
                                                        <Typography sx={{ fontSize: "16px", alignItems: "bottom", marginLeft: '4px' }}>
                                                            Đang tìm kiếm {profiles[currentIndex].userRecord.relationship}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            )}

                                            {imageIndex[currentIndex] === 2 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "baseline" }}>
                                                        <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                            fontSize: "32px", // Adjust to match the image size
                                                            color: "white", // White text fill
                                                            WebkitTextStroke: "0.2x black", // Thicker black outline
                                                            letterSpacing: "0.5px", // Slight spacing for clarity
                                                            lineHeight: 1.2}}>
                                                            {profiles[currentIndex].userRecord.name.split(' ').pop()}
                                                        </Typography>
                                                        <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                            fontSize: "32px", // Adjust to match the image size
                                                            color: "white", // White text fill
                                                            WebkitTextStroke: "0.2x black", // Thicker black outline
                                                            letterSpacing: "0.5px", // Slight spacing for clarity
                                                            lineHeight: 1.2,marginLeft: '4px'}}>
                                                            {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                        </Typography>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "baseline" }}>
                                                        <ImQuotesLeft style={{ color: "white", fontSize: '15px' }} />
                                                        <Typography sx={{ fontSize: "16px", alignItems: "bottom" , marginLeft: '4px', marginRight: '4px'}}>
                                                            {profiles[currentIndex].userRecord.about}
                                                            <ImQuotesRight style={{ color: "white", fontSize: '15px' }} />
                                                        </Typography>
                                                    </div>
                                                </div>
                                            )}

                                            {imageIndex[currentIndex] >= 3 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "baseline" }}>
                                                        <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                            fontSize: "32px", // Adjust to match the image size
                                                            color: "white", // White text fill
                                                            WebkitTextStroke: "0.2px black", // Thicker black outline
                                                            letterSpacing: "0.5px", // Slight spacing for clarity
                                                            lineHeight: 1.2,}}>
                                                            {profiles[currentIndex].userRecord.name.split(' ').pop()}
                                                        </Typography>
                                                        <Typography sx={{fontWeight: 900, // Extra bold for thick text
                                                            fontSize: "32px", // Adjust to match the image size
                                                            color: "white", // White text fill
                                                            WebkitTextStroke: "0.2x black", // Thicker black outline
                                                            letterSpacing: "0.5px", // Slight spacing for clarity
                                                            lineHeight: 1.2,
                                                            marginLeft: '4px'}}>
                                                            {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                        </Typography>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <img
                                                            src="https://static.thenounproject.com/png/142747-200.png"
                                                            alt="Education Icon"
                                                            width="30"
                                                            height="30"
                                                            style={{filter: "brightness(0) invert(1)"}}
                                                        />
                                                        <Typography sx={{ fontSize: "18px", alignItems: "bottom", marginLeft: '4px' }}>
                                                            {profiles[currentIndex].userRecord.height} cm
                                                        </Typography>
                                                    </div>
                                                </div>
                                            )}
                                        </Box>
                                    </div>
                                </motion.div>
                                    )}
                            </TinderCard>
                        )}
                    </div>
                    <div className="buttons">
                        <button className="dislike" style={{border: "none"}} onClick={() => {
                            handleButtonClick("left");
                            handleSkipSuggestion(currentIndex);
                        }}>
                            <FaTimes size={35} color={"green"}/>
                        </button>
                        <button className="superlike" style={{border: "none"}} onClick={() => handleButtonClick("up")}>
                            <FaStar size={50}/>
                        </button>
                        <button className="like" style={{border: "none"}} onClick={() => {
                            handleButtonClick("right");
                            handleLikeSuggestion(currentIndex, profiles[currentIndex].userRecord.User_ID);
                        }}>
                            <FaHeart size={40} color={"red"}/>
                        </button>
                    </div>
                </div>
                )
            )
        )
    );
}

// Export the component as default
export default memo(MediaCard);
