import React from 'react'
import Post from './Post'

const UserProfile = ({user, loggedUser}) => {
    return (
        <>
            {user.posts.map(post => <Post content={post.content} user={post.username} avatar={post.avatar} createdAt={post.createdAt} loggedUser={loggedUser} postID={post._id}></Post>)}
        </>
    )
}

export default UserProfile
