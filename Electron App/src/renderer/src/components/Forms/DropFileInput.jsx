// DropFileInput.jsx
import React, { useRef, useState } from 'react'
import styles from './DropFileInput.module.css'

export default function DropFileInput({ file, setFile }) {
  const wrapperRef = useRef(null)

  const onDragEnter = () => wrapperRef.current.classList.add('dragover')

  const onDragLeave = () => wrapperRef.current.classList.remove('dragover')

  const onDrop = () => wrapperRef.current.classList.remove('dragover')

  const onFileDrop = (e) => {
    const newFile = e.target.files[0]
    console.log(newFile)
    setFile(newFile)
  }

  function removeFile(event) {
    event.preventDefault()
    setFile(undefined)
  }

  return (
    <>
      {file == undefined ? (
        <div
          ref={wrapperRef}
          className={styles.drop_file_input}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className={styles.drop_file_input_label}>
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z"
                clipRule="evenodd"
              />
            </svg>
            <p>Drag & Drop your files here</p>
          </div>
          <input type="file" value="" onChange={onFileDrop} multiple={false} />
        </div>
      ) : (
        <div className={styles.file}>
          <p>{file.name}</p>
          <button onClick={removeFile}>
            <svg
              className={styles.remove}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
