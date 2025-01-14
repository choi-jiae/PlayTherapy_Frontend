import Dropzone, { useDropzone } from 'react-dropzone';
import { CSSProperties } from 'react';
import React from 'react';

const baseStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

interface DropzoneComponentProps {
    onFileChange: (file: File | null) => void;
}

const DropzoneComponent: React.FC<DropzoneComponentProps> = ({ onFileChange }) => {
    const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
        maxFiles: 1,
        accept: {'video/mp4': ['.mp4']},
        maxSize: 3 * 1024 * 1024 * 1024 // 3 GB
    });
    
    const files = acceptedFiles.map(file => (
        <li key={file.name}>
            {file.name} - {(file.size / 2**20).toFixed(2)} MB
        </li>
    ));

    React.useEffect(() => {
        onFileChange(acceptedFiles[0] || null);
    }, [acceptedFiles, onFileChange]);

    const style = isDragActive ? { ...baseStyle, ...activeStyle } : baseStyle;

    return (
        <section className="container">
            <div {...getRootProps({style, className: 'dropzone'})}>
                <input {...getInputProps()} />
                <p>Drag and drop only 1 mp4 file here, or click to select file (max size: 3GB)</p>
            </div>
            <aside>
                <h4>Selected File</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    );
}

export default DropzoneComponent;