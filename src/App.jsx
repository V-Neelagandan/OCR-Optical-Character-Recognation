import { useState } from "react";
import axios from "axios";

function OCRViewer() {
  const [file, setFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMsg("");
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:5000/upload", formData);
      setUploadMsg(res.data.message || res.data.error);
      setFile(null);
    } catch (err) {
      console.error("Upload Error:", err);
      setUploadMsg("Upload failed. Try again.");
    }
  };

  const loadResults = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/retrieve");
      setResults(res.data);
    } catch (err) {
      console.error("Retrieve Error:", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">📤 Upload File for OCR</h2>

      <div className="mb-3">
        <input type="file" onChange={handleFileChange} className="form-control" />
        <button onClick={uploadFile} className="btn btn-success mt-2">
          Upload
        </button>
        {uploadMsg && <p className="mt-2 text-info">{uploadMsg}</p>}
      </div>

      <hr />

      <h3 className="mb-3 text-primary">📄 Extracted OCR Results</h3>
      <button onClick={loadResults} className="btn btn-primary mb-3">
        Show Results
      </button>

      {results.length === 0 ? (
        <p>No OCR results yet.</p>
      ) : (
        results.map((item, idx) => (
          <div key={idx} className="card mb-3">
            <div className="card-header bg-light">
              <strong>📁 {item.filename}</strong>
            </div>
            <div className="card-body">
              {item.filename.match(/\.(png|jpg|jpeg)$/i) && (
                <img
                  src={`http://127.0.0.1:5000/uploads/${item.filename}`}
                  alt={item.filename}
                  className="img-fluid mb-3"
                  style={{ maxHeight: "300px" }}
                />
              )}
              <pre className="bg-light p-3 border rounded">
                {item.extract_text || "No text extracted."}
              </pre>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OCRViewer