export const postData = {
  total_pages: 2,
  results: [
    {
      id: 1,
      placeName: "東京タワー",
      userPost: 1,
      accessStars: 3,
      congestionDegree: 3,
      img: "http://localhost:8000/media/posts/2test.jpg",
      tags: [
        {
          id: 1,
          name: "絶景スポット",
        },
      ],
    },
    {
      id: 2,
      placeName: "京都祇園",
      userPost: 2,
      accessStars: 4,
      congestionDegree: 2,
      img: "http://localhost:8000/media/posts/3test.jpg",
      tags: [
        {
          id: 2,
          name: "歴史的スポット"
        }
      ]
    },
    {
      id: 3,
      placeName: "沖縄美ら海水族館",
      userPost: 3,
      accessStars: 5,
      congestionDegree: 4,
      img: "http://localhost:8000/media/posts/4test.jpg",
      tags: [
        {
          id: 3,
          name: "水族館"
        }
      ]
    },
    {
      id: 4,
      placeName: "友ヶ島",
      userPost: 1,
      accessStars: 3,
      congestionDegree: 3,
      img: "http://localhost:8000/media/posts/2test.jpg",
      tags: [],
    },
    {
      id: 5,
      placeName: "洞爺湖",
      userPost: 1,
      accessStars: 3,
      congestionDegree: 3,
      img: "http://localhost:8000/media/posts/2test.jpg",
      tags: [
        {
          id: 1,
          name: "北海道",
        },
      ],
    },
    {
      id: 6,
      placeName: "松島",
      userPost: 1,
      accessStars: 3,
      congestionDegree: 3,
      img: "http://localhost:8000/media/posts/2test.jpg",
      tags: [
        {
          id: 1,
          name: "絶景スポット",
        },
      ],
    },
    {
      id: 7,
      placeName: "五箇山",
      userPost: 1,
      accessStars: 3,
      congestionDegree: 3,
      img: "http://localhost:8000/media/posts/2test.jpg",
      tags: [
        {
          id: 1,
          name: "絶景スポット",
        },
        {
          id: 6,
          name: "山"
        }
      ],
    },
    {
      id: 8,
      placeName: "大國魂神社",
      userPost: 1,
      accessStars: 3,
      congestionDegree: 3,
      img: "http://localhost:8000/media/posts/2test.jpg",
      tags: [],
    },
    {
      id: 9,
      placeName: "日原鍾乳洞",
      userPost: 1,
      accessStars: 3,
      congestionDegree: 3,
      img: "http://localhost:8000/media/posts/2test.jpg",
      tags: [
        {
          id: 1,
          name: "絶景スポット",
        },
      ],
    },
    {
      id: 10,
      placeName: "清澄庭園",
      userPost: 1,
      accessStars: 3,
      congestionDegree: 3,
      img: "http://localhost:8000/media/posts/2test.jpg",
      tags: [
        {
          id: 1,
          name: "絶景スポット",
        },
      ],
    },
    {
      id: 11,
      placeName: "長峰山",
      userPost: 1,
      accessStars: 3,
      congestionDegree: 3,
      img: "http://localhost:8000/media/posts/2test.jpg",
      tags: [
        {
          id: 1,
          name: "絶景スポット",
        },
      ],
    },
    {
      id: 12,
      placeName: "夕日の丘",
      userPost: 1,
      accessStars: 3,
      congestionDegree: 3,
      img: "http://localhost:8000/media/posts/2test.jpg",
      tags: [
        {
          id: 1,
          name: "絶景スポット",
        },
      ],
    },
  ],
};

export const postData2 = {
  total_pages: 2,
  results: [
    {
      id: 13,
      placeName: "高尾山",
      userPost: 1,
      accessStars: 3,
      congestionDegree: 3,
      img: "http://localhost:8000/media/posts/2test.jpg",
      tags: [
        {
          id: 6,
          name: "山",
        },
      ],
    },
  ],
};


export const NewPostData = {
  id: 7,
  userPost: 1,
  placeName: "国営昭和記念公園",
  description:
    "四季折々の花がみられるのに加えて、夏には非常に広いプールも楽しめる",
  accessStars: 5,
  congestionDegree: 4,
  img: null,
  tags: [{ name: "test" }],
}

export const PostDetailData = {
  id: 1,
  placeName: "国営昭和記念公園",
  description: "四季折々の花がみられる",
  accessStars: 5,
  congestionDegree: 4,
  img: null,
  tags: [{name: "花"}],
  userPost: 2,
  nickName: "myNickName",
  profileImage: null
}

export const updatePostData = {
  id: 1,
  userPost: 1,
  placeName: "国営昭和記念公園 update",
  description:
    "四季折々の花がみられるのに加えて、夏には非常に広いプールも楽しめる",
  accessStars: 5,
  congestionDegree: 4,
  img: null,
}