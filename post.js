document.addEventListener('DOMContentLoaded', () => {
    const PostContent = document.getElementById('post_content');
    const loadMoare = document.getElementById('moretoload');
    const userModal = document.getElementById('modelofuser');
    const userInfo = document.getElementById('infoofuser');
    const closeModal = document.getElementById('close_modal');

    let currentPage = 1;
    const postsPerPage = 5;

    const userCache = {}; // user data

    // Fetch and display posts with pagination
    async function fetchPosts(page) {
        try {
            const response = await fetch(`https://dummyjson.com/posts?limit=${postsPerPage}&skip=${(page - 1) * postsPerPage}`);
            const { posts, total } = await response.json();

            if (!posts.length) {
                loadMoare.style.display = 'none';
                PostContent.innerHTML += '<p>No more posts available.</p>';
                return;
            }

            for (const post of posts) {
                await displayPost(post);
            }

            if (page * postsPerPage >= total) {
                loadMoare.style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            PostContent.innerHTML = '<p>No internet connection and error in loading posts. Please try again later.</p>';
        }
    }

    // Individual post
    async function displayPost(post) {
        try {
            const user = await fetchUser(post.userId);
            const comments = await fetchComments(post.id);

            const postElement = document.createElement('article');
            postElement.className = 'post';

            const postDate = new Date(post.createdAt).toLocaleDateString();

            // Handle reactions 
            let reactionsDisplay = '';
            if (typeof post.reactions === 'object') {
                reactionsDisplay = `👍 ${post.reactions.likes || 0} | 👎 ${post.reactions.dislikes || 0} | ❤️ ${post.reactions.hearts || 0}`;
            } else {
                reactionsDisplay = post.reactions;
            }

            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <p><strong>Tags:</strong> ${post.tags.join(', ')}</p>
                <p><strong>Reactions:</strong> ${reactionsDisplay}</p>
                <p><strong>By:</strong> <a href="#" class="user-link" data-userid="${user.id}">${user.username}</a></p>
                <h4>Comments:</h4>
                <ul>${comments.length ? comments.map(c => `<li>${c.body}</li>`).join('') : '<li>No comments available.</li>'}</ul>
                
            `;//<p><String>date:</strong> ${postDate}</p>

            PostContent.appendChild(postElement);
        } catch (error) {
            console.error('Error displaying post:', error);
            PostContent.innerHTML += '<p>Error loading this post.</p>';
        }
    }

    // Fetch user details 
    async function fetchUser(userId) {
        if (userCache[userId]) return userCache[userId];

        try {
            const response = await fetch(`https://dummyjson.com/users/${userId}`);
            const userData = await response.json();
            userCache[userId] = userData;
            return userData;
        } catch (error) {
            console.error('Error fetching user:', error);
            return { id: userId, username: 'Unknown' };
        }
    }

    // Fetch comments for a post
    async function fetchComments(postId) {
        try {
            const response = await fetch(`https://dummyjson.com/comments/post/${postId}`);
            const { comments } = await response.json();
            return comments;
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    }

    // Load more posts 

    //loadMoare.addEventListener('click', () => {
    //setTimeout(() => { }, 3000); // Delays by 3 seconds (3000ms)


    loadMoare.addEventListener('click', () => {
        currentPage++;
        fetchPosts(currentPage);
    });

    // Handle click on username 
    PostContent.addEventListener('click', async (e) => {
        if (e.target.classList.contains('user-link')) {
            e.preventDefault();
            const userId = e.target.dataset.userid;
            const user = await fetchUser(userId);
            openUserModal(user);
        }
    });

    // Open user profile 
    function openUserModal(user) {
        userInfo.innerHTML = `  
            <img src="contact.png" alt="Dynamic Web Image" class="image-section">
            <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Address:</strong> ${user.address.city}, ${user.address.state}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Company:</strong> ${user.company.name}</p>
            
        `;
        userModal.classList.remove('hidden');
    }

    // Close user modal
    closeModal.addEventListener('click', () => {
        userModal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === userModal) {
            userModal.classList.add('hidden');
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !userModal.classList.contains('hidden')) {
            userModal.classList.add('hidden');
        }
    });

    // Initial load
    fetchPosts(currentPage);

    console.log('Posts script loaded successfully');
});