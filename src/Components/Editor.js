import React, { useState } from 'react';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import axios from 'axios';

const BlogUpload = () => {
  const [froalaContent, setFroalaContent] = useState('');
  const [blogId, setBlogId] = useState(null);
  const froalaConfig = {
    imageUploadURL: 'http://localhost:4000/api/upload_image', // Use your actual API URL
    imageUploadParams: {
      id: 'my_editor'
    },
    toolbarButtons: [
      'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
      'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle',
      '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote',
      'insertHR', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable',
      '|', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'
    ]
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/save_blog', { content: froalaContent });
      setBlogId(response.data.id);
      alert('Blog saved successfully!');
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  return (
    <div>
     
      <FroalaEditor
        tag='textarea'
        model={froalaContent}
        onModelChange={setFroalaContent}
        config={froalaConfig}
      />
      {/* <button onClick={handleSubmit}>Submit</button> */}
      {blogId && <p>Blog uploaded successfully with ID: {blogId}</p>}
    </div>
  );
};

export default BlogUpload;
