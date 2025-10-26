import { db, collection, addDoc, getDocs, query, orderBy, limit, where, doc, getDoc, updateDoc, deleteDoc, increment, serverTimestamp } from './firebase-config.js';

// ==================== POSTS ====================

// Create a new post
async function createPost(authorId, authorName, title, content, excerpt, community) {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      title: title,
      content: content,
      excerpt: excerpt,
      authorId: authorId,
      authorName: authorName,
      community: community,
      likes: 0,
      commentCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Post created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// Get all posts (with pagination)
async function getPosts(limitCount = 10, communityFilter = null) {
  try {
    let q;
    if (communityFilter) {
      q = query(
        collection(db, 'posts'),
        where('community', '==', communityFilter),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    } else {
      q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
}

// Get single post by ID
async function getPost(postId) {
  try {
    const docRef = doc(db, 'posts', postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('No such post!');
      return null;
    }
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  }
}

// Update a post
async function updatePost(postId, updates) {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log('Post updated successfully');
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

// Delete a post
async function deletePost(postId) {
  try {
    await deleteDoc(doc(db, 'posts', postId));
    console.log('Post deleted successfully');
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

// Like a post
async function likePost(postId, userId) {
  try {
    // Add like to likes collection
    await addDoc(collection(db, 'likes'), {
      postId: postId,
      userId: userId,
      createdAt: serverTimestamp()
    });
    
    // Increment like count on post
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(1)
    });
    
    console.log('Post liked successfully');
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
}

// ==================== COMMENTS ====================

// Create a comment
async function createComment(postId, authorId, authorName, content) {
  try {
    const docRef = await addDoc(collection(db, 'comments'), {
      postId: postId,
      authorId: authorId,
      authorName: authorName,
      content: content,
      likes: 0,
      createdAt: serverTimestamp()
    });
    
    // Increment comment count on post
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      commentCount: increment(1)
    });
    
    console.log('Comment created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

// Get comments for a post
async function getComments(postId, limitCount = 50) {
  try {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const comments = [];
    querySnapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
}

// ==================== COMMUNITIES ====================

// Create a community
async function createCommunity(name, displayName, description) {
  try {
    const docRef = await addDoc(collection(db, 'communities'), {
      name: name,
      displayName: displayName,
      description: description,
      memberCount: 0,
      createdAt: serverTimestamp()
    });
    console.log('Community created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating community:', error);
    throw error;
  }
}

// Get all communities
async function getCommunities() {
  try {
    const querySnapshot = await getDocs(collection(db, 'communities'));
    const communities = [];
    querySnapshot.forEach((doc) => {
      communities.push({ id: doc.id, ...doc.data() });
    });
    return communities;
  } catch (error) {
    console.error('Error getting communities:', error);
    throw error;
  }
}

// ==================== USERS ====================

// Create user profile
async function createUserProfile(userId, name, email, bio = '', avatar = '') {
  try {
    await addDoc(collection(db, 'users'), {
      userId: userId,
      name: name,
      email: email,
      bio: bio,
      avatar: avatar,
      createdAt: serverTimestamp()
    });
    console.log('User profile created');
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

// Get user profile
async function getUserProfile(userId) {
  try {
    const q = query(collection(db, 'users'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

// Export all functions
export {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  createComment,
  getComments,
  createCommunity,
  getCommunities,
  createUserProfile,
  getUserProfile
};import { db, collection, addDoc, getDocs, query, orderBy, limit, where, doc, getDoc, updateDoc, deleteDoc, increment, serverTimestamp } from './firebase-config.js';

// ==================== POSTS ====================

// Create a new post
async function createPost(authorId, authorName, title, content, excerpt, community) {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      title: title,
      content: content,
      excerpt: excerpt,
      authorId: authorId,
      authorName: authorName,
      community: community,
      likes: 0,
      commentCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Post created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// Get all posts (with pagination)
async function getPosts(limitCount = 10, communityFilter = null) {
  try {
    let q;
    if (communityFilter) {
      q = query(
        collection(db, 'posts'),
        where('community', '==', communityFilter),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    } else {
      q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
}

// Get single post by ID
async function getPost(postId) {
  try {
    const docRef = doc(db, 'posts', postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('No such post!');
      return null;
    }
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  }
}

// Update a post
async function updatePost(postId, updates) {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log('Post updated successfully');
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

// Delete a post
async function deletePost(postId) {
  try {
    await deleteDoc(doc(db, 'posts', postId));
    console.log('Post deleted successfully');
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

// Like a post
async function likePost(postId, userId) {
  try {
    // Add like to likes collection
    await addDoc(collection(db, 'likes'), {
      postId: postId,
      userId: userId,
      createdAt: serverTimestamp()
    });
    
    // Increment like count on post
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(1)
    });
    
    console.log('Post liked successfully');
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
}

// ==================== COMMENTS ====================

// Create a comment
async function createComment(postId, authorId, authorName, content) {
  try {
    const docRef = await addDoc(collection(db, 'comments'), {
      postId: postId,
      authorId: authorId,
      authorName: authorName,
      content: content,
      likes: 0,
      createdAt: serverTimestamp()
    });
    
    // Increment comment count on post
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      commentCount: increment(1)
    });
    
    console.log('Comment created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

// Get comments for a post
async function getComments(postId, limitCount = 50) {
  try {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const comments = [];
    querySnapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
}

// ==================== COMMUNITIES ====================

// Create a community
async function createCommunity(name, displayName, description) {
  try {
    const docRef = await addDoc(collection(db, 'communities'), {
      name: name,
      displayName: displayName,
      description: description,
      memberCount: 0,
      createdAt: serverTimestamp()
    });
    console.log('Community created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating community:', error);
    throw error;
  }
}

// Get all communities
async function getCommunities() {
  try {
    const querySnapshot = await getDocs(collection(db, 'communities'));
    const communities = [];
    querySnapshot.forEach((doc) => {
      communities.push({ id: doc.id, ...doc.data() });
    });
    return communities;
  } catch (error) {
    console.error('Error getting communities:', error);
    throw error;
  }
}

// ==================== USERS ====================

// Create user profile
async function createUserProfile(userId, name, email, bio = '', avatar = '') {
  try {
    await addDoc(collection(db, 'users'), {
      userId: userId,
      name: name,
      email: email,
      bio: bio,
      avatar: avatar,
      createdAt: serverTimestamp()
    });
    console.log('User profile created');
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

// Get user profile
async function getUserProfile(userId) {
  try {
    const q = query(collection(db, 'users'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

// Export all functions
export {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  createComment,
  getComments,
  createCommunity,
  getCommunities,
  createUserProfile,
  getUserProfile
};