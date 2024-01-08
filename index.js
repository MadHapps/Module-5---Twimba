import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let showModal = false
const replyModalEl = document.getElementById('reply-modal-container')

document.addEventListener('click', function (e) {
    // console.log(`showModal: ${showModal}`)
    console.log(e.target)

    //Increment/Decrement Like Count
    if (e.target.dataset.like) {
        handleHeartIconClick(e.target.dataset.like)
    }
    //Increment/Decrement Retweet Count
    else if (e.target.dataset.retweet) {
        handleRetweetIconClick(e.target.dataset.retweet)
    }
    //Remove tweet
    else if (e.target.dataset.trash) {
        handleTrashIconClick(e.target.dataset.trash)
    }
    //Click Tweet Body to drop-down/display replies
    else if (e.target.dataset.tweetBody) {
        handleTweetBodyClick(e.target.dataset.tweetBody)
    }
    //Post tweet
    else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick()
    }
    //Display reply modal
    else if (e.target.dataset.reply) {
        handleChatIconClick(e.target.dataset.reply)
        showModal = true
    }
    //Post reply from reply modal
    else if (e.target.dataset.replyBtn) {
        handleReplyBtnClick(e.target.dataset.replyBtn)
        toggleReplyModal()
        showModal = false
        console.log("Reply sent")
    }
    //Close reply modal if clicking outside of modal
    else if (e.target.id === 'twimba-body' || e.target.id === 'close-reply-modal') {
        console.log('twimba-body clicked!')
        if (showModal) {
            showModal = false
            toggleReplyModal()
        }
    }
})

function handleHeartIconClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--
    }
    else {
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetIconClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--
    }
    else {
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render()
}

function handleTrashIconClick(tweetId) {
    tweetsData.forEach((tweet, index) => {
        if (tweet.uuid === tweetId) {
            tweetsData.splice(index, 1)
        }
    })
    render()
}

function handleTweetBodyClick(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleChatIconClick(replyId) {
    const replyTargetObj = tweetsData.filter((tweet) => {
        return tweet.uuid === replyId
    })[0]

    const modalHtml = `
<div class="reply-modal" id="reply-modal">
<i class="fa-solid fa-xmark close-reply-modal-icon" id="close-reply-modal"></i>
    <div class="tweet-inner">
        <img src="${replyTargetObj.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${replyTargetObj.handle}</p>
            <p class="tweet-text" data-tweet-body="${replyTargetObj.uuid}">${replyTargetObj.tweetText}</p>
        </div>            
    </div>
    <div class="replying-to-wrapper">
        <p>Replying to ${replyTargetObj.handle}</p>
    </div>
    <div class="tweet-input-area">
        <img src="images/joey-trail-cropped.png" class="profile-pic">
        <textarea placeholder="Post your reply" id="reply-input"></textarea>
    </div>
    <button id="reply-btn" data-reply-btn="${replyId}">Reply</button>
</div>`

    toggleReplyModal()
    replyModalEl.innerHTML = modalHtml
}

function toggleReplyModal() {
    replyModalEl.classList.toggle('hidden')
}

function handleReplyBtnClick(replyId) {
    const replyInput = document.getElementById('reply-input')
    const replyTargetObj = tweetsData.filter((tweet) => {
        return tweet.uuid === replyId
    })[0]

    if (replyInput.value) {
        replyTargetObj.replies.unshift({
            handle: `@Jpag`,
            profilePic: `images/joey-trail-cropped.png`,
            tweetText: replyInput.value,
        })
        replyInput.value = ''
        render()
        handleTweetBodyClick(replyId)
    }
}

function handleTweetBtnClick() {
    const tweetInput = document.getElementById('tweet-input')

    if (tweetInput.value) {
        tweetsData.unshift({
            handle: `@JPag`,
            profilePic: `images/joey-trail-cropped.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        render()
        tweetInput.value = ''
    }

}

function getFeedHtml() {
    let feedHtml = ``

    tweetsData.forEach(function (tweet) {

        let likeIconClass = ''

        if (tweet.isLiked) {
            likeIconClass = 'liked'
        }

        let retweetIconClass = ''

        if (tweet.isRetweeted) {
            retweetIconClass = 'retweeted'
        }

        let repliesHtml = ''

        if (tweet.replies.length > 0) {
            tweet.replies.forEach(function (reply) {
                repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }


        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text" data-tweet-body="${tweet.uuid}">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash"
                    data-trash="${tweet.uuid}"
                    ></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
    })
    return feedHtml
}

function render() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

