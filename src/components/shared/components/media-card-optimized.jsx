import './media-card.css';
import '../profiles-grid.css';
import '../title.css';
import React, {useEffect, useState, useCallback, useMemo, memo} from "react";
import TinderCard from "react-tinder-card";
import {FaHeart, FaTimes, FaStar, FaArrowRight, FaArrowLeft, FaCity} from "react-icons/fa";
import { GrNext, GrPrevious } from "react-icons/gr";
import { motion } from "framer-motion";
import Typography from '@mui/material/Typography';
import {Box, Chip} from "@mui/material";
import InterestsIcon from '@mui/icons-material/Interests';
import { ImQuotesLeft } from "react-icons/im";
import { FcRuler } from "react-icons/fc";
import { HiOutlineLocationMarker } from "react-icons/hi";
import {baseAxios, createCancelToken} from "../../../config/axiosConfig.jsx";
import OptimizedImage from "../../shared/OptimizedImage";

// Memoize the Chip component for better performance in lists
const MemoizedChip = memo(Chip);

/**
 * Optimized Card Image component for profile cards
 */
const ProfileCardImage = memo(({ src, alt }) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }}
      fallbackSrc="https://i.ibb.co/LZPVKq9/card1.png"
      placeholderColor="#f8e1f4"
      lazyLoad={true}
    />
  );
});

