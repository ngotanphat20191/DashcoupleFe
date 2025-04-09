
export const inputs = {
    firstname: '',
    surname: '',
    username: '',
    email: '',
    password1: '',
    password2: '',
}
export const currentUser = {
    username: "Ngo Tan Phat",
    location: "Viet Nam",
    profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
    age: 29,
    interests: [
        "Nhiếp ảnh",
        "Du lịch",
        "Nấu ăn",
        "Đọc sách",
        "Tập thể dục",
    ],
}
export const chatroomInfo = {
    username: "John Cena",
    profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",}
export const usermatch = {
    username: "Shihara",
    location: "New York, USA",
    email: "shihara@gmail.com",
    gender: 1,
    popularityRate: 80,
    profilePicture:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
    age: 25,
    liking: true,
    liked: true,
    match: true,
    score: 78,
    images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        "https://dogagingproject.org/_next/image?url=https%3A%2F%2Fcontent.dogagingproject.org%2Fwp-content%2Fuploads%2F2020%2F11%2Fhelena-lopes-S3TPJCOIRoo-unsplash-scaled.jpg&w=3840&q=75",
        "https://images.squarespace-cdn.com/content/v1/569ec99b841abaccb7c7e74c/3b881e1e-c302-4804-8559-c4c4c4be1cf2/Red+Fox_Ray+Hennessy_2017-11-20.jpg?format=1500w",
    ],
    interests: [
        { interestName: "Nhiếp ảnh" },
        { interestName: "Du lịch" },
        { interestName: "Nấu ăn" },
        { interestName: "Đọc sách" },
        { interestName: "Tập thể dục" }
    ],
    notificationMail: true,
    notificationPush: true,
    matchID: "1",
    description: "toi ten la shihara",
    sexualOrientation: 2,
};
export const interestNames = [
    { name: "Nhiếp ảnh" },
    { name: "Du lịch" },
    { name: "Nấu ăn" },
    { name: "Đọc sách" },
    { name: "Tập thể dục" },
    { name: "Âm nhạc" },
    { name: "Chơi game" },
    { name: "Đi bộ đường dài" },
    { name: "Nghệ thuật" },
    { name: "Khiêu vũ" },
    { name: "Bơi lội" },
    { name: "Đạp xe" },
    { name: "Viết lách" },
    { name: "Làm vườn" },
    { name: "Thiền" },
    { name: "Phim ảnh" },
    { name: "Chạy bộ" },
    { name: "Câu cá" },
    { name: "Thủ công" }
];
export const chatroomMessages = [
    {
        author: "John Cena",
        id: "1",
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        content: "Phát, hỗm rài thế nào",
        time: "21:30 25/02/2025"
    },
    {
        author: "Ngo Tan Phat",
        id: "2",
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        content: "Cena, tôi ổn, bạn thì sao ?",
        time: "21:31 25/02/2025"

    },
    {
        author: "John Cena",
        id: "3",
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        content: "Rất tốt, tôi vừa mới hoàn thành một dự án, hiện tại tôi cảm thấy thoải mái.",
        time: "21:32 25/02/2025"

    },
    {
        author: "Ngo Tan Phat",
        id: "4",
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        content: "Chúc mừng nha, tối nay bạn rảnh không",
        time: "21:33 25/02/2025"
    },
    {
        author: "John Cena",
        id: "5",
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        content: "Cảm ơn, tôi đang tính đi xem phim, bạn đi không",
        time: "21:34 25/02/2025"
    },
    {
        author: "Ngo Tan Phat",
        id: "6",
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        content: "Đợi tôi vài phút tôi qua liền",
        time: "21:35 25/02/2025"
    },
];
export const matchList = [
    {
        matchID: "1",
        read: true,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        username: "John Cena",
        content: "Phát, hỗm rài thế nào",
    },
    {
        matchID: "2",
        read: false,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        username: "sarah_connor",
        content: "Lần trước gặp bạn tôi rất vui, chúng ta đi chơi lần nữa đi",
    },
    {
        matchID: "3",
        read: false,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        username: "kevin_durant",
        content: "Chào buổi sáng, bạn có kế hoạch gì không",
    },
];
export const notification = [
    {
        id: 1,
        username: "john_doe",
        read: true,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        event: "message",
        date: "2025-01-08T10:00:00Z",
    },
    {
        id: 2,
        username: "jane_smith",
        read: false,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        event: "like",
        date: "2025-01-07T14:30:00Z",
    },
    {
        id: 3,
        username: "mike_tyson",
        read: false,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        event: "visit",
        date: "2025-01-07T08:15:00Z",
    },
    {
        id: 4,
        username: "anna_karenina",
        read: true,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        event: "match",
        date: "2025-01-06T20:45:00Z",
    },
    {
        id: 5,
        username: "leo_tolstoy",
        read: true,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        event: "unmatch",
        date: "2025-01-05T12:00:00Z",
    },
];
export const likedProfile = [
    {
        username: "alex_woods",
        location: "New York, USA",
        popularityRate: 87,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        age: 29,
        liking: false,
        liked: false,
        match: false,
        score: 78,
    },
    {
        username: "Liana",
        location: "California, USA",
        popularityRate: 87,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        age: 29,
        liking: false,
        liked: false,
        match: false,
        score: 78,
    },
    {
        username: "sarah_connor",
        location: "Los Angeles, USA",
        popularityRate: 92,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        age: 27,
        liking: false,
        liked: true,
        match: true,
        score: 95,
    },
    {
        username: "emma_brown",
        location: "London, UK",
        popularityRate: 89,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        age: 26,
        liking: true,
        liked: false,
        match: false,
        score: 85,
    },
    {
        username: "john_smith",
        location: "Sydney, Australia",
        popularityRate: 70,
        profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg",
        age: 31,
        liking: false,
        liked: true,
        match: false,
        score: 73,
    },
];
export const religionNames  = [
    { title: "Phật giáo" },
    { title: "Kitô giáo" },
    { title: "Hồi giáo" },
    { title: "Hindu giáo" },
    { title: "Do Thái giáo" },
    { title: "Sikh giáo" },
    { title: "Thần đạo" },
    { title: "Đạo giáo" },
    { title: "Baha'i giáo" },
    { title: "Jain giáo" },
    { title: "Thuyết vô thần" },
    { title: "Thuyết bất khả tri" },
    { title: "Tôn giáo dân gian" },
    { title: "Đạo Cao Đài" },
    { title: "Tôn giáo khác" }
];