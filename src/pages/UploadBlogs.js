import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const BlogUpload = () => {
    const apiUrl = process.env.REACT_APP_BASE_URL;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');

    const handleUpload = async () => {
        try {
            await axios.post(`${apiUrl}blogs`, { title, content, author });
            alert('Blog uploaded successfully');
        } catch (error) {
            console.error('Error uploading blog', error);
        }
    };

    return (
        <div>
            <h2>Create a New Blog Post</h2>
            <input
                type="text"
                placeholder="Blog Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <ReactQuill theme="snow" value={content} onChange={setContent} />
            <input
                type="text"
                placeholder="Author Name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
            />
            <button onClick={handleUpload}>Upload Blog</button>
        </div>
    );
};

export default BlogUpload;