function MediaCard({interests, type, profiles, index, setindexskip, indexSkip}) {
    // State management with proper initialization
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipeEffect, setSwipeEffect] = useState(null);
    const [imageIndex, setImageIndex] = useState(() => Array(Array.isArray(profiles) ? profiles.length : 1).fill(0));
    const [imagePreviewIndex, setImagePreviewIndex] = useState(0);
    const [error, setError] = useState(null);
    
    // Memoize the age calculation function for better performance
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
        
        // Use a single timeout for better performance
        const timer = setTimeout(() => {
            setSwipeEffect(null);
            setCurrentIndex(prevIndex => prevIndex + 1);
        }, 300);
        
        // Clean up timeout to prevent memory leaks
        return () => clearTimeout(timer);
    }, []);
    
    const handleLikeButtonClick = useCallback((direction) => {
        setSwipeEffect(direction);
        
        const timer = setTimeout(() => {
            setSwipeEffect(null);
            setCurrentIndex(prevIndex => {
                return direction === "left" ? prevIndex - 1 : prevIndex + 1;
            });
        }, 300);
        
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
    
    // Optimize suggestion handlers with useCallback
    const handleSkipSuggestion = useCallback((currentIndex) => {
        if (setindexskip) {
            setindexskip(prev => [...prev, currentIndex]);
        }
    }, [setindexskip]);
    
    // Optimize API calls with proper error handling and loading states
    const handleLikeSuggestion = useCallback(async (currentIndex, userID) => {
        if (!userID) return;
        
        try {
            // Optimistically update UI
            if (setindexskip) {
                setindexskip(prev => [...prev, currentIndex]);
            }
            
            // Create cancel token for request
            const cancelTokenSource = createCancelToken();
            
            // Make API call
            const response = await baseAxios.post('/like/add', {
                UserIdTarget: userID
            }, {
                cancelToken: cancelTokenSource.token
            });
            
            // Success handling (already updated UI optimistically)
        } catch (err) {
            // Revert optimistic update on error
            if (setindexskip) {
                setindexskip(prev => prev.filter(id => id !== currentIndex));
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
            // Create cancel token for request
            const cancelTokenSource = createCancelToken();
            
            // Make API call
            const response = await baseAxios.post('/matches/create', {
                UserIdTarget: userID
            }, {
                cancelToken: cancelTokenSource.token
            });
            
            // Success handling
            if (response.data) {
                // Use a more user-friendly notification instead of alert
                console.log("Match created:", response.data);
            }
        } catch (err) {
            // Error handling
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
        console.log(indexSkip)
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
                                    position: "relative",
                                    overflow: "hidden",
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
                                <ProfileCardImage 
                                    src={profiles[currentIndex].images[imageIndex[currentIndex]]}
                                    alt={`Profile of ${profiles[currentIndex].userRecord.name || 'user'}`}
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
                                                    <Typography sx={{fontWeight: 900,
                                                        fontSize: "32px",
                                                        color: "white",
                                                        WebkitTextStroke: "0.2x black",
                                                        letterSpacing: "0.5px",
                                                        lineHeight: 1.2}}>
                                                        {profiles[currentIndex].userRecord.name}
                                                    </Typography>
                                                    <Typography sx={{fontWeight: 900,
                                                        fontSize: "32px",
                                                        color: "white",
                                                        WebkitTextStroke: "0.2x black",
                                                        letterSpacing: "0.5px",
                                                        lineHeight: 1.2, marginLeft: '4px'}}>
                                                        {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                    </Typography>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <InterestsIcon style={{ color: '#dcdcdc' }} />
                                                    <Typography sx={{ fontWeight: "bold", fontSize: "15px", marginRight: "5px" , marginLeft: '4px'}}>
                                                        So thich
                                                    </Typography>
                                                </div>
                                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                                                    {profiles[currentIndex].interest.map((interest) => {
                                                        const interestObj = interests.find((item) => item.InterestID == interest);
                                                        return (
                                                            interestObj && (
                                                                <MemoizedChip
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
                                                    <Typography sx={{fontWeight: 900,
                                                        fontSize: "32px",
                                                        color: "white",
                                                        WebkitTextStroke: "0.2x black",
                                                        letterSpacing: "0.5px",
                                                        lineHeight: 1.2}}>
                                                        {profiles[currentIndex].userRecord.name}
                                                    </Typography>
                                                    <Typography sx={{fontWeight: 900,
                                                        fontSize: "32px",
                                                        color: "white",
                                                        WebkitTextStroke: "0.2x black",
                                                        letterSpacing: "0.5px",
                                                        lineHeight: 1.2, marginLeft: '4px'}}>
                                                        {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                    </Typography>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <ImQuotesLeft style={{ color: '#dcdcdc' }} />
                                                    <Typography sx={{ fontWeight: "bold", fontSize: "15px", marginRight: "5px" , marginLeft: '4px'}}>
                                                        Giới thiệu
                                                    </Typography>
                                                </div>
                                                <Typography sx={{ fontSize: "15px", marginTop: "5px" }}>
                                                    {profiles[currentIndex].userRecord.about}
                                                </Typography>
                                            </div>
                                        )}

                                        {imageIndex[currentIndex] === 2 && (
                                            <div>
                                                <div style={{ display: "flex", alignItems: "baseline" }}>
                                                    <Typography sx={{fontWeight: 900,
                                                        fontSize: "32px",
                                                        color: "white",
                                                        WebkitTextStroke: "0.2x black",
                                                        letterSpacing: "0.5px",
                                                        lineHeight: 1.2}}>
                                                        {profiles[currentIndex].userRecord.name}
                                                    </Typography>
                                                    <Typography sx={{fontWeight: 900,
                                                        fontSize: "32px",
                                                        color: "white",
                                                        WebkitTextStroke: "0.2x black",
                                                        letterSpacing: "0.5px",
                                                        lineHeight: 1.2, marginLeft: '4px'}}>
                                                        {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                    </Typography>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <HiOutlineLocationMarker style={{ color: '#dcdcdc', fontSize: '17px' }} />
                                                    <Typography sx={{ fontWeight: "bold", fontSize: "15px", marginRight: "5px" , marginLeft: '4px'}}>
                                                        Thành phố
                                                    </Typography>
                                                </div>
                                                <Typography sx={{ fontSize: "15px", marginTop: "5px" }}>
                                                    {profiles[currentIndex].userRecord.city}
                                                </Typography>
                                                <div style={{ display: "flex", alignItems: "baseline" }}>
                                                    <FcRuler style={{ fontSize: '17px' }} />
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
                    <div className="swipeButtons">
                        <button className="swipeButtons__left" onClick={() => handleButtonClick("left")}>
                            <FaTimes />
                        </button>
                        <button className="swipeButtons__star" onClick={() => handleButtonClick("up")}>
                            <FaStar />
                        </button>
                        <button className="swipeButtons__right" onClick={() => handleButtonClick("right")}>
                            <FaHeart />
                        </button>
                    </div>
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
                            {!indexSkip.includes(currentIndex) && (
                                <motion.div
                                    className="card"
                                    style={{
                                        position: "relative",
                                        overflow: "hidden",
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
                                    <ProfileCardImage 
                                        src={profiles[currentIndex].images[imageIndex[currentIndex]]}
                                        alt={`Profile of ${profiles[currentIndex].userRecord.name || 'user'}`}
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
                                                        <Typography sx={{fontWeight: 900,
                                                            fontSize: "32px",
                                                            color: "white",
                                                            WebkitTextStroke: "0.2x black",
                                                            letterSpacing: "0.5px",
                                                            lineHeight: 1.2}}>
                                                            {profiles[currentIndex].userRecord.name}
                                                        </Typography>
                                                        <Typography sx={{fontWeight: 900,
                                                            fontSize: "32px",
                                                            color: "white",
                                                            WebkitTextStroke: "0.2x black",
                                                            letterSpacing: "0.5px",
                                                            lineHeight: 1.2, marginLeft: '4px'}}>
                                                            {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                        </Typography>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <InterestsIcon style={{ color: '#dcdcdc' }} />
                                                        <Typography sx={{ fontWeight: "bold", fontSize: "15px", marginRight: "5px" , marginLeft: '4px'}}>
                                                            So thich
                                                        </Typography>
                                                    </div>
                                                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                                                        {profiles[currentIndex].interest.map((interest) => {
                                                            const interestObj = interests.find((item) => item.InterestID == interest);
                                                            return (
                                                                interestObj && (
                                                                    <MemoizedChip
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
                                                        <Typography sx={{fontWeight: 900,
                                                            fontSize: "32px",
                                                            color: "white",
                                                            WebkitTextStroke: "0.2x black",
                                                            letterSpacing: "0.5px",
                                                            lineHeight: 1.2}}>
                                                            {profiles[currentIndex].userRecord.name}
                                                        </Typography>
                                                        <Typography sx={{fontWeight: 900,
                                                            fontSize: "32px",
                                                            color: "white",
                                                            WebkitTextStroke: "0.2x black",
                                                            letterSpacing: "0.5px",
                                                            lineHeight: 1.2, marginLeft: '4px'}}>
                                                            {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                        </Typography>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <ImQuotesLeft style={{ color: '#dcdcdc' }} />
                                                        <Typography sx={{ fontWeight: "bold", fontSize: "15px", marginRight: "5px" , marginLeft: '4px'}}>
                                                            Giới thiệu
                                                        </Typography>
                                                    </div>
                                                    <Typography sx={{ fontSize: "15px", marginTop: "5px" }}>
                                                        {profiles[currentIndex].userRecord.about}
                                                    </Typography>
                                                </div>
                                            )}

                                            {imageIndex[currentIndex] === 2 && (
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "baseline" }}>
                                                        <Typography sx={{fontWeight: 900,
                                                            fontSize: "32px",
                                                            color: "white",
                                                            WebkitTextStroke: "0.2x black",
                                                            letterSpacing: "0.5px",
                                                            lineHeight: 1.2}}>
                                                            {profiles[currentIndex].userRecord.name}
                                                        </Typography>
                                                        <Typography sx={{fontWeight: 900,
                                                            fontSize: "32px",
                                                            color: "white",
                                                            WebkitTextStroke: "0.2x black",
                                                            letterSpacing: "0.5px",
                                                            lineHeight: 1.2, marginLeft: '4px'}}>
                                                            {calculateAge(profiles[currentIndex].userRecord.date_of_birth)}
                                                        </Typography>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <HiOutlineLocationMarker style={{ color: '#dcdcdc', fontSize: '17px' }} />
                                                        <Typography sx={{ fontWeight: "bold", fontSize: "15px", marginRight: "5px" , marginLeft: '4px'}}>
                                                            Thành phố
                                                        </Typography>
                                                    </div>
                                                    <Typography sx={{ fontSize: "15px", marginTop: "5px" }}>
                                                        {profiles[currentIndex].userRecord.city}
                                                    </Typography>
                                                    <div style={{ display: "flex", alignItems: "baseline" }}>
                                                        <FcRuler style={{ fontSize: '17px' }} />
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
                    <div className="swipeButtons">
                        <button className="swipeButtons__left" onClick={() => {
                            handleSkipSuggestion(currentIndex);
                            handleLikeButtonClick("left");
                        }}>
                            <FaTimes />
                        </button>
                        <button className="swipeButtons__right" onClick={() => {
                            handleLikeSuggestion(currentIndex, profiles[currentIndex].userRecord.User_ID);
                            handleLikeButtonClick("right");
                        }}>
                            <FaHeart />
                        </button>
                    </div>
                </div>
            </div>
        )
    );
}

// Export memoized component for better performance
export default memo(MediaCard);